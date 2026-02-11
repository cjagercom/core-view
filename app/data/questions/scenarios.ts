import type { Scenario } from '~/types/questions';

export const scenarios: Scenario[] = [
  {
    id: 's1',
    ageContext: "You're 8 years old",
    prompt: "It's raining outside and you have the whole afternoon free.",
    options: [
      {
        id: 's1a',
        label: 'Build or craft something from whatever you can find',
        dimensionScores: { energy: -5, processing: -8, uncertainty: 5, social: -8, response: 3 },
      },
      {
        id: 's1b',
        label: 'Read a book or draw',
        dimensionScores: { energy: -10, processing: -8, uncertainty: -5, social: -10, response: -5 },
      },
      {
        id: 's1c',
        label: 'Call or visit a friend',
        dimensionScores: { energy: 8, processing: 3, social: 10, response: 5 },
      },
      {
        id: 's1d',
        label: 'Invent a game, even if you have to play alone',
        dimensionScores: { energy: -3, processing: 5, uncertainty: 10, social: -5, response: 8 },
      },
      {
        id: 's1e',
        label: 'Watch TV or listen to music',
        dimensionScores: { energy: -5, processing: 5, uncertainty: -3, social: -3, response: -3 },
      },
    ],
  },
  {
    id: 's2',
    ageContext: "You're 10 years old",
    prompt: 'Your class is going on a field trip to an amusement park.',
    options: [
      {
        id: 's2a',
        label: 'You want to ride everything, the scarier the better',
        dimensionScores: { energy: 8, processing: 8, uncertainty: 10, social: 3, response: 10 },
      },
      {
        id: 's2b',
        label: "You want to stick with your best friend, doesn't matter what you do",
        dimensionScores: { energy: 3, social: 12 },
      },
      {
        id: 's2c',
        label: 'You study the map first and make a plan',
        dimensionScores: { energy: -5, processing: -5, uncertainty: -10, social: -3, response: -8 },
      },
      {
        id: 's2d',
        label: 'You wander around and see what catches your eye',
        dimensionScores: { energy: -3, processing: 5, uncertainty: 8, social: -5, response: 3 },
      },
      {
        id: 's2e',
        label: 'You become fascinated by how one of the rides works',
        dimensionScores: { energy: -8, processing: -10, social: -8, response: -5 },
      },
    ],
  },
  {
    id: 's3',
    ageContext: "You're 7 years old",
    prompt: "There's a fight in your friend group.",
    options: [
      {
        id: 's3a',
        label: 'You try to bring everyone back together',
        dimensionScores: { energy: 5, uncertainty: -3, social: 12, response: 5 },
      },
      {
        id: 's3b',
        label: 'You pull back and wait for it to blow over',
        dimensionScores: { energy: -10, uncertainty: -5, social: -8, response: -8 },
      },
      {
        id: 's3c',
        label: 'You pick a side and say what you think',
        dimensionScores: { energy: 5, uncertainty: 5, social: 3, response: 10 },
      },
      {
        id: 's3d',
        label: "You go do something else — it'll sort itself out",
        dimensionScores: { energy: -5, processing: 3, uncertainty: 3, social: -10 },
      },
    ],
  },
  {
    id: 's4',
    ageContext: "You're 12 years old",
    prompt: 'You have to write a report on a topic of your choice.',
    options: [
      {
        id: 's4a',
        label: 'You pick something you already know a lot about and go as deep as possible',
        dimensionScores: { energy: -5, processing: -12, uncertainty: -5, social: -8, response: -5 },
      },
      {
        id: 's4b',
        label: "You pick something completely new that you're curious about",
        dimensionScores: { energy: -3, processing: -5, uncertainty: 10, social: -5, response: 3 },
      },
      {
        id: 's4c',
        label: 'You work on it together with a classmate',
        dimensionScores: { energy: 5, processing: 3, social: 10, response: 3 },
      },
      {
        id: 's4d',
        label: 'You make it into something creative — a poster, model, or something unexpected',
        dimensionScores: { energy: 3, processing: 5, uncertainty: 8, social: -3, response: 8 },
      },
    ],
  },
  {
    id: 's5',
    ageContext: "You're 9 years old",
    prompt: "Your parents take you to a party where you don't know anyone.",
    options: [
      {
        id: 's5a',
        label: 'You hide behind your parents and observe',
        dimensionScores: { energy: -10, processing: -5, uncertainty: -8, social: -8, response: -8 },
      },
      {
        id: 's5b',
        label: 'You find other kids and join in',
        dimensionScores: { energy: 8, processing: 3, uncertainty: 5, social: 8, response: 8 },
      },
      {
        id: 's5c',
        label: 'You find something interesting to play with (a pet, a book, a gadget)',
        dimensionScores: { energy: -8, processing: -8, social: -10 },
      },
      {
        id: 's5d',
        label: 'You introduce yourself to an adult and start asking questions',
        dimensionScores: { energy: 5, uncertainty: 8, social: 5, response: 5 },
      },
    ],
  },
  {
    id: 's6',
    ageContext: "You're 11 years old",
    prompt: 'You just lost a competition.',
    options: [
      {
        id: 's6a',
        label: 'You analyze what went wrong and want to try again',
        dimensionScores: { energy: -3, processing: -8, uncertainty: -3, social: -5, response: -3 },
      },
      {
        id: 's6b',
        label: "You're disappointed but quickly move on to something else",
        dimensionScores: { energy: 3, processing: 8, uncertainty: 5, response: 8 },
      },
      {
        id: 's6c',
        label: 'You look for comfort from someone',
        dimensionScores: { energy: 5, processing: 3, uncertainty: -3, social: 10, response: 3 },
      },
      {
        id: 's6d',
        label: "You don't really mind — you were in it for the fun",
        dimensionScores: { energy: -3, processing: 5, uncertainty: 8, social: 3, response: 5 },
      },
    ],
  },
];
