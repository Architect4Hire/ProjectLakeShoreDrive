import { Component } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { SplitViewComponent } from './split-view.component';

@Component({
  standalone: true,
  imports: [SplitViewComponent],
  template: `
    <lsd-split-view
      id="comparison"
      accessibleName="Source and editable output"
      contextLabel="Source"
      outputLabel="Draft"
      ratio="context-wide"
      [(compactPane)]="pane">
      <article lsdSplitViewContext>Source material</article>
      <form lsdSplitViewOutput><label>Draft <textarea></textarea></label></form>
    </lsd-split-view>
  `,
})
class SplitViewTestHostComponent {
  pane: 'context' | 'output' = 'output';
}

describe('SplitViewComponent', () => {
  let fixture: ComponentFixture<SplitViewTestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [SplitViewTestHostComponent] }).compileComponents();
    fixture = TestBed.createComponent(SplitViewTestHostComponent);
    fixture.detectChanges();
  });

  it('projects two labeled regions in context then output order', () => {
    const regions = fixture.debugElement.queryAll(By.css('[role="region"]'));
    expect(regions.map((item) => item.nativeElement.getAttribute('aria-label'))).toEqual(['Source', 'Draft']);
    expect(regions[0].nativeElement.textContent).toContain('Source material');
    expect(regions[1].nativeElement.querySelector('textarea')).not.toBeNull();
  });

  it('exposes the typed ratio and initial compact pane', () => {
    const shell = fixture.debugElement.query(By.css('.lsd-split-view')).nativeElement as HTMLElement;
    expect(shell.dataset['ratio']).toBe('context-wide');
    expect(shell.dataset['compactPane']).toBe('output');
  });

  it('switches to context, updates pressed state, and focuses its region', fakeAsync(() => {
    const buttons = fixture.debugElement.queryAll(By.css('.lsd-split-view__switcher button'));
    (buttons[0].nativeElement as HTMLButtonElement).click();
    fixture.detectChanges();
    tick();
    const context = fixture.debugElement.query(By.css('.lsd-split-view__pane--context')).nativeElement as HTMLElement;
    expect(fixture.componentInstance.pane).toBe('context');
    expect(buttons[0].nativeElement.getAttribute('aria-pressed')).toBe('true');
    expect(document.activeElement).toBe(context);
  }));

  it('switches back to editable output and focuses it', fakeAsync(() => {
    const buttons = fixture.debugElement.queryAll(By.css('.lsd-split-view__switcher button'));
    (buttons[0].nativeElement as HTMLButtonElement).click(); fixture.detectChanges(); tick();
    (buttons[1].nativeElement as HTMLButtonElement).click(); fixture.detectChanges(); tick();
    const output = fixture.debugElement.query(By.css('.lsd-split-view__pane--output')).nativeElement as HTMLElement;
    expect(fixture.componentInstance.pane).toBe('output');
    expect(document.activeElement).toBe(output);
  }));
});
