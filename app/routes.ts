import { type RouteConfig, index, route, layout } from '@react-router/dev/routes';

export default [
  index('routes/_index.tsx'),
  layout('routes/session.tsx', [
    route('session/warmup', 'routes/session.warmup.tsx'),
    route('session/scenarios', 'routes/session.scenarios.tsx'),
    route('session/ranking', 'routes/session.ranking.tsx'),
    route('session/writing', 'routes/session.writing.tsx'),
    route('session/processing', 'routes/session.processing.tsx'),
  ]),
  route('profile/:token', 'routes/profile.$token.tsx'),
  route('about', 'routes/about.tsx'),
  route('privacy', 'routes/privacy.tsx'),

  // Phase 2: Session persistence + profile
  route('s/:token', 'routes/s.$token.tsx'),
  route('s/:token/deep-dive', 'routes/s.$token.deep-dive.tsx'),
  route('s/:token/reconciliation', 'routes/s.$token.reconciliation.tsx'),
  route('p/:token', 'routes/p.$token.tsx'),
  route('f/:token', 'routes/f.$token.tsx'),
  route('admin', 'routes/admin.tsx'),

  // Phase 2: API routes
  route('api/session', 'routes/api.session.ts'),
  route('api/session/:id/step', 'routes/api.session.$id.step.ts'),
  route('api/session/:id/profile', 'routes/api.session.$id.profile.ts'),
  route('api/session/:id/followup', 'routes/api.session.$id.followup.ts'),
  route('api/session/:id/feedback', 'routes/api.session.$id.feedback.ts'),
  route('api/session/:id/deep-dive', 'routes/api.session.$id.deep-dive.ts'),
  route('api/session/:id/reconciliation', 'routes/api.session.$id.reconciliation.ts'),
  route('api/session/:id/finalize', 'routes/api.session.$id.finalize.ts'),
  route('api/session/:id/delete', 'routes/api.session.$id.delete.ts'),
  route('api/session/:id/share', 'routes/api.session.$id.share.ts'),
  route('api/share/:token', 'routes/api.share.$token.ts'),
  route('api/feedback/:token', 'routes/api.feedback.$token.ts'),
  route('api/analytics', 'routes/api.analytics.ts'),
  route('api/admin', 'routes/api.admin.ts'),
] satisfies RouteConfig;
