import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import {
  DataTableComponent,
  type DataTableActionEvent,
  type DataTableColumn,
  type DataTableRowAction,
} from '../../components';

export type RaidItemType = 'risk' | 'assumption' | 'issue' | 'dependency';
export type RaidAssessment = 'not-applicable' | 'low' | 'medium' | 'high' | 'critical';

export interface RaidRegisterItem {
  readonly id: string;
  readonly type: RaidItemType;
  readonly description: string;
  readonly owner: string;
  readonly severity: RaidAssessment;
  readonly probability: RaidAssessment;
  readonly impact: RaidAssessment;
  readonly status: string;
}

@Component({
  selector: 'lsd-raid-register',
  standalone: true,
  imports: [DataTableComponent],
  templateUrl: './raid-register.component.html',
  styleUrl: './raid-register.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RaidRegisterComponent<TAction = string> {
  readonly accessibleName = input('RAID register');
  readonly items = input.required<readonly RaidRegisterItem[]>();
  readonly actions = input<readonly DataTableRowAction<RaidRegisterItem, TAction>[]>([]);
  readonly loading = input(false);
  readonly loadingMessage = input('Loading RAID items');
  readonly emptyMessage = input('No RAID items');
  readonly error = input<string | undefined>(undefined);

  readonly itemAction = output<DataTableActionEvent<RaidRegisterItem, TAction>>();

  protected readonly columns: readonly DataTableColumn<RaidRegisterItem>[] = [
    { id: 'id', header: 'ID', value: (item) => item.id },
    { id: 'type', header: 'Type', value: (item) => this.typeLabel(item.type) },
    { id: 'description', header: 'Description', value: (item) => item.description },
    { id: 'owner', header: 'Owner', value: (item) => item.owner },
    { id: 'severity', header: 'Severity', value: (item) => this.assessmentLabel(item.severity) },
    { id: 'probability', header: 'Probability', value: (item) => this.assessmentLabel(item.probability) },
    { id: 'impact', header: 'Impact', value: (item) => this.assessmentLabel(item.impact) },
    { id: 'status', header: 'Status', value: (item) => item.status },
  ];

  protected readonly rowKey = (item: RaidRegisterItem): string => item.id;
  protected readonly rowLabel = (item: RaidRegisterItem): string => `${item.id}: ${item.description}`;

  protected forwardAction(event: DataTableActionEvent<RaidRegisterItem, TAction>): void {
    this.itemAction.emit(event);
  }

  private typeLabel(type: RaidItemType): string {
    return ({ risk: 'Risk', assumption: 'Assumption', issue: 'Issue', dependency: 'Dependency' } as const)[type];
  }

  private assessmentLabel(assessment: RaidAssessment): string {
    return assessment === 'not-applicable' ? 'Not applicable' : `${assessment[0]!.toUpperCase()}${assessment.slice(1)}`;
  }
}
