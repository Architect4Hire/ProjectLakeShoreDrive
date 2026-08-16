import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { CitationChipComponent, CitationReference } from './citation-chip.component';

@Component({
  standalone: true,
  imports: [CitationChipComponent],
  template: `
    <lsd-citation-chip
      [citation]="citation"
      previewId="source-preview-adr-4"
      [previewOpen]="previewOpen"
      [disabled]="disabled"
      (previewRequested)="requested = $event" />
    <section id="source-preview-adr-4" aria-label="Source preview"></section>
  `,
})
class CitationChipTestHostComponent {
  readonly citation: CitationReference = {
    sourceId: 'artifact:adr-0004#decision',
    sourceTitle: 'ADR 0004 — Governed RAG',
    sourceSection: 'Decision',
  };
  previewOpen = false;
  disabled = false;
  requested: CitationReference | null = null;
}

describe('CitationChipComponent', () => {
  let fixture: ComponentFixture<CitationChipTestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [CitationChipTestHostComponent] }).compileComponents();
    fixture = TestBed.createComponent(CitationChipTestHostComponent);
    fixture.detectChanges();
  });

  const button = (): HTMLButtonElement =>
    fixture.debugElement.query(By.css('button')).nativeElement as HTMLButtonElement;

  it('visibly presents the stable identifier, source title, section, and AI-source attribution', () => {
    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('AI source');
    expect(text).toContain('ADR 0004 — Governed RAG');
    expect(text).toContain('Decision');
    expect(text).toContain('artifact:adr-0004#decision');
    expect(fixture.debugElement.query(By.css('.lsd-citation-chip')).attributes['data-source-id']).toBe('artifact:adr-0004#decision');
  });

  it('uses a keyboard-native button with an explicit preview relationship', () => {
    expect(button().tagName).toBe('BUTTON');
    expect(button().type).toBe('button');
    expect(button().getAttribute('aria-controls')).toBe('source-preview-adr-4');
    expect(button().getAttribute('aria-expanded')).toBe('false');
    expect(button().getAttribute('aria-label')).toContain('source identifier artifact:adr-0004#decision');
  });

  it('emits the complete stable reference without resolving or mutating it', () => {
    button().click();
    expect(fixture.componentInstance.requested).toBe(fixture.componentInstance.citation);
    expect(fixture.componentInstance.previewOpen).toBeFalse();
  });

  it('reflects caller-owned preview and disabled states', () => {
    fixture.componentInstance.previewOpen = true;
    fixture.componentInstance.disabled = true;
    fixture.detectChanges();
    expect(button().getAttribute('aria-expanded')).toBe('true');
    expect(button().disabled).toBeTrue();
    button().click();
    expect(fixture.componentInstance.requested).toBeNull();
  });
});
