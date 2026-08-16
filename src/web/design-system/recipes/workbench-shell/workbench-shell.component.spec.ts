import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { WorkbenchShellRecipeComponent } from './workbench-shell.component';

@Component({
  standalone: true,
  imports: [WorkbenchShellRecipeComponent],
  template: `
    <lsd-workbench-shell-recipe id="consulting" [(navigationOpen)]="navigationOpen">
      <nav lsdWorkbenchNavigation><a href="/overview">Overview</a></nav>
      <button lsdWorkbenchEngagement type="button">Northwind engagement</button>
      <label lsdWorkbenchSearch>Search <input type="search" /></label>
      <button lsdWorkbenchCommandPalette type="button">Commands</button>
      <button lsdWorkbenchNotifications type="button">Notifications</button>
      <button lsdWorkbenchTasks type="button">Tasks</button>
      <button lsdWorkbenchUserMenu type="button">User menu</button>
      <div lsdWorkbenchContext>Discovery phase</div>
      <article>Workbench page</article>
      <span lsdWorkbenchFooter>Environment details</span>
    </lsd-workbench-shell-recipe>
  `,
})
class WorkbenchShellTestHostComponent {
  navigationOpen = false;
}

describe('WorkbenchShellRecipeComponent', () => {
  let fixture: ComponentFixture<WorkbenchShellTestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [WorkbenchShellTestHostComponent] }).compileComponents();
    fixture = TestBed.createComponent(WorkbenchShellTestHostComponent);
    fixture.detectChanges();
  });

  it('provides labeled navigation and main landmarks with a skip link', () => {
    const navigation = fixture.debugElement.query(By.css('aside')).nativeElement as HTMLElement;
    const main = fixture.debugElement.query(By.css('main')).nativeElement as HTMLElement;
    const skip = fixture.debugElement.query(By.css('.lsd-workbench-shell__skip')).nativeElement as HTMLAnchorElement;
    expect(navigation.getAttribute('aria-label')).toBe('Primary navigation');
    expect(main.getAttribute('aria-label')).toBe('Workbench content');
    expect(main.tabIndex).toBe(-1);
    expect(skip.getAttribute('href')).toBe('#consulting-content');
  });

  it('projects every workbench capability into its named region', () => {
    expect(fixture.debugElement.query(By.css('.lsd-workbench-shell__navigation-content')).nativeElement.textContent).toContain('Overview');
    expect(fixture.debugElement.query(By.css('.lsd-workbench-shell__engagement')).nativeElement.textContent).toContain('Northwind');
    expect(fixture.debugElement.query(By.css('.lsd-workbench-shell__search')).nativeElement.textContent).toContain('Search');
    const actions = fixture.debugElement.query(By.css('.lsd-workbench-shell__actions')).nativeElement.textContent as string;
    expect(actions).toContain('Commands');
    expect(actions).toContain('Notifications');
    expect(actions).toContain('Tasks');
    expect(actions).toContain('User menu');
    expect(fixture.debugElement.query(By.css('main')).nativeElement.textContent).toContain('Workbench page');
  });

  it('exposes caller-owned mobile navigation state and disclosure attributes', () => {
    const trigger = fixture.debugElement.query(By.css('.lsd-workbench-shell__navigation-trigger button')).nativeElement as HTMLButtonElement;
    expect(trigger.getAttribute('aria-controls')).toBe('consulting-navigation');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    trigger.click(); fixture.detectChanges();
    expect(fixture.componentInstance.navigationOpen).toBeTrue();
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' })); fixture.detectChanges();
    expect(fixture.componentInstance.navigationOpen).toBeFalse();
  });
});
