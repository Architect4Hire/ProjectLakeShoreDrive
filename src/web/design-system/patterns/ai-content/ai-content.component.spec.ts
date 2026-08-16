import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { AiContentAction, AiContentComponent, AiContentState, AiSourceCitation } from './ai-content.component';

@Component({
  standalone: true,
  imports: [AiContentComponent],
  template: `
    <lsd-ai-content
      id="generated-summary"
      title="Generated summary"
      provenance="ai-generated"
      [state]="state"
      confidence="low"
      [citations]="citations"
      [selectedCitationId]="selectedCitationId"
      [contextInspectorVisible]="showInspector"
      [processing]="processing"
      (accepted)="accepts++"
      (rejected)="rejects++"
      (regenerateRequested)="regenerations++"
      (citationSelected)="selectedCitationId = $event.id">
      <p>Generated body</p>
      <p lsdAiSourcePreview>Display-safe excerpt</p>
      <pre lsdAiContextInspector>Authorized context</pre>
    </lsd-ai-content>
  `,
})
class AiContentTestHostComponent {
  state: AiContentState = 'suggested';
  processing: AiContentAction | null = null;
  showInspector = false;
  selectedCitationId: string | null = null;
  accepts = 0;
  rejects = 0;
  regenerations = 0;
  readonly citations: readonly AiSourceCitation[] = [
    { id: 'adr-4', label: 'ADR 0004', locator: '§ Decision', description: 'Governed source summary' },
  ];
}

describe('AiContentComponent', () => {
  let fixture: ComponentFixture<AiContentTestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [AiContentTestHostComponent] }).compileComponents();
    fixture = TestBed.createComponent(AiContentTestHostComponent);
    fixture.detectChanges();
  });

  it('uses persistent text and semantic attributes to distinguish unapproved AI content', () => {
    const article = fixture.debugElement.query(By.css('article')).nativeElement as HTMLElement;
    expect(article.dataset['provenance']).toBe('ai-generated');
    expect(article.classList).toContain('lsd-ai-content--attributed');
    expect(article.textContent).toContain('AI generated');
    expect(article.textContent).toContain('Suggested change');
    expect(article.textContent).toContain('Not architect approved');
    expect(article.textContent).toContain('low confidence');
  });

  it('emits presentation intents without changing provenance or state', () => {
    const buttons = fixture.debugElement.queryAll(By.css('.lsd-ai-content__actions button'));
    buttons.forEach((button) => (button.nativeElement as HTMLButtonElement).click());
    expect(fixture.componentInstance.regenerations).toBe(1);
    expect(fixture.componentInstance.rejects).toBe(1);
    expect(fixture.componentInstance.accepts).toBe(1);
    expect(fixture.componentInstance.state).toBe('suggested');
  });

  it('exposes citation selection and a named source preview', () => {
    (fixture.debugElement.query(By.css('.lsd-ai-content__citation')).nativeElement as HTMLButtonElement).click();
    fixture.detectChanges();
    const preview = fixture.debugElement.query(By.css('.lsd-ai-content__source-preview'));
    expect(fixture.componentInstance.selectedCitationId).toBe('adr-4');
    expect(preview.nativeElement.textContent).toContain('Display-safe excerpt');
    expect(fixture.nativeElement.textContent).toContain('Governed source summary');
  });

  it('does not render the context inspector until the caller allows it', () => {
    expect(fixture.debugElement.query(By.css('.lsd-ai-content__inspector'))).toBeNull();
    fixture.componentInstance.showInspector = true;
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Authorized context');
  });

  it('announces generating and failure states and locks concurrent actions', () => {
    fixture.componentInstance.state = 'generating';
    fixture.detectChanges();
    const article = fixture.debugElement.query(By.css('article')).nativeElement as HTMLElement;
    expect(article.getAttribute('aria-busy')).toBe('true');
    expect(fixture.debugElement.query(By.css('[role="status"]')).nativeElement.textContent).toContain('Existing approved content is unchanged');

    fixture.componentInstance.state = 'failed';
    fixture.componentInstance.processing = 'regenerate';
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('[role="alert"]'))).not.toBeNull();
    const actions = fixture.debugElement.queryAll(By.css('.lsd-ai-content__actions button'));
    expect(actions.every((item) => (item.nativeElement as HTMLButtonElement).disabled)).toBeTrue();
  });
});
