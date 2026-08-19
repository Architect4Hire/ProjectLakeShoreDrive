import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { CreateEngagementRequest, EngagementConfidentiality, EngagementType } from '../data/engagement.models';

const GUID_PATTERN = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export type StakeholderFormGroup = FormGroup<{
  name: FormControl<string>;
  role: FormControl<string>;
  email: FormControl<string>;
}>;

export type EngagementCreateForm = FormGroup<{
  clientId: FormControl<string>;
  clientName: FormControl<string>;
  name: FormControl<string>;
  type: FormControl<EngagementType>;
  confidentiality: FormControl<EngagementConfidentiality>;
  businessProblem: FormControl<string>;
  currentStateSummary: FormControl<string>;
  targetStateSummary: FormControl<string>;
  timelineStartDate: FormControl<string>;
  timelineTargetEndDate: FormControl<string>;
  businessObjectivesText: FormControl<string>;
  knownTechnologyLandscapeText: FormControl<string>;
  constraintsText: FormControl<string>;
  requestedDeliverablesText: FormControl<string>;
  stakeholders: FormArray<StakeholderFormGroup>;
}>;

export function timelineOrderValidator(control: AbstractControl): ValidationErrors | null {
  const start = control.get('timelineStartDate')?.value as string | undefined;
  const end = control.get('timelineTargetEndDate')?.value as string | undefined;

  if (!start || !end) {
    return null;
  }

  return end < start ? { timelineOrder: true } : null;
}

export function createStakeholderGroup(fb: NonNullableFormBuilder): StakeholderFormGroup {
  return fb.group({
    name: fb.control('', Validators.required),
    role: fb.control('', Validators.required),
    email: fb.control('', Validators.email),
  });
}

export function createEngagementForm(fb: NonNullableFormBuilder): EngagementCreateForm {
  return fb.group(
    {
      clientId: fb.control('', [Validators.required, Validators.pattern(GUID_PATTERN)]),
      clientName: fb.control('', Validators.required),
      name: fb.control('', Validators.required),
      type: fb.control<EngagementType>('CloudMigration', Validators.required),
      confidentiality: fb.control<EngagementConfidentiality>('ClientConfidential', Validators.required),
      businessProblem: fb.control('', Validators.required),
      currentStateSummary: fb.control(''),
      targetStateSummary: fb.control(''),
      timelineStartDate: fb.control('', Validators.pattern(ISO_DATE_PATTERN)),
      timelineTargetEndDate: fb.control('', Validators.pattern(ISO_DATE_PATTERN)),
      businessObjectivesText: fb.control(''),
      knownTechnologyLandscapeText: fb.control(''),
      constraintsText: fb.control(''),
      requestedDeliverablesText: fb.control(''),
      stakeholders: fb.array<StakeholderFormGroup>([]),
    },
    { validators: timelineOrderValidator },
  );
}

function parseLines(text: string): readonly string[] {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

export function toCreateRequest(form: EngagementCreateForm): CreateEngagementRequest {
  const value = form.getRawValue();
  const hasTimeline = value.timelineStartDate.length > 0;

  return {
    clientId: value.clientId.trim(),
    clientName: value.clientName.trim(),
    name: value.name.trim(),
    type: value.type,
    businessProblem: value.businessProblem.trim(),
    confidentiality: value.confidentiality,
    currentStateSummary: value.currentStateSummary.trim() || undefined,
    targetStateSummary: value.targetStateSummary.trim() || undefined,
    timeline: hasTimeline
      ? { startDate: value.timelineStartDate, targetEndDate: value.timelineTargetEndDate || undefined }
      : undefined,
    businessObjectives: parseLines(value.businessObjectivesText),
    knownTechnologyLandscape: parseLines(value.knownTechnologyLandscapeText),
    constraints: parseLines(value.constraintsText),
    requestedDeliverables: parseLines(value.requestedDeliverablesText),
    stakeholders: value.stakeholders
      .filter((s) => s.name.trim().length > 0 && s.role.trim().length > 0)
      .map((s) => ({ name: s.name.trim(), role: s.role.trim(), email: s.email.trim() || undefined })),
  };
}
