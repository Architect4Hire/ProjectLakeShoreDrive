import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { AppearanceService } from '../../foundations/appearance.service';
import { ProfileMenuComponent } from './profile-menu.component';

@Component({
  standalone: true,
  imports: [ProfileMenuComponent],
  template: `
    <lsd-profile-menu id="test-menu" name="Jamie Ortiz" email="jamie@example.com">
      <button lsdProfileMenuLink type="button">Log out</button>
    </lsd-profile-menu>
  `,
})
class ProfileMenuTestHostComponent {}

describe('ProfileMenuComponent', () => {
  let fixture: ComponentFixture<ProfileMenuTestHostComponent>;
  let appearance: AppearanceService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ProfileMenuTestHostComponent] }).compileComponents();
    fixture = TestBed.createComponent(ProfileMenuTestHostComponent);
    appearance = TestBed.inject(AppearanceService);
    fixture.detectChanges();
  });

  it('shows an initials avatar and identity header derived from name/email', () => {
    expect(fixture.debugElement.query(By.css('.lsd-profile-menu__trigger .lsd-profile-menu__avatar')).nativeElement.textContent.trim()).toBe('J');
    expect(fixture.debugElement.query(By.css('.lsd-profile-menu__name')).nativeElement.textContent).toBe('Jamie Ortiz');
    expect(fixture.debugElement.query(By.css('.lsd-profile-menu__email')).nativeElement.textContent).toBe('jamie@example.com');
  });

  it('projects consumer-owned links into the links slot', () => {
    expect(fixture.debugElement.query(By.css('.lsd-profile-menu__links')).nativeElement.textContent).toContain('Log out');
  });

  it('renders one swatch per accent color and marks the active one pressed', () => {
    const swatches = fixture.debugElement.queryAll(By.css('.lsd-profile-menu__swatch'));
    expect(swatches.length).toBe(7);
    expect(swatches[0].nativeElement.getAttribute('aria-pressed')).toBe('true');
  });

  it('calls through to AppearanceService for appearance, accent, and direction changes', () => {
    spyOn(appearance, 'setAppearance');
    spyOn(appearance, 'setAccentColor');
    spyOn(appearance, 'setDirection');

    (fixture.debugElement.queryAll(By.css('.lsd-profile-menu__toggle-group button'))[1].nativeElement as HTMLButtonElement).click();
    expect(appearance.setAppearance).toHaveBeenCalledWith('dark');

    fixture.debugElement.queryAll(By.css('.lsd-profile-menu__swatch'))[6].nativeElement.click();
    expect(appearance.setAccentColor).toHaveBeenCalledWith('violet');

    const directionButtons = fixture.debugElement.queryAll(By.css('.lsd-profile-menu__toggle-group button'));
    (directionButtons[directionButtons.length - 1].nativeElement as HTMLButtonElement).click();
    expect(appearance.setDirection).toHaveBeenCalledWith('rtl');
  });
});
