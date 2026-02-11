import {
  createContext,
  useContext,
  useReducer,
  useState,
  useCallback,
  useRef,
  type Dispatch,
  type ReactNode,
} from 'react';
import type { SessionState, SessionAction, SessionResponse, WizardStep } from '~/types/session';
import { accumulateScores, createAccumulator } from '~/engine/scoring';
import { getReactionTimeMultiplier } from '~/engine/reaction-time';

function createInitialState(): SessionState {
  return {
    currentStep: 'warmup',
    responses: [],
    startedAt: new Date().toISOString(),
    dimensionAccumulator: createAccumulator(),
  };
}

function sessionReducer(state: SessionState, action: SessionAction): SessionState {
  switch (action.type) {
    case 'ADD_RESPONSE': {
      const newAccumulator = structuredClone(state.dimensionAccumulator);
      accumulateScores(newAccumulator, action.scores);
      return {
        ...state,
        responses: [...state.responses, action.payload],
        dimensionAccumulator: newAccumulator,
      };
    }
    case 'ADD_RANKING_RESPONSE': {
      const newAccumulator = structuredClone(state.dimensionAccumulator);
      const rtMultiplier = getReactionTimeMultiplier(action.reactionTimeMs, action.timeLimitMs);
      accumulateScores(newAccumulator, action.scores, rtMultiplier);
      return {
        ...state,
        responses: [...state.responses, action.payload],
        dimensionAccumulator: newAccumulator,
      };
    }
    case 'SET_STEP':
      return { ...state, currentStep: action.step };
    case 'RESET':
      return createInitialState();
    default:
      return state;
  }
}

interface SessionContextValue extends SessionState {
  sessionToken: string | null;
}

const SessionContext = createContext<SessionContextValue | null>(null);
const SessionDispatchContext = createContext<Dispatch<SessionAction> | null>(null);
const PersistContext = createContext<{
  setSessionToken: (token: string) => void;
  persistStep: (step: WizardStep, responses: SessionResponse[], writingText?: string) => void;
} | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(sessionReducer, null, createInitialState);
  const [sessionToken, setSessionToken] = useState<string | null>(null);

  // Ref always holds the latest reducer state, readable from async callbacks
  // without stale closure issues
  const stateRef = useRef(state);
  stateRef.current = state;

  const persistStep = useCallback(
    (step: WizardStep, responses: SessionResponse[], writingText?: string) => {
      if (!sessionToken) return;

      // Fire-and-forget save to API
      // Read accumulator from ref to get the latest state (avoids stale closure)
      fetch(`/api/session/${sessionToken}/step`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          step,
          responses,
          dimensionAccumulator: stateRef.current.dimensionAccumulator,
          writingText,
        }),
      }).catch(() => {
        // Silently handle save errors — in-memory state still works
      });
    },
    [sessionToken],
  );

  const contextValue: SessionContextValue = {
    ...state,
    sessionToken,
  };

  return (
    <SessionContext.Provider value={contextValue}>
      <SessionDispatchContext.Provider value={dispatch}>
        <PersistContext.Provider value={{ setSessionToken, persistStep }}>{children}</PersistContext.Provider>
      </SessionDispatchContext.Provider>
    </SessionContext.Provider>
  );
}

export function useSession(): SessionContextValue {
  const context = useContext(SessionContext);
  if (!context) throw new Error('useSession must be used within SessionProvider');
  return context;
}

export function useSessionDispatch(): Dispatch<SessionAction> {
  const context = useContext(SessionDispatchContext);
  if (!context) throw new Error('useSessionDispatch must be used within SessionProvider');
  return context;
}

export function usePersist() {
  const context = useContext(PersistContext);
  if (!context) throw new Error('usePersist must be used within SessionProvider');
  return context;
}
