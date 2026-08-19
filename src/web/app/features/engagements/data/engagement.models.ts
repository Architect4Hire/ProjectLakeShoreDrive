// Mirrors ProjectLakeShoreDrive.Engagement.Core.Contracts (BR-020..023). Field names/casing
// match the JSON the API actually sends (camelCase; enums as strings via the host's
// JsonStringEnumConverter) rather than being copy-pasted from the C# PascalCase source.

export type EngagementStatus =
  | 'Draft'
  | 'Discovery'
  | 'Analysis'
  | 'Architecture'
  | 'Estimation'
  | 'PackageGeneration'
  | 'Review'
  | 'Approved'
  | 'Delivery'
  | 'Closed'
  | 'Archived';

export type EngagementType =
  | 'ArchitectureAssessment'
  | 'ApplicationModernization'
  | 'CloudMigration'
  | 'NewApplicationArchitecture'
  | 'MicroservicesAssessment'
  | 'AzureArchitectureReview'
  | 'AiRagAssessment'
  | 'ProofOfConcept'
  | 'ArchitectureAdvisory'
  | 'TechnicalDueDiligence'
  | 'DevelopmentAccelerator'
  | 'ImplementationEngagement';

export type EngagementConfidentiality =
  | 'InternalReusable'
  | 'ClientConfidential'
  | 'EngagementRestricted'
  | 'ApprovedReusableKnowledge';

export interface EngagementTimeline {
  readonly startDate: string;
  readonly targetEndDate?: string | undefined;
}

export interface EngagementStakeholder {
  readonly name: string;
  readonly role: string;
  readonly email?: string | undefined;
}

export interface EngagementLifecycleTransition {
  readonly fromStatus: EngagementStatus;
  readonly toStatus: EngagementStatus;
  readonly performedBy: string;
  readonly reason?: string | undefined;
  readonly occurredAtUtc: string;
}

export interface EngagementListItem {
  readonly id: string;
  readonly clientId: string;
  readonly clientName: string;
  readonly name: string;
  readonly type: EngagementType;
  readonly confidentiality: EngagementConfidentiality;
  readonly status: EngagementStatus;
  readonly createdAtUtc: string;
}

export interface EngagementListResult {
  readonly items: readonly EngagementListItem[];
  readonly totalCount: number;
  readonly page: number;
  readonly pageSize: number;
}

export interface EngagementDetail {
  readonly id: string;
  readonly clientId: string;
  readonly clientName: string;
  readonly name: string;
  readonly type: EngagementType;
  readonly businessProblem: string;
  readonly currentStateSummary?: string | undefined;
  readonly targetStateSummary?: string | undefined;
  readonly timeline?: EngagementTimeline | undefined;
  readonly businessObjectives: readonly string[];
  readonly knownTechnologyLandscape: readonly string[];
  readonly stakeholders: readonly EngagementStakeholder[];
  readonly constraints: readonly string[];
  readonly requestedDeliverables: readonly string[];
  readonly confidentiality: EngagementConfidentiality;
  readonly status: EngagementStatus;
  readonly createdAtUtc: string;
  readonly archivedAtUtc?: string | undefined;
  readonly lifecycleHistory: readonly EngagementLifecycleTransition[];
}

export interface CreateEngagementRequest {
  readonly clientId: string;
  readonly clientName: string;
  readonly name: string;
  readonly type: EngagementType;
  readonly businessProblem: string;
  readonly confidentiality: EngagementConfidentiality;
  readonly currentStateSummary?: string | undefined;
  readonly targetStateSummary?: string | undefined;
  readonly timeline?: EngagementTimeline | undefined;
  readonly businessObjectives?: readonly string[] | undefined;
  readonly knownTechnologyLandscape?: readonly string[] | undefined;
  readonly stakeholders?: readonly EngagementStakeholder[] | undefined;
  readonly constraints?: readonly string[] | undefined;
  readonly requestedDeliverables?: readonly string[] | undefined;
}

export interface UpdateEngagementRequest {
  readonly engagementId: string;
  readonly name: string;
  readonly type: EngagementType;
  readonly businessProblem: string;
  readonly confidentiality: EngagementConfidentiality;
  readonly currentStateSummary?: string | undefined;
  readonly targetStateSummary?: string | undefined;
  readonly timeline?: EngagementTimeline | undefined;
  readonly businessObjectives?: readonly string[] | undefined;
  readonly knownTechnologyLandscape?: readonly string[] | undefined;
  readonly stakeholders?: readonly EngagementStakeholder[] | undefined;
  readonly constraints?: readonly string[] | undefined;
  readonly requestedDeliverables?: readonly string[] | undefined;
}

export interface TransitionEngagementPhaseRequest {
  readonly engagementId: string;
  readonly targetStatus: EngagementStatus;
  // The server derives the authoritative actor (SEC-002); this is advisory only.
  readonly performedBy: string;
  readonly reason?: string | undefined;
}

export interface ArchiveEngagementRequest {
  readonly engagementId: string;
  readonly performedBy: string;
  readonly reason?: string | undefined;
}

export interface EngagementListQuery {
  readonly status?: EngagementStatus | undefined;
  readonly clientId?: string | undefined;
  readonly includeArchived?: boolean | undefined;
  readonly page?: number | undefined;
  readonly pageSize?: number | undefined;
}

export interface SearchEngagementsQuery {
  readonly searchText: string;
  readonly status?: EngagementStatus | undefined;
  readonly clientId?: string | undefined;
  readonly includeArchived?: boolean | undefined;
  readonly page?: number | undefined;
  readonly pageSize?: number | undefined;
}
