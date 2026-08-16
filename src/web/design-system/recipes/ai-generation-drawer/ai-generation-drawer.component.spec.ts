import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AiContentComponent, AiGenerationProgressComponent } from '../../patterns';
import { AiGenerationDrawerComponent, type AiGenerationDrawerViewModel } from './ai-generation-drawer.component';

@Component({ standalone: true, imports: [AiGenerationDrawerComponent], template: `
  <lsd-ai-generation-drawer id="generate" [model]="model" (cancelRequested)="cancelled = true" (accepted)="accepted = true">
    <span lsdAiGenerationSources>Two selected sources</span><p lsdAiGenerationResult>Generated draft</p>
  </lsd-ai-generation-drawer>` })
class Host { model: AiGenerationDrawerViewModel = { operation: 'Regenerate section', target: 'Executive summary', state: 'generating', provenance: 'ai-generated', context: [{ label: 'Requirements', count: 4 }] }; cancelled = false; accepted = false; }

describe('AiGenerationDrawerComponent', () => {
  it('composes context, progress, sources, result, and typed intents', async () => {
    await TestBed.configureTestingModule({ imports: [Host] }).compileComponents();
    const fixture = TestBed.createComponent(Host); fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('AI operation · Not approved');
    expect(fixture.nativeElement.textContent).toContain('Requirements');
    expect(fixture.nativeElement.textContent).toContain('Two selected sources');
    expect(fixture.debugElement.query(By.directive(AiContentComponent)).componentInstance.provenance()).toBe('ai-generated');
    fixture.debugElement.query(By.directive(AiGenerationProgressComponent)).componentInstance.cancelRequested.emit();
    expect(fixture.componentInstance.cancelled).toBeTrue();
  });
});
