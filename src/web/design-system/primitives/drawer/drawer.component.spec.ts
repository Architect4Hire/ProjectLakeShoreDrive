import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { DrawerComponent, DrawerCloseReason } from './drawer.component';
import { DrawerInitialFocusDirective } from './drawer-initial-focus.directive';

@Component({
  standalone: true,
  imports: [DrawerComponent, DrawerInitialFocusDirective],
  template: `
    <button id="opener" type="button">Preview source</button>
    <lsd-drawer id="source-preview" title="Source preview" description="Inspect supporting evidence."
      placement="start" size="wide" [open]="open()" (closeRequested)="closed($event)">
      <button lsdDrawerInitialFocus type="button">Open source</button>
      <div lsdDrawerActions><button type="button">Done</button></div>
    </lsd-drawer>
  `,
})
class DrawerTestHostComponent {
  readonly open = signal(false);
  reason: DrawerCloseReason | undefined;
  closed(reason: DrawerCloseReason): void { this.reason = reason; this.open.set(false); }
}

describe('DrawerComponent', () => {
  let fixture: ComponentFixture<DrawerTestHostComponent>;
  let host: DrawerTestHostComponent;
  let drawer: HTMLDialogElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [DrawerTestHostComponent] }).compileComponents();
    fixture = TestBed.createComponent(DrawerTestHostComponent);
    host = fixture.componentInstance;
    drawer = fixture.debugElement.query(By.css('dialog')).nativeElement;
    spyOn(drawer, 'showModal').and.callFake(() => drawer.setAttribute('open', ''));
    spyOn(drawer, 'close').and.callFake(() => drawer.removeAttribute('open'));
    fixture.detectChanges();
  });

  it('labels the native modal and composes actions', () => {
    expect(drawer.getAttribute('aria-labelledby')).toBe('source-preview-title');
    expect(drawer.getAttribute('aria-describedby')).toBe('source-preview-description');
    expect(fixture.debugElement.query(By.css('.lsd-drawer__actions button')).nativeElement.textContent).toContain('Done');
  });

  it('opens modally and focuses the marked control', async () => {
    host.open.set(true); fixture.detectChanges(); await fixture.whenStable();
    expect(drawer.showModal).toHaveBeenCalled();
    expect(document.activeElement?.textContent).toContain('Open source');
  });

  it('closes with Escape and restores focus', () => {
    const opener = fixture.debugElement.query(By.css('#opener')).nativeElement as HTMLButtonElement;
    opener.focus(); host.open.set(true); fixture.detectChanges();
    drawer.dispatchEvent(new Event('cancel', { cancelable: true })); fixture.detectChanges();
    expect(host.reason).toBe('escape');
    expect(document.activeElement).toBe(opener);
  });

  it('applies logical placement, tokenized width, and semantic appearance', () => {
    expect(drawer.dataset['placement']).toBe('start');
    expect(drawer.style.getPropertyValue('--lsd-drawer-width')).toBe('42rem');
    expect(drawer.className).toContain('bg-surface-raised');
    expect(drawer.className).toContain('border-border-default');
  });
});
