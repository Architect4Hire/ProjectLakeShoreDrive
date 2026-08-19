import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  ButtonComponent,
  FormSectionComponent,
  InputComponent,
  RadioGroupComponent,
  RadioOption,
  SelectComponent,
  SelectOption,
  TextareaComponent,
} from '../../../../design-system/public-api';
import { ApiErrorException } from '../../../core/http/api-error';
import { EngagementApiClient } from '../data/engagement-api.client';
import { ENGAGEMENT_CONFIDENTIALITY_LABELS, ENGAGEMENT_TYPE_LABELS } from '../data/engagement-options';
import { EngagementConfidentiality, EngagementType } from '../data/engagement.models';
import { createEngagementForm, createStakeholderGroup, toCreateRequest } from './engagement-create.form';

// Maps the server's DataAnnotations/EngagementRequestValidator member names (BR-020) onto the
// matching form control. Errors for members without a 1:1 control (e.g. nested
// "Stakeholders[0].Name") fall back to the general error banner instead of being dropped.
const SERVER_FIELD_TO_CONTROL: Readonly<Record<string, string>> = {
  ClientId: 'clientId',
  ClientName: 'clientName',
  Name: 'name',
  Type: 'type',
  BusinessProblem: 'businessProblem',
  Confidentiality: 'confidentiality',
  CurrentStateSummary: 'currentStateSummary',
  TargetStateSummary: 'targetStateSummary',
  TargetEndDate: 'timelineTargetEndDate',
  BusinessObjectives: 'businessObjectivesText',
  KnownTechnologyLandscape: 'knownTechnologyLandscapeText',
  Constraints: 'constraintsText',
  RequestedDeliverables: 'requestedDeliverablesText',
};

@Component({
  selector: 'lsd-engagement-create',
  standalone: true,
  imports: [
    ButtonComponent,
    FormSectionComponent,
    InputComponent,
    ReactiveFormsModule,
    RadioGroupComponent,
    SelectComponent,
    TextareaComponent,
  ],
  templateUrl: './engagement-create.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EngagementCreateComponent {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly api = inject(EngagementApiClient);
  private readonly router = inject(Router);

  protected readonly form = createEngagementForm(this.fb);
  protected readonly submitting = signal(false);
  protected readonly bannerErrors = signal<readonly string[]>([]);

  protected readonly typeOptions: readonly SelectOption<EngagementType>[] = (
    Object.entries(ENGAGEMENT_TYPE_LABELS) as [EngagementType, string][]
  ).map(([value, label]) => ({ value, label }));

  protected readonly confidentialityOptions: readonly RadioOption<EngagementConfidentiality>[] = (
    Object.entries(ENGAGEMENT_CONFIDENTIALITY_LABELS) as [EngagementConfidentiality, string][]
  ).map(([value, label]) => ({ value, label }));

  protected addStakeholder(): void {
    this.form.controls.stakeholders.push(createStakeholderGroup(this.fb));
  }

  protected removeStakeholder(index: number): void {
    this.form.controls.stakeholders.removeAt(index);
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.bannerErrors.set([]);
    this.submitting.set(true);

    this.api.create(toCreateRequest(this.form)).subscribe({
      next: (detail) => {
        this.submitting.set(false);
        void this.router.navigate(['/engagements', detail.id]);
      },
      error: (error: ApiErrorException) => {
        this.submitting.set(false);
        this.applyServerErrors(error);
      },
    });
  }

  private applyServerErrors(error: ApiErrorException): void {
    const fieldErrors = error.fieldErrors;
    if (error.kind !== 'validation' || !fieldErrors) {
      this.bannerErrors.set([error.message]);
      return;
    }

    const unmatched: string[] = [];

    for (const [serverField, messages] of Object.entries<readonly string[]>(fieldErrors)) {
      const controlName = SERVER_FIELD_TO_CONTROL[serverField];
      const control = controlName ? this.form.controls[controlName as keyof typeof this.form.controls] : undefined;

      if (control) {
        control.setErrors({ server: messages.join(' ') });
        control.markAsTouched();
      } else {
        unmatched.push(...messages);
      }
    }

    this.bannerErrors.set(unmatched.length > 0 ? unmatched : [error.message]);
  }
}
