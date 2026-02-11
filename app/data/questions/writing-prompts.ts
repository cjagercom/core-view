import type { WritingPrompt } from '~/types/questions';

export const writingPrompts: WritingPrompt[] = [
  {
    id: 'wp1',
    prompt:
      'Describe a moment when you felt completely in your element. Where were you? What were you doing? Who was with you?',
    timeLimitMs: 120000,
    followUpQuestions: [
      {
        id: 'fu1',
        question: 'In that moment, were you alone or with others?',
        options: [
          { id: 'fu1a', label: 'Completely alone', dimensionScores: { energy: -10, processing: -3, social: -10 } },
          { id: 'fu1b', label: 'With one or two people', dimensionScores: { processing: -3, social: 5 } },
          { id: 'fu1c', label: 'In a group', dimensionScores: { energy: 8, processing: 3, social: 10, response: 3 } },
          {
            id: 'fu1d',
            label: 'It varied — sometimes alone, sometimes together',
            dimensionScores: { energy: 3, processing: 5, uncertainty: 5, social: 3, response: 3 },
          },
        ],
      },
      {
        id: 'fu2',
        question: 'Were you making something, analyzing something, or organizing something?',
        options: [
          {
            id: 'fu2a',
            label: 'Making — I was creating or building something',
            dimensionScores: { energy: -3, processing: -5, uncertainty: 5, social: -3, response: 5 },
          },
          {
            id: 'fu2b',
            label: 'Analyzing — I was deep into something',
            dimensionScores: { energy: -8, processing: -10, uncertainty: -3, social: -5, response: -5 },
          },
          {
            id: 'fu2c',
            label: 'Organizing — I was bringing structure or direction',
            dimensionScores: { energy: 3, processing: 5, uncertainty: -8, social: 5, response: 3 },
          },
          {
            id: 'fu2d',
            label: 'None of these — it was more of an experience',
            dimensionScores: { processing: 3, uncertainty: 8, social: 3 },
          },
        ],
      },
      {
        id: 'fu3',
        question: 'Did that moment feel familiar or new?',
        options: [
          {
            id: 'fu3a',
            label: 'Very familiar — this is just who I am',
            dimensionScores: { processing: -5, uncertainty: -8 },
          },
          {
            id: 'fu3b',
            label: 'New — I surprised myself',
            dimensionScores: { energy: 3, processing: 5, uncertainty: 10, response: 5 },
          },
          {
            id: 'fu3c',
            label: 'A mix — a familiar activity in a new context',
            dimensionScores: { uncertainty: 3, response: 3 },
          },
        ],
      },
      {
        id: 'fu4',
        question: 'If you could recreate that moment at work, would you...',
        options: [
          {
            id: 'fu4a',
            label: 'Want to carve out more time for it in my schedule',
            dimensionScores: { energy: -5, processing: -8, uncertainty: -5, social: -5, response: -5 },
          },
          {
            id: 'fu4b',
            label: 'Want to share it with colleagues',
            dimensionScores: { energy: 5, processing: 3, social: 10, response: 3 },
          },
          {
            id: 'fu4c',
            label: 'Want to redesign my work entirely around it',
            dimensionScores: { energy: 3, processing: 5, uncertainty: 10, response: 8 },
          },
          {
            id: 'fu4d',
            label: 'Just let it happen more often spontaneously',
            dimensionScores: { processing: 3, uncertainty: 5, response: 8 },
          },
        ],
      },
    ],
  },
];
