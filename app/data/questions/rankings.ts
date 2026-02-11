import type { RankingSet } from '~/types/questions';

export const rankingSets: RankingSet[] = [
  {
    id: 'r1',
    prompt: 'Rank from most to least important to you',
    timeLimitMs: 15000,
    items: [
      { id: 'r1a', label: 'Freedom', dimensionWeights: { uncertainty: 10, social: -8, response: 5 } },
      { id: 'r1b', label: 'Security', dimensionWeights: { processing: -5, uncertainty: -10, response: -5 } },
      { id: 'r1c', label: 'Recognition', dimensionWeights: { energy: 8, social: 5, response: 5 } },
      { id: 'r1d', label: 'Connection', dimensionWeights: { energy: 5, social: 10 } },
    ],
  },
  {
    id: 'r2',
    prompt: 'In what order would you choose these workdays?',
    timeLimitMs: 20000,
    items: [
      {
        id: 'r2a',
        label: 'A full day of uninterrupted work on one big problem',
        dimensionWeights: { energy: -10, processing: -10, uncertainty: -5, social: -8, response: -5 },
      },
      {
        id: 'r2b',
        label: 'Five short meetings with different people',
        dimensionWeights: { energy: 10, processing: 10, uncertainty: 3, social: 8, response: 8 },
      },
      {
        id: 'r2c',
        label: 'A brainstorm with your team about something completely new',
        dimensionWeights: { energy: 5, processing: 5, uncertainty: 10, social: 8, response: 5 },
      },
      {
        id: 'r2d',
        label: 'A day where you set your own agenda with no obligations',
        dimensionWeights: { energy: -5, uncertainty: 5, social: -10 },
      },
    ],
  },
  {
    id: 'r3',
    prompt: 'What would you give up first if you had to?',
    timeLimitMs: 15000,
    items: [
      { id: 'r3a', label: 'Socializing', dimensionWeights: { energy: 5, social: 10, response: 3 } },
      { id: 'r3b', label: 'Control', dimensionWeights: { uncertainty: -10, social: -3, response: -5 } },
      { id: 'r3c', label: 'Depth', dimensionWeights: { energy: -5, processing: -10, social: -5, response: -3 } },
      { id: 'r3d', label: 'Spontaneity', dimensionWeights: { energy: 3, processing: 3, uncertainty: 10, response: 8 } },
    ],
  },
  {
    id: 'r4',
    prompt: 'Rank how you prefer to make decisions',
    timeLimitMs: 15000,
    items: [
      {
        id: 'r4a',
        label: 'Research everything, then decide',
        dimensionWeights: { energy: -5, processing: -10, uncertainty: -8, social: -5, response: -10 },
      },
      { id: 'r4b', label: 'Go with my gut', dimensionWeights: { processing: 5, uncertainty: 5, response: 8 } },
      {
        id: 'r4c',
        label: 'Talk it through with people I trust',
        dimensionWeights: { energy: 5, uncertainty: -3, social: 10 },
      },
      {
        id: 'r4d',
        label: 'Just start and adjust along the way',
        dimensionWeights: { energy: 5, processing: 8, uncertainty: 10, social: -3, response: 10 },
      },
    ],
  },
];
