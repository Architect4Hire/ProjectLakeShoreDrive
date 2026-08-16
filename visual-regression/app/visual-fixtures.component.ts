import { Component, inject } from '@angular/core';
import {
  AlertBannerComponent, ApprovalActionsComponent, CitationChipComponent, DataTableColumn, DialogComponent, DrawerComponent,
  DataTableComponent, EngagementHeaderComponent, FilePickerComponent, IconComponent, KnowledgeResultComponent,
  InputComponent, NotificationService, NotificationViewportComponent, PhaseNavigationComponent, RaidRegisterComponent,
  RaidRegisterItem, RequirementRowComponent, SplitViewComponent, StepperComponent, StepperStep, WorkbenchShellRecipeComponent,
} from '../../src/web/design-system/public-api';

interface Person { readonly id: number; readonly name: string; readonly role: string; }

@Component({
  selector: 'lsd-visual-fixtures',
  standalone: true,
  imports: [AlertBannerComponent, ApprovalActionsComponent, CitationChipComponent, DataTableComponent, DialogComponent,
    DrawerComponent, EngagementHeaderComponent, FilePickerComponent, IconComponent, InputComponent, KnowledgeResultComponent,
    NotificationViewportComponent, PhaseNavigationComponent, RaidRegisterComponent, RequirementRowComponent,
    SplitViewComponent, StepperComponent, WorkbenchShellRecipeComponent],
  templateUrl: './visual-fixtures.component.html',
})
export class VisualFixturesComponent {
  private readonly notifications = inject(NotificationService);
  protected readonly suite = new URLSearchParams(location.search).get('suite') ?? 'components';
  protected readonly people: readonly Person[] = [{ id: 1, name: 'Avery Morgan', role: 'Architect' }, { id: 2, name: 'Jordan Lee', role: 'Reviewer' }];
  protected readonly columns: readonly DataTableColumn<Person>[] = [{ id: 'name', header: 'Name', value: (row) => row.name }, { id: 'role', header: 'Role', value: (row) => row.role }];
  protected readonly rowKey = (row: Person) => row.id;
  protected readonly rowLabel = (row: Person) => row.name;
  protected readonly steps: readonly StepperStep<string>[] = [{ identity: 'discover', label: 'Discovery', state: 'complete' }, { identity: 'decide', label: 'Decision' }, { identity: 'approve', label: 'Approval', state: 'incomplete' }];
  protected readonly engagement = { id: 'ENG-042', name: 'Northwind modernization', clientName: 'Northwind', engagementType: 'Architecture', status: 'review' as const, clientMetadata: [{ label: 'Region', value: 'Central' }] };
  protected readonly requirement = { id: 'REQ-014', title: 'All decisions retain resolvable evidence', status: { label: 'AI draft', variant: 'ai-draft' as const }, priority: 'high' as const, traceability: [{ id: 'DS-013', label: 'AI interaction patterns' }] };
  protected readonly knowledge = { sourceId: 'SRC-2026-0042', title: 'Architecture decision record', section: 'Decision', artifactType: 'ADR', scope: { engagementLabel: 'Northwind' }, excerpt: 'Use event-driven integration for asynchronous domain changes.', tags: ['integration', 'approved-pattern'], approval: 'approved' as const, confidentiality: 'internal' as const };
  protected readonly raidItems: readonly RaidRegisterItem[] = [{ id: 'R-014', type: 'risk', description: 'Legacy interface capacity may constrain migration.', owner: 'A. Morgan', severity: 'high', probability: 'medium', impact: 'high', status: 'Open' }];

  constructor() {
    this.notifications.notify({ title: 'Draft ready', message: 'The generated draft is ready for review.', severity: 'success' });
  }
}
