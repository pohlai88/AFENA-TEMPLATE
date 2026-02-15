/**
 * CollisionPolicy — policy-driven outcomes for adapter Analyze stage.
 * Produces decision + reasonCodes instead of raw collision lists.
 */

export type CollisionDecision =
  | 'ALLOW'
  | 'SKIP_DB'
  | 'SKIP_ALL'
  | 'FAIL'
  | 'ADOPT_UI_ONLY';

export type ReasonCode =
  | 'spine_db_tableName'
  | 'spine_db_ui'
  | 'pilot_route_expected'
  | 'net_new_tableName_conflict'
  | 'entityType_exists'
  | 'route_path_exists'
  | 'route_empty_placeholder'
  | 'nav_exists'
  | 'override_collision_expected'
  | 'no_collisions';

export interface CollisionPolicyInput {
  entityType: string;
  collisions: string[];
  lockLevel?: 'db' | 'db+ui';
  routeDetails?: {
    routePathExists: boolean;
    navExists: boolean;
    routeEmptyPlaceholder: boolean;
    routeOwnedByEntityNew?: boolean;
  };
  overrideCollisionExpected?: string[];
}

export interface CollisionPolicyOutput {
  decision: CollisionDecision;
  reasonCodes: ReasonCode[];
  collisionExpected?: string[];
  uiAdoptMode?: 'full' | 'integrate' | 'none';
  outputsAllowed?: { spec: boolean; db: boolean; ui: boolean };
}

/**
 * Apply collision policy rules. Order matters — first match wins.
 */
export function applyCollisionPolicy(input: CollisionPolicyInput): CollisionPolicyOutput {
  const { entityType, collisions, lockLevel, routeDetails, overrideCollisionExpected } = input;

  // db+ui locked → SKIP_ALL
  if (lockLevel === 'db+ui') {
    return {
      decision: 'SKIP_ALL',
      reasonCodes: ['spine_db_ui'],
      outputsAllowed: { spec: false, db: false, ui: false },
    };
  }

  // Override marks collision as expected (e.g. pilot video-settings)
  if (overrideCollisionExpected?.length) {
    const hasRoute = collisions.includes('route') || routeDetails?.routePathExists;
    if (hasRoute && (overrideCollisionExpected.includes('routePathExists') || overrideCollisionExpected.includes('route'))) {
      return {
        decision: 'ALLOW',
        reasonCodes: ['override_collision_expected', 'pilot_route_expected'],
        collisionExpected: overrideCollisionExpected,
        uiAdoptMode: routeDetails?.routeEmptyPlaceholder ? 'full' : 'integrate',
        outputsAllowed: { spec: true, db: true, ui: true },
      };
    }
  }

  // Pilot route: routePathExists but routeEmptyPlaceholder → ALLOW
  if (routeDetails?.routePathExists && routeDetails?.routeEmptyPlaceholder && collisions.includes('route')) {
    return {
      decision: 'ALLOW',
      reasonCodes: ['route_empty_placeholder', 'pilot_route_expected'],
      uiAdoptMode: 'full',
      outputsAllowed: { spec: true, db: true, ui: true },
    };
  }

  // Route exists with implementation → ALLOW but integrate only (form config, no pages)
  if (routeDetails?.routePathExists && !routeDetails?.routeEmptyPlaceholder && collisions.includes('route')) {
    return {
      decision: 'ALLOW',
      reasonCodes: ['route_path_exists', 'pilot_route_expected'],
      uiAdoptMode: 'integrate',
      outputsAllowed: { spec: true, db: true, ui: true },
    };
  }

  // Spine-locked db + tableName collision → SKIP_DB, allow spec for UI mining
  if (lockLevel === 'db' && collisions.some((c) => c.startsWith('spine:') || c === 'tableName')) {
    return {
      decision: 'SKIP_DB',
      reasonCodes: ['spine_db_tableName'],
      outputsAllowed: { spec: true, db: false, ui: true },
    };
  }

  // Net-new entity with tableName collision (not locked) → FAIL
  if (!lockLevel && collisions.includes('tableName')) {
    return {
      decision: 'FAIL',
      reasonCodes: ['net_new_tableName_conflict'],
      outputsAllowed: { spec: false, db: false, ui: false },
    };
  }

  // EntityType collision only (already in ENTITY_TYPES) → FAIL unless override
  if (collisions.includes('entityType') && !overrideCollisionExpected?.includes('entityType')) {
    return {
      decision: 'FAIL',
      reasonCodes: ['entityType_exists'],
      outputsAllowed: { spec: false, db: false, ui: false },
    };
  }

  // No collisions
  if (collisions.length === 0) {
    return {
      decision: 'ALLOW',
      reasonCodes: ['no_collisions'],
      outputsAllowed: { spec: true, db: true, ui: true },
    };
  }

  // Default: ALLOW for minor collisions (e.g. nav only)
  return {
    decision: 'ALLOW',
    reasonCodes: collisions.includes('route') ? ['route_path_exists'] : ['no_collisions'],
    outputsAllowed: { spec: true, db: true, ui: true },
  };
}
