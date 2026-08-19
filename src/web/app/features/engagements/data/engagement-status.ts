import { BadgeVariant, EngagementLifecycleStatus } from '../../../../design-system/public-api';
import { EngagementStatus } from './engagement.models';

// Mirrors the backend's Domain/EngagementLifecycle.cs sequence (BR-022). The server (via
// EngagementLifecyclePolicy) remains authoritative on every actual transition; this is a
// client-side re-derivation for instant UI feedback, re-synced from the server's response
// whenever it disagrees (a 422's fromStatus/toStatus/allowedTransitions extensions).
export const LIFECYCLE_SEQUENCE: readonly EngagementStatus[] = [
  'Draft',
  'Discovery',
  'Analysis',
  'Architecture',
  'Estimation',
  'PackageGeneration',
  'Review',
  'Approved',
  'Delivery',
  'Closed',
  'Archived',
];

export const ENGAGEMENT_STATUS_LABELS: Readonly<Record<EngagementStatus, string>> = {
  Draft: 'Draft',
  Discovery: 'Discovery',
  Analysis: 'Analysis',
  Architecture: 'Architecture',
  Estimation: 'Estimation',
  PackageGeneration: 'Package Generation',
  Review: 'Review',
  Approved: 'Approved',
  Delivery: 'Delivery',
  Closed: 'Closed',
  Archived: 'Archived',
};

export const ENGAGEMENT_STATUS_BADGE_VARIANT: Readonly<Record<EngagementStatus, BadgeVariant>> = {
  Draft: 'neutral',
  Discovery: 'info',
  Analysis: 'info',
  Architecture: 'info',
  Estimation: 'info',
  PackageGeneration: 'info',
  Review: 'warning',
  Approved: 'success',
  Delivery: 'success',
  Closed: 'success',
  Archived: 'archived',
};

// Adapts the wire enum to lsd-engagement-header's kebab-case EngagementLifecycleStatus.
export const ENGAGEMENT_STATUS_TO_LIFECYCLE_STATUS: Readonly<Record<EngagementStatus, EngagementLifecycleStatus>> = {
  Draft: 'draft',
  Discovery: 'discovery',
  Analysis: 'analysis',
  Architecture: 'architecture',
  Estimation: 'estimation',
  PackageGeneration: 'package-generation',
  Review: 'review',
  Approved: 'approved',
  Delivery: 'delivery',
  Closed: 'closed',
  Archived: 'archived',
};

export function isValidTransition(from: EngagementStatus, to: EngagementStatus): boolean {
  if (from === 'Archived') {
    return false;
  }

  if (to === 'Archived') {
    return true;
  }

  const fromIndex = LIFECYCLE_SEQUENCE.indexOf(from);
  const toIndex = LIFECYCLE_SEQUENCE.indexOf(to);

  return toIndex === fromIndex + 1;
}

export function allowedTransitionsFrom(current: EngagementStatus): readonly EngagementStatus[] {
  return LIFECYCLE_SEQUENCE.filter((target) => isValidTransition(current, target));
}

export function blockedTransitionReason(current: EngagementStatus, target: EngagementStatus): string {
  if (current === 'Archived') {
    return 'An archived engagement cannot change phase.';
  }

  const allowed = allowedTransitionsFrom(current);
  return `Cannot move from '${current}' to '${target}'. Allowed next phases: ${allowed.join(', ')}.`;
}
