import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { StructuredEditorComponent, StructuredEditorSaveState, StructuredEditorSection } from './structured-editor.component';
import { StructuredEditorSectionActionsDirective, StructuredEditorSectionContentDirective } from './structured-editor-section.directive';

type SectionId = 'summary' | 'scope';
@Component({
  standalone: true,
  imports: [StructuredEditorComponent, StructuredEditorSectionContentDirective, StructuredEditorSectionActionsDirective],
  template: `<lsd-structured-editor id="document" accessibleName="Document editor" [sections]="sections"
    [saveState]="saveState" saveError="Storage unavailable" [splitViewAvailable]="true">
    <button lsdEditorToolbar type="button">Format</button><button lsdEditorActions type="button">Publish</button>
    <ng-template lsdEditorSectionContent="summary" let-id let-index="index">Content {{ id }} {{ index }}</ng-template>
    <ng-template lsdEditorSectionContent="scope">Scope content</ng-template>
    <ng-template lsdEditorSectionActions="summary"><button type="button">Edit</button></ng-template>
    <div lsdEditorContext><h2>Selected context</h2></div>
  </lsd-structured-editor>`,
})
class StructuredEditorTestHostComponent {
  readonly sections: readonly StructuredEditorSection<SectionId>[] = [
    { identity: 'summary', title: 'Summary' }, { identity: 'scope', title: 'Scope' },
  ];
  saveState: StructuredEditorSaveState = 'dirty';
}

describe('StructuredEditorComponent', () => {
  let fixture: ComponentFixture<StructuredEditorTestHostComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [StructuredEditorTestHostComponent] }).compileComponents();
    fixture = TestBed.createComponent(StructuredEditorTestHostComponent); fixture.detectChanges();
  });
  it('renders typed section templates in configured order', () => {
    const sections = fixture.debugElement.queryAll(By.css('article'));
    expect(sections.map((item) => item.query(By.css('h2')).nativeElement.textContent.trim())).toEqual(['Summary', 'Scope']);
    expect(sections[0].nativeElement.textContent).toContain('Content summary 0');
  });
  it('projects toolbar, document actions, and section actions', () => {
    expect(fixture.debugElement.query(By.css('[role="toolbar"]')).nativeElement.textContent).toContain('Format');
    expect(fixture.debugElement.query(By.css('.lsd-structured-editor__document-actions')).nativeElement.textContent).toContain('Publish');
    expect(fixture.debugElement.query(By.css('.lsd-structured-editor__section-actions')).nativeElement.textContent).toContain('Edit');
  });
  it('announces dirty state', () => {
    expect(fixture.debugElement.query(By.css('[role="status"]')).nativeElement.textContent).toContain('Unsaved changes');
  });
  it('announces saving politely and failures assertively', () => {
    const host = fixture.componentInstance;
    host.saveState = 'saving'; fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('[role="status"]')).attributes['aria-live']).toBe('polite');
    host.saveState = 'error'; fixture.detectChanges();
    const alert = fixture.debugElement.query(By.css('[role="alert"]'));
    expect(alert.attributes['aria-live']).toBe('assertive');
    expect(alert.nativeElement.textContent).toContain('Storage unavailable');
  });
  it('opens the context composition pane and moves focus', async () => {
    const toggle = fixture.debugElement.query(By.css('.lsd-structured-editor__context-toggle')).nativeElement as HTMLButtonElement;
    toggle.click(); fixture.detectChanges(); await fixture.whenStable();
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    const context = fixture.debugElement.query(By.css('aside')).nativeElement as HTMLElement;
    expect(context.textContent).toContain('Selected context'); expect(document.activeElement).toBe(context);
  });
});
