import type { WarmupQuestion } from '~/types/questions';

export const warmupQuestions: WarmupQuestion[] = [
  {
    id: 'w1',
    question: 'How would you ideally start a free Saturday?',
    options: [
      {
        id: 'w1a',
        label: 'Quietly with coffee and a book',
        dimensionScores: { energy: -8, processing: -5, uncertainty: -3, social: -5, response: -3 },
      },
      {
        id: 'w1b',
        label: 'Straight outside — walk, run, or exercise',
        dimensionScores: { energy: 5, processing: 3, uncertainty: 3, social: -3, response: 8 },
      },
      {
        id: 'w1c',
        label: 'Meet up with friends for breakfast',
        dimensionScores: { energy: 8, processing: 3, social: 8, response: 5 },
      },
      {
        id: 'w1d',
        label: "Work on a project I can't get to during the week",
        dimensionScores: { energy: -3, processing: -8, uncertainty: -5, social: -5, response: 3 },
      },
    ],
  },
  {
    id: 'w2',
    question: "You get an unexpected day off. What's your first reaction?",
    options: [
      {
        id: 'w2a',
        label: "Great, I don't have to do anything",
        dimensionScores: { energy: -5, uncertainty: -3, social: -3, response: -5 },
      },
      {
        id: 'w2b',
        label: 'Immediately start making plans',
        dimensionScores: { energy: 3, uncertainty: -8, response: 8 },
      },
      {
        id: 'w2c',
        label: "See who's available",
        dimensionScores: { energy: 5, processing: 3, uncertainty: 3, social: 8, response: 5 },
      },
      {
        id: 'w2d',
        label: 'Finally time to dive into something',
        dimensionScores: { energy: -8, processing: -8, social: -5, response: -3 },
      },
    ],
  },
  {
    id: 'w3',
    question: "In a group conversation, you're usually the one who...",
    options: [
      {
        id: 'w3a',
        label: 'Listens and speaks up later',
        dimensionScores: { energy: -8, processing: -5, social: -3, response: -8 },
      },
      {
        id: 'w3b',
        label: 'Gets the conversation going',
        dimensionScores: { energy: 8, processing: 3, uncertainty: 3, social: 5, response: 8 },
      },
      {
        id: 'w3c',
        label: 'Keeps things on track',
        dimensionScores: { processing: -5, uncertainty: -5, social: 3, response: -3 },
      },
      { id: 'w3d', label: 'Asks follow-up questions', dimensionScores: { energy: 3, processing: -3, social: 8 } },
    ],
  },
  {
    id: 'w4',
    question: 'When do you feel most satisfied at the end of a workday?',
    options: [
      {
        id: 'w4a',
        label: 'When I did deep, focused work on one thing',
        dimensionScores: { energy: -8, processing: -10, uncertainty: -3, social: -8, response: -3 },
      },
      {
        id: 'w4b',
        label: 'When I got a lot of different things done',
        dimensionScores: { energy: 5, processing: 8, response: 8 },
      },
      { id: 'w4c', label: 'When I had great conversations', dimensionScores: { energy: 5, processing: 3, social: 10 } },
      {
        id: 'w4d',
        label: 'When I cracked a tough problem',
        dimensionScores: { energy: -3, processing: -5, uncertainty: 5, social: -3 },
      },
    ],
  },
];
