import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { DrawerCloseReason } from '../../primitives/drawer/drawer.component';
import { SourcePreviewComponent, SourcePreviewMetadata, SourcePreviewState } from './source-preview.component';

@Component({
  standalone: true,
  imports: [SourcePreviewComponent],
  template: `
    <lsd-source-preview
      id="source-preview"
      [source]="source"
      [open]="open"
      [state]="state"
      [openSourceDisabled]="openSourceDisabled"
      (closeRequested)="closeReason = $event"
      (retryRequested)="retried = $event"
      (openSourceRequested)="sourceOpened = $event">
      <p lsdSourcePreviewPassage>Long-running workflows persist durable state.</p>
      <p lsdSourcePreviewContext>Surrounding paragraph selected by the caller.</p>
    </lsd-source-preview>
  `,
})
class SourcePreviewTestHostComponent {
  readonly source: SourcePreviewMetadata = {
    sourceId: 'artifact:adr-0007#decision',
    sourceTitle: 'ADR 0007 — Workflow State',
    sourceSection: 'Decision',
    artifactType: 'ADR',
    version: '3',
    locator: 'paragraph 2',
  };
  open = false;
  state: SourcePreviewState = 'ready';
  openSourceDisabled = false;
  closeReason: DrawerCloseReason | null = null;
  retried: SourcePreviewMetadata | null = null;
  sourceOpened: SourcePreviewMetadata | null = null;
}

describe('SourcePreviewComponent', () => {
  let fixture: ComponentFixture<SourcePreviewTestHostComponent>;
  let dialog: HTMLDialogElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [SourcePreviewTestHostComponent] }).compileComponents();
    fixture = TestBed.createComponent(SourcePreviewTestHostComponent);
    dialog = fixture.debugElement.query(By.css('dialog')).nativeElement as HTMLDialogElement;
    spyOn(dialog, 'showModal').and.callFake(() => dialog.setAttribute('open', ''));
    spyOn(dialog, 'close').and.callFake(() => dialog.removeAttribute('open'));
    fixture.detectChanges();
  });

  it('shows resolvable metadata, selected passage, context, and non-approval disclosure', () => {
    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('artifact:adr-0007#decision');
    expect(text).toContain('ADR 0007 — Workflow State');
    expect(text).toContain('Decision');
    expect(text).toContain('paragraph 2');
    expect(text).toContain('Long-running workflows persist durable state.');
    expect(text).toContain('Evidence only — not architect approval');
    expect(fixture.debugElement.query(By.css('.lsd-source-preview')).attributes['data-source-id']).toBe('artifact:adr-0007#decision');
  });

  it('composes the accessible drawer and reflects caller-owned open state', async () => {
    fixture.componentInstance.open = true;
    fixture.detectChanges();
    await fixture.whenStable();
    expect(dialog.showModal).toHaveBeenCalled();
    expect(dialog.getAttribute('aria-labelledby')).toBe('source-preview-title');
    expect(dialog.getAttribute('aria-describedby')).toBe('source-preview-description');
  });

  it('forwards close intent without changing caller state', () => {
    (fixture.debugElement.query(By.css('.lsd-drawer__close')).nativeElement as HTMLButtonElement).click();
    expect(fixture.componentInstance.closeReason).toBe('close-button');
    expect(fixture.componentInstance.open).toBeFalse();
  });

  it('emits the unchanged source reference instead of navigating itself', () => {
    const openSource = fixture.debugElement.query(By.css('.lsd-drawer__actions button')).nativeElement as HTMLButtonElement;
    openSource.click();
    expect(fixture.componentInstance.sourceOpened).toBe(fixture.componentInstance.source);
  });

  it('presents loading, unavailable, and failed feedback with caller-owned retry intent', () => {
    fixture.componentInstance.state = 'loading';
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('[role="status"]')).nativeElement.textContent).toContain('Loading source preview');
    expect(fixture.nativeElement.textContent).not.toContain('Long-running workflows persist durable state.');

    fixture.componentInstance.state = 'unavailable';
    fixture.detectChanges();
    (fixture.debugElement.query(By.css('.lsd-state-feedback__actions button')).nativeElement as HTMLButtonElement).click();
    expect(fixture.componentInstance.retried).toBe(fixture.componentInstance.source);

    fixture.componentInstance.retried = null;
    fixture.componentInstance.state = 'failed';
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('[role="alert"]'))).not.toBeNull();
    (fixture.debugElement.query(By.css('.lsd-state-feedback__actions button')).nativeElement as HTMLButtonElement).click();
    expect(fixture.componentInstance.retried).toBe(fixture.componentInstance.source);
  });

  it('allows the caller to suppress source navigation independently', () => {
    fixture.componentInstance.openSourceDisabled = true;
    fixture.detectChanges();
    const openSource = fixture.debugElement.query(By.css('.lsd-drawer__actions button')).nativeElement as HTMLButtonElement;
    expect(openSource.disabled).toBeTrue();
  });
});
