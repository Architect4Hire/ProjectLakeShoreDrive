import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CommandPaletteComponent, CommandPaletteGroup } from './command-palette.component';

type Command = 'open' | 'create' | 'disabled';
@Component({
  standalone: true,
  imports: [CommandPaletteComponent],
  template: `<button id="trigger">Trigger</button><lsd-command-palette id="global" [groups]="groups"
    [(open)]="open" (commandSelected)="selected = $event" />`,
})
class CommandPaletteTestHostComponent {
  readonly groups: readonly CommandPaletteGroup<Command>[] = [
    { id: 'navigation', label: 'Navigation', commands: [
      { id: 'open', identity: 'open', label: 'Open library', keywords: ['browse'] },
      { id: 'disabled', identity: 'disabled', label: 'Unavailable', disabled: true },
    ] },
    { id: 'actions', label: 'Actions', commands: [
      { id: 'create', identity: 'create', label: 'Create item', description: 'Start something new' },
    ] },
  ];
  open = false;
  selected: Command | undefined;
}

describe('CommandPaletteComponent', () => {
  let fixture: ComponentFixture<CommandPaletteTestHostComponent>;
  let host: CommandPaletteTestHostComponent;
  let dialog: HTMLDialogElement;
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [CommandPaletteTestHostComponent] }).compileComponents();
    fixture = TestBed.createComponent(CommandPaletteTestHostComponent); host = fixture.componentInstance;
    fixture.detectChanges(); dialog = fixture.debugElement.query(By.css('dialog')).nativeElement;
    spyOn(dialog, 'showModal').and.callFake(() => dialog.setAttribute('open', ''));
    spyOn(dialog, 'close').and.callFake(() => dialog.removeAttribute('open'));
  });
  it('opens from the primary keyboard shortcut and focuses search', async () => {
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, bubbles: true }));
    fixture.detectChanges(); await fixture.whenStable();
    expect(host.open).toBeTrue(); expect(dialog.showModal).toHaveBeenCalled();
    expect((document.activeElement as HTMLElement).getAttribute('role')).toBe('combobox');
  });
  it('filters grouped commands by labels, descriptions, and keywords', () => {
    host.open = true; fixture.detectChanges();
    const search = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
    search.value = 'browse'; search.dispatchEvent(new Event('input')); fixture.detectChanges();
    expect(fixture.debugElement.queryAll(By.css('[role="option"]')).length).toBe(1);
    expect(fixture.debugElement.query(By.css('[role="option"]')).nativeElement.textContent).toContain('Open library');
  });
  it('moves active descendant, skips disabled commands, and emits typed selection', () => {
    host.open = true; fixture.detectChanges();
    const search = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
    search.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true })); fixture.detectChanges();
    expect(search.getAttribute('aria-activedescendant')).toBe('global-command-create');
    search.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })); fixture.detectChanges();
    expect(host.selected).toBe('create'); expect(host.open).toBeFalse();
  });
  it('announces an empty result set', () => {
    host.open = true; fixture.detectChanges();
    const search = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
    search.value = 'no result'; search.dispatchEvent(new Event('input')); fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('[role="status"]')).nativeElement.textContent).toContain('No matching commands');
  });
});
