import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DocumentSectionEditorComponent, type DocumentSectionEditorViewModel } from './document-section-editor.component';

@Component({ standalone: true, imports: [DocumentSectionEditorComponent], template: `
  <lsd-document-section-editor id="executive" [section]="section" saveState="saving" [contextAvailable]="true" (historyRequested)="history = $event">
    <article lsdDocumentSectionContent>Editable section body</article>
    <span lsdDocumentSectionCitations>Source citations</span>
    <button lsdDocumentSectionActions type="button">Ask AI</button>
    <button lsdDocumentSectionApprovalActions type="button">Approve</button>
    <aside lsdDocumentSectionContext>Selected context</aside>
  </lsd-document-section-editor>` })
class Host { section: DocumentSectionEditorViewModel = { id: 'section-1', title: 'Executive summary', provenance: 'ai-generated', approval: 'draft', versionLabel: 'Version 3' }; history?: string; }

describe('DocumentSectionEditorComponent', () => {
  it('composes section content, actions, citations, provenance, saving, and history intent', async () => {
    await TestBed.configureTestingModule({ imports: [Host] }).compileComponents();
    const fixture = TestBed.createComponent(Host); fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('AI generated · Not approved');
    expect(fixture.nativeElement.textContent).toContain('Draft');
    expect(fixture.nativeElement.textContent).toContain('Saving changes');
    expect(fixture.nativeElement.textContent).toContain('Editable section body');
    expect(fixture.nativeElement.textContent).toContain('Source citations');
    expect(fixture.nativeElement.textContent).toContain('Ask AI');
    expect(fixture.nativeElement.textContent).toContain('Approve');
    const history = fixture.debugElement.queryAll(By.css('lsd-button button')).find(x => x.nativeElement.textContent.includes('Version history'))!;
    history.nativeElement.click(); fixture.detectChanges(); expect(fixture.componentInstance.history).toBe('section-1');
  });
});
