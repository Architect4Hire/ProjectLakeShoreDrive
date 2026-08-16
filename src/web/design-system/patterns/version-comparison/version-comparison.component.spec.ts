import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { DocumentVersionPresentation, VersionComparisonComponent, VersionRegenerationRequest } from './version-comparison.component';

@Component({
  standalone: true,
  imports: [VersionComparisonComponent],
  template: `
    <lsd-version-comparison
      id="section-versions"
      title="Compare architecture summary versions"
      [baseVersion]="baseVersion"
      [comparedVersion]="comparedVersion"
      [regenerateDisabled]="regenerateDisabled"
      [regenerating]="regenerating"
      (regenerationRequested)="request = $event">
      <p lsdVersionComparisonBase>Current approved wording.</p>
      <p lsdVersionComparisonCompared>Generated draft wording.</p>
      <p lsdVersionComparisonChanges>Added retry guidance.</p>
      <p lsdVersionComparisonSources>ADR 0004 and ADR 0007.</p>
      <p lsdVersionComparisonContext>Prompt template architecture-summary@4.</p>
    </lsd-version-comparison>
  `,
})
class VersionComparisonTestHostComponent {
  readonly baseVersion: DocumentVersionPresentation = {
    versionId: 'section-v7', label: 'Current', status: 'approved', authorship: 'human', changedBy: 'Architect', changedAt: '2026-08-15', sourceCount: 2,
  };
  readonly comparedVersion: DocumentVersionPresentation = {
    versionId: 'section-v8-draft', label: 'Draft', status: 'draft', authorship: 'ai', changedBy: 'AI workflow', changedAt: '2026-08-16', promptVersion: 'architecture-summary@4', sourceCount: 2,
  };
  regenerateDisabled = false;
  regenerating = false;
  request: VersionRegenerationRequest | null = null;
}

describe('VersionComparisonComponent', () => {
  let fixture: ComponentFixture<VersionComparisonTestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [VersionComparisonTestHostComponent] }).compileComponents();
    fixture = TestBed.createComponent(VersionComparisonTestHostComponent);
    fixture.detectChanges();
  });

  it('distinguishes current approved and AI draft versions in text and semantic attributes', () => {
    const versions = fixture.debugElement.queryAll(By.css('.lsd-version-comparison__version'));
    expect(versions.map((item) => item.attributes['data-version-status'])).toEqual(['approved', 'draft']);
    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Architect approved');
    expect(text).toContain('AI draft — not approved');
    expect(text).toContain('Contains AI draft — not architect approved');
    expect(text).toContain('Human authored');
    expect(text).toContain('AI generated');
  });

  it('shows stable history metadata and projected comparison context', () => {
    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('section-v7');
    expect(text).toContain('section-v8-draft');
    expect(text).toContain('architecture-summary@4');
    expect(text).toContain('Added retry guidance.');
    expect(text).toContain('ADR 0004 and ADR 0007.');
    expect(text).toContain('Current approved wording.');
    expect(text).toContain('Generated draft wording.');
  });

  it('emits a typed regeneration intent without changing either version', () => {
    const button = fixture.debugElement.query(By.css('.lsd-version-comparison__footer button')).nativeElement as HTMLButtonElement;
    button.click();
    expect(fixture.componentInstance.request).toEqual({ baseVersionId: 'section-v7', comparedVersionId: 'section-v8-draft' });
    expect(fixture.componentInstance.baseVersion.status).toBe('approved');
    expect(fixture.componentInstance.comparedVersion.status).toBe('draft');
  });

  it('supports caller-owned disabled and regenerating states', () => {
    fixture.componentInstance.regenerateDisabled = true;
    fixture.detectChanges();
    let button = fixture.debugElement.query(By.css('.lsd-version-comparison__footer button')).nativeElement as HTMLButtonElement;
    expect(button.disabled).toBeTrue();

    fixture.componentInstance.regenerateDisabled = false;
    fixture.componentInstance.regenerating = true;
    fixture.detectChanges();
    button = fixture.debugElement.query(By.css('.lsd-version-comparison__footer button')).nativeElement as HTMLButtonElement;
    expect(button.disabled).toBeTrue();
    expect(fixture.debugElement.query(By.css('[role="status"]')).nativeElement.textContent).toContain('Regenerating section');
  });

  it('uses named, keyboard-switchable version regions through Split View', () => {
    const regions = fixture.debugElement.queryAll(By.css('.lsd-split-view__pane'));
    expect(regions.map((item) => item.nativeElement.getAttribute('aria-label'))).toEqual(['Current', 'Draft']);
    expect(fixture.debugElement.queryAll(By.css('.lsd-split-view__switcher button'))).toHaveSize(2);
  });
});
