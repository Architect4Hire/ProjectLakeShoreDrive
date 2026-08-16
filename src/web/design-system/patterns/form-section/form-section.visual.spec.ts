import { FormSectionDensity } from './form-section.component';

interface FormSectionVisualCase {
  readonly name: string;
  readonly appearance: 'light' | 'dark';
  readonly viewport: 'desktop' | 'mobile';
  readonly density: FormSectionDensity;
  readonly error: boolean;
  readonly disclosureExpanded: boolean;
  readonly disabled?: boolean;
}

export const formSectionVisualCases: readonly FormSectionVisualCase[] = [
  { name: 'default-light-desktop', appearance: 'light', viewport: 'desktop', density: 'default', error: false, disclosureExpanded: false },
  { name: 'compact-dark-desktop', appearance: 'dark', viewport: 'desktop', density: 'compact', error: false, disclosureExpanded: true },
  { name: 'error-light-mobile', appearance: 'light', viewport: 'mobile', density: 'compact', error: true, disclosureExpanded: false },
  { name: 'error-details-dark-mobile', appearance: 'dark', viewport: 'mobile', density: 'default', error: true, disclosureExpanded: true },
  { name: 'disabled-light-desktop', appearance: 'light', viewport: 'desktop', density: 'default', error: false, disclosureExpanded: false, disabled: true },
];

describe('form section visual coverage', () => {
  it('covers density, errors, disclosure, disabled, appearances, and widths', () => {
    expect(new Set(formSectionVisualCases.map((item) => item.density))).toEqual(new Set(['default', 'compact']));
    expect(new Set(formSectionVisualCases.map((item) => item.error))).toEqual(new Set([false, true]));
    expect(new Set(formSectionVisualCases.map((item) => item.disclosureExpanded))).toEqual(new Set([false, true]));
    expect(formSectionVisualCases.some((item) => item.disabled)).toBeTrue();
    expect(new Set(formSectionVisualCases.map((item) => item.appearance))).toEqual(new Set(['light', 'dark']));
    expect(new Set(formSectionVisualCases.map((item) => item.viewport))).toEqual(new Set(['desktop', 'mobile']));
  });
});
