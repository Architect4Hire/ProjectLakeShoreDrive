import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';

import { AppNavbarComponent, type AppNavbarLink } from './app-navbar.component';

@Component({
  standalone: true,
  imports: [AppNavbarComponent],
  template: `
    <lsd-app-navbar [links]="links" profileName="Jamie Ortiz">
      <span lsdAppNavbarLogo>Lake Shore Drive</span>
      <button lsdProfileMenuLink type="button">Log out</button>
    </lsd-app-navbar>
  `,
})
class AppNavbarTestHostComponent {
  links: readonly AppNavbarLink[] = [
    { id: 'overview', label: 'Overview', routerLink: '/overview' },
    { id: 'requirements', label: 'Requirements', routerLink: '/requirements' },
  ];
}

describe('AppNavbarComponent', () => {
  let fixture: ComponentFixture<AppNavbarTestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppNavbarTestHostComponent],
      providers: [provideRouter([])],
    }).compileComponents();
    fixture = TestBed.createComponent(AppNavbarTestHostComponent);
    fixture.detectChanges();
  });

  it('renders projected logo content and top-level links as a labeled primary nav', () => {
    const nav = fixture.debugElement.query(By.css('nav[aria-label="Primary"]'));
    expect(nav.nativeElement.textContent).toContain('Overview');
    expect(nav.nativeElement.textContent).toContain('Requirements');
    expect(fixture.debugElement.query(By.css('.lsd-app-navbar__logo')).nativeElement.textContent).toContain('Lake Shore Drive');
  });

  it('composes a profile menu trigger with the given name and passes through projected links', () => {
    expect(fixture.debugElement.query(By.css('.lsd-profile-menu__trigger'))).not.toBeNull();
    expect(fixture.debugElement.query(By.css('.lsd-profile-menu__links')).nativeElement.textContent).toContain('Log out');
  });

  it('omits the primary nav landmark entirely when no links are provided', async () => {
    fixture.componentInstance.links = [];
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('nav[aria-label="Primary"]'))).toBeNull();
  });
});
