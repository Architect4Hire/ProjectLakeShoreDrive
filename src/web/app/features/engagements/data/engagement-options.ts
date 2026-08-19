import { EngagementConfidentiality, EngagementType } from './engagement.models';

export const ENGAGEMENT_TYPE_LABELS: Readonly<Record<EngagementType, string>> = {
  ArchitectureAssessment: 'Architecture Assessment',
  ApplicationModernization: 'Application Modernization',
  CloudMigration: 'Cloud Migration',
  NewApplicationArchitecture: 'New Application Architecture',
  MicroservicesAssessment: 'Microservices Assessment',
  AzureArchitectureReview: 'Azure Architecture Review',
  AiRagAssessment: 'AI / RAG Assessment',
  ProofOfConcept: 'Proof of Concept',
  ArchitectureAdvisory: 'Architecture Advisory',
  TechnicalDueDiligence: 'Technical Due Diligence',
  DevelopmentAccelerator: 'Development Accelerator',
  ImplementationEngagement: 'Implementation Engagement',
};

export const ENGAGEMENT_CONFIDENTIALITY_LABELS: Readonly<Record<EngagementConfidentiality, string>> = {
  InternalReusable: 'Internal / Reusable',
  ClientConfidential: 'Client Confidential',
  EngagementRestricted: 'Engagement Restricted',
  ApprovedReusableKnowledge: 'Approved Reusable Knowledge',
};
