import { useEffect } from 'react';
import { Outlet } from 'react-router';
import type { MetaFunction } from 'react-router';
import { SessionProvider, useSession, usePersist } from '~/lib/session-store';

export const meta: MetaFunction = () => [{ name: 'robots', content: 'noindex, nofollow' }];
import { ProgressBar } from '~/components/wizard/ProgressBar';

function SessionLayout() {
  const session = useSession();
  const { setSessionToken } = usePersist();

  useEffect(() => {
    const token = sessionStorage.getItem('core-view_session_token');
    if (token) {
      setSessionToken(token);
    }
  }, [setSessionToken]);

  return (
    <div className="min-h-dvh bg-paper">
      <div className="w-full max-w-[480px] mx-auto px-5 py-6">
        <ProgressBar currentStep={session.currentStep} />
        <div className="mt-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default function SessionWrapper() {
  return (
    <SessionProvider>
      <SessionLayout />
    </SessionProvider>
  );
}
