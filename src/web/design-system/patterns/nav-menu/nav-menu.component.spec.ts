import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';

import { NavMenuComponent, type NavMenuGroup } from './nav-menu.component';

@Component({
  standalone: true,
  imports: [NavMenuComponent],
  template: `<lsd-nav-menu accessibleName="Primary" [groups]="groups" [(collapsed)]="collapsed" (itemActivated)="lastActivated = $event.id" />`,
})
class NavMenuTestHostComponent {
  groups: readonly NavMenuGroup[] = [
    {
      id: 'main',
      label: 'Main',
      items: [
        { id: 'overview', label: 'Overview', routerLink: '/overview' },
        {
          id: 'requirements',
          label: 'Requirements',
          routerLink: '/requirements',
          children: [{ id: 'requirements-active', label: 'Active', routerLink: '/requirements/active' }],
        },
      ],
    },
  ];
  collapsed = false;
  lastActivated: string | undefined;
}

describe('NavMenuComponent', () => {
  let fixture: ComponentFixture<NavMenuTestHostComponent>;
  let host: NavMenuTestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavMenuTestHostComponent],
      providers: [provideRouter([])],
    }).compileComponents();
    fixture = TestBed.createComponent(NavMenuTestHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('renders group labels and top-level items as links', () => {
    expect(fixture.debugElement.query(By.css('.lsd-nav-menu__group-label')).nativeElement.textContent).toBe('Main');
    expect(fixture.debugElement.queryAll(By.css('.lsd-nav-menu__link')).length).toBe(2);
  });

  it('shows an initials fallback badge when an item has no iconName', () => {
    expect(fixture.debugElement.query(By.css('.lsd-nav-menu__initial')).nativeElement.textContent).toBe('O');
  });

  it('emits itemActivated with the clicked item id', () => {
    const link = fixture.debugElement.query(By.css('.lsd-nav-menu__link'));
    link.nativeElement.click();
    expect(host.lastActivated).toBe('overview');
  });

  it('expands and collapses an item with children via the expand toggle', () => {
    expect(fixture.debugElement.queryAll(By.css('.lsd-nav-menu__list--nested')).length).toBe(0);
    const expandButton = fixture.debugElement.query(By.css('.lsd-nav-menu__expand')).nativeElement as HTMLButtonElement;
    expect(expandButton.getAttribute('aria-expanded')).toBe('false');
    expandButton.click();
    fixture.detectChanges();
    expect(expandButton.getAttribute('aria-expanded')).toBe('true');
    expect(fixture.debugElement.queryAll(By.css('.lsd-nav-menu__list--nested a')).length).toBe(1);
  });

  it('switches to icon-rail collapsed mode, keeping the label available to screen readers', () => {
    host.collapsed = true;
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.lsd-nav-menu')).nativeElement.dataset['collapsed']).toBe('true');
    expect(fixture.debugElement.queryAll(By.css('.lsd-nav-menu__link--collapsed')).length).toBe(2);
    expect(fixture.debugElement.query(By.css('.lsd-nav-menu__link--collapsed .lsd-sr-only')).nativeElement.textContent).toBe('Overview');
  });
});
