import { Route } from '@angular/router';
import { describe, expect, it } from 'vitest';
import { ENGAGEMENT_PHASE_ROUTES } from './engagement-shell.routes';

async function resolve(route: Route): Promise<{ name: string }> {
  // loadComponent already resolves to the component class itself (the routes file maps the
  // dynamic import's module namespace down to `m.SomeComponent`), not a module namespace.
  const componentClass = await (route.loadComponent as unknown as () => Promise<{ name: string }>)();
  return { name: componentClass.name };
}

describe('ENGAGEMENT_PHASE_ROUTES', () => {
  it('redirects the empty child path to overview', () => {
    const redirect = ENGAGEMENT_PHASE_ROUTES.find((route) => route.path === '');
    expect(redirect?.redirectTo).toBe('overview');
  });

  it('resolves the overview path to EngagementOverviewComponent', async () => {
    const overview = ENGAGEMENT_PHASE_ROUTES.find((route) => route.path === 'overview');
    const resolved = await resolve(overview!);
    expect(resolved.name).toContain('EngagementOverviewComponent');
  });

  it('resolves every other phase to the placeholder component', async () => {
    const otherPhases = ENGAGEMENT_PHASE_ROUTES.filter(
      (route) => route.path && route.path !== 'overview',
    );
    expect(otherPhases.length).toBe(8);

    for (const route of otherPhases) {
      const resolved = await resolve(route);
      expect(resolved.name).toContain('EngagementPhasePlaceholderComponent');
    }
  });
});
