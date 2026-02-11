import type { FeedbackQuestion } from '~/types/feedback';

export const feedbackQuestions: FeedbackQuestion[] = [
  {
    id: 'fb1',
    question: 'When this person walks into a room, what do you notice first?',
    options: [
      { id: 'fb1a', label: 'Their calm, observing presence', dimensionScores: { energy: -8, response: -5 } },
      { id: 'fb1b', label: 'Their energy and enthusiasm', dimensionScores: { energy: 8, response: 5 } },
      { id: 'fb1c', label: 'The way they connect with people', dimensionScores: { social: 8, energy: 3 } },
      {
        id: 'fb1d',
        label: 'Their focus — they seem to be thinking about something',
        dimensionScores: { processing: -5, energy: -5 },
      },
    ],
  },
  {
    id: 'fb2',
    question: 'In a crisis, this person is the one who...',
    options: [
      { id: 'fb2a', label: 'Takes charge and acts immediately', dimensionScores: { response: 10, energy: 5 } },
      { id: 'fb2b', label: 'Stays calm and thinks it through', dimensionScores: { response: -10, energy: -3 } },
      { id: 'fb2c', label: 'Checks in on everyone first', dimensionScores: { social: 10, response: 3 } },
      {
        id: 'fb2d',
        label: 'Analyzes the situation before doing anything',
        dimensionScores: { processing: -8, response: -5 },
      },
    ],
  },
  {
    id: 'fb3',
    question: 'If you had to describe their work style in one word, it would be...',
    options: [
      { id: 'fb3a', label: 'Thorough', dimensionScores: { processing: -8, uncertainty: -5 } },
      { id: 'fb3b', label: 'Fast', dimensionScores: { response: 8, processing: 5 } },
      { id: 'fb3c', label: 'Creative', dimensionScores: { uncertainty: 8, processing: 3 } },
      { id: 'fb3d', label: 'Collaborative', dimensionScores: { social: 8, energy: 3 } },
    ],
  },
  {
    id: 'fb4',
    question: 'What this person does best in a team is...',
    options: [
      { id: 'fb4a', label: 'Bring people together', dimensionScores: { social: 10, energy: 5 } },
      { id: 'fb4b', label: 'Solve the hard problems', dimensionScores: { processing: -10, social: -3 } },
      { id: 'fb4c', label: 'Keep things moving', dimensionScores: { response: 8, uncertainty: 3 } },
      {
        id: 'fb4d',
        label: 'Make sure nothing falls through the cracks',
        dimensionScores: { uncertainty: -8, processing: -3 },
      },
    ],
  },
  {
    id: 'fb5',
    question: 'This person would be happiest working...',
    options: [
      {
        id: 'fb5a',
        label: 'Alone on a deep, complex project',
        dimensionScores: { energy: -10, processing: -8, social: -8 },
      },
      {
        id: 'fb5b',
        label: 'Leading a team toward a shared goal',
        dimensionScores: { energy: 5, social: 8, response: 3 },
      },
      {
        id: 'fb5c',
        label: 'Exploring new ideas with a small group',
        dimensionScores: { uncertainty: 8, social: 3, processing: 3 },
      },
      {
        id: 'fb5d',
        label: 'Juggling lots of different things',
        dimensionScores: { processing: 8, response: 5, uncertainty: 3 },
      },
    ],
  },
  {
    id: 'fb6',
    question: 'Something this person has always been like, even when you first met them:',
    options: [
      { id: 'fb6a', label: 'Curious about everything', dimensionScores: { uncertainty: 8, processing: 3 } },
      { id: 'fb6b', label: 'Steady and reliable', dimensionScores: { uncertainty: -8, response: -5 } },
      { id: 'fb6c', label: 'Warm and people-oriented', dimensionScores: { social: 10, energy: 3 } },
      { id: 'fb6d', label: 'Independent and self-driven', dimensionScores: { social: -8, energy: -3 } },
    ],
  },
];
