import type { DimensionId } from '~/types/questions';

export const dimensions = [
  {
    id: 'energy' as DimensionId,
    name: 'Energy Orientation',
    leftPole: 'Internal',
    rightPole: 'External',
    leftDescription: 'You draw energy from solitude, reflection, and your inner world',
    rightDescription: 'You draw energy from interaction, action, and the outside world',
  },
  {
    id: 'processing' as DimensionId,
    name: 'Information Processing',
    leftPole: 'Deep',
    rightPole: 'Broad',
    leftDescription: 'You go deep into few things, specialist mindset',
    rightDescription: 'You take in a lot, switch quickly, generalist mindset',
  },
  {
    id: 'uncertainty' as DimensionId,
    name: 'Uncertainty Tolerance',
    leftPole: 'Structure',
    rightPole: 'Exploration',
    leftDescription: 'You seek certainty, plan ahead, minimize risk',
    rightDescription: 'You seek the unknown, improvise, embrace risk',
  },
  {
    id: 'social' as DimensionId,
    name: 'Social Orientation',
    leftPole: 'Autonomous',
    rightPole: 'Connecting',
    leftDescription: 'You operate independently, chart your own course',
    rightDescription: 'You seek collaboration, alignment, and connection',
  },
  {
    id: 'response' as DimensionId,
    name: 'Response Pattern',
    leftPole: 'Reflective',
    rightPole: 'Reactive',
    leftDescription: 'You think first, act later, deliberate decisions',
    rightDescription: 'You act quickly, think while doing, spontaneous decisions',
  },
] as const;
