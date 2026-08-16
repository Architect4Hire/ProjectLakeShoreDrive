import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { TooltipComponent } from './tooltip.component';
import { TooltipTriggerDirective } from './tooltip-trigger.directive';

@Component({
  standalone: true,
  imports: [TooltipComponent, TooltipTriggerDirective],
  template: `
    <lsd-tooltip id="citation-help" text="Citations link claims to source evidence.">
      <button lsdTooltipTrigger type="button">Citation help</button>
    </lsd-tooltip>
  `,
})
class TooltipTestHostComponent {}

describe('TooltipComponent', () => {
  let fixture: ComponentFixture<TooltipTestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TooltipTestHostComponent] }).compileComponents();
    fixture = TestBed.createComponent(TooltipTestHostComponent);
    fixture.detectChanges();
  });

  const trigger = (): HTMLButtonElement =>
    fixture.debugElement.query(By.css('button')).nativeElement as HTMLButtonElement;
  const tooltip = (): HTMLElement =>
    fixture.debugElement.query(By.css('[role="tooltip"]')).nativeElement as HTMLElement;

  it('associates the focusable trigger with supplemental text', () => {
    expect(trigger().getAttribute('aria-describedby')).toBe('citation-help-tooltip');
    expect(tooltip().textContent).toContain('Citations link claims to source evidence.');
    expect(tooltip().hidden).toBeTrue();
  });

  it('opens on keyboard focus and closes on focus departure', () => {
    trigger().dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    fixture.detectChanges();
    expect(tooltip().hidden).toBeFalse();
    trigger().dispatchEvent(new FocusEvent('focusout', { bubbles: true, relatedTarget: document.body }));
    fixture.detectChanges();
    expect(tooltip().hidden).toBeTrue();
  });

  it('opens on hover and closes on pointer departure', () => {
    const wrapper = fixture.debugElement.query(By.css('lsd-tooltip > span')).nativeElement as HTMLElement;
    wrapper.dispatchEvent(new MouseEvent('mouseenter'));
    fixture.detectChanges();
    expect(tooltip().hidden).toBeFalse();
    wrapper.dispatchEvent(new MouseEvent('mouseleave'));
    fixture.detectChanges();
    expect(tooltip().hidden).toBeTrue();
  });

  it('dismisses an open tooltip with Escape and does not steal focus', () => {
    trigger().focus();
    trigger().dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    fixture.detectChanges();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();
    expect(tooltip().hidden).toBeTrue();
    expect(document.activeElement).toBe(trigger());
  });
});
