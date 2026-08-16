import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { DialogComponent, DialogCloseReason } from './dialog.component';
import { DialogInitialFocusDirective } from './dialog-initial-focus.directive';

@Component({
  standalone: true,
  imports: [DialogComponent, DialogInitialFocusDirective],
  template: `
    <button id="opener" type="button">Open</button>
    <lsd-dialog
      id="review-dialog"
      title="Review changes"
      description="Confirm the proposed changes."
      size="large"
      [open]="open()"
      (closeRequested)="closed($event)">
      <button lsdDialogInitialFocus type="button">Review details</button>
      <div lsdDialogActions><button type="button">Approve</button></div>
    </lsd-dialog>
  `,
})
class DialogTestHostComponent {
  readonly open = signal(false);
  reason: DialogCloseReason | undefined;
  closed(reason: DialogCloseReason): void { this.reason = reason; this.open.set(false); }
}

describe('DialogComponent', () => {
  let fixture: ComponentFixture<DialogTestHostComponent>;
  let host: DialogTestHostComponent;
  let nativeDialog: HTMLDialogElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [DialogTestHostComponent] }).compileComponents();
    fixture = TestBed.createComponent(DialogTestHostComponent);
    host = fixture.componentInstance;
    nativeDialog = fixture.debugElement.query(By.css('dialog')).nativeElement;
    spyOn(nativeDialog, 'showModal').and.callFake(() => nativeDialog.setAttribute('open', ''));
    spyOn(nativeDialog, 'close').and.callFake(() => nativeDialog.removeAttribute('open'));
    fixture.detectChanges();
  });

  it('provides native modal labeling and composed actions', () => {
    expect(nativeDialog.getAttribute('aria-labelledby')).toBe('review-dialog-title');
    expect(nativeDialog.getAttribute('aria-describedby')).toBe('review-dialog-description');
    expect(fixture.debugElement.query(By.css('.lsd-dialog__actions button')).nativeElement.textContent).toContain('Approve');
  });

  it('opens modally and moves focus to the marked control', async () => {
    host.open.set(true); fixture.detectChanges(); await fixture.whenStable();
    expect(nativeDialog.showModal).toHaveBeenCalled();
    expect(document.activeElement?.textContent).toContain('Review details');
  });

  it('requests close on Escape and restores trigger focus', () => {
    const opener = fixture.debugElement.query(By.css('#opener')).nativeElement as HTMLButtonElement;
    opener.focus(); host.open.set(true); fixture.detectChanges();
    nativeDialog.dispatchEvent(new Event('cancel', { cancelable: true })); fixture.detectChanges();
    expect(host.reason).toBe('escape');
    expect(document.activeElement).toBe(opener);
  });

  it('exposes responsive sizing and semantic appearance classes', () => {
    expect(nativeDialog.style.maxInlineSize).toBe('48rem');
    expect(nativeDialog.className).toContain('bg-surface-raised');
    expect(nativeDialog.className).toContain('border-border-default');
    expect(nativeDialog.className).not.toMatch(/(?:slate|gray|white|black)-/);
  });
});
