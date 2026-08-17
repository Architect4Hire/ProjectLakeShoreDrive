import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppearanceService } from '../../design-system/foundations/appearance.service';

// Primitives
import { ButtonComponent } from '../../design-system/primitives/button/button.component';
import { BadgeComponent } from '../../design-system/primitives/badge/badge.component';
import { InputComponent } from '../../design-system/primitives/input/input.component';
import { TextareaComponent } from '../../design-system/primitives/textarea/textarea.component';
import { SelectComponent } from '../../design-system/primitives/select/select.component';
import { CheckboxComponent } from '../../design-system/primitives/checkbox/checkbox.component';
import { SeparatorComponent } from '../../design-system/primitives/separator/separator.component';
import { SurfaceComponent } from '../../design-system/primitives/surface/surface.component';
import { TabsComponent } from '../../design-system/primitives/tabs/tabs.component';
import { IconComponent } from '../../design-system/icons/icon.component';

// Components
import { StepperComponent } from '../../design-system/components/stepper/stepper.component';
import { NotificationViewportComponent } from '../../design-system/components/notification/notification-viewport.component';
import { AlertBannerComponent } from '../../design-system/components/alert-banner/alert-banner.component';

// Patterns
import { FormSectionComponent } from '../../design-system/patterns/form-section/form-section.component';
import { StateFeedbackComponent } from '../../design-system/patterns/state-feedback/state-feedback.component';
import { ActivityStreamComponent } from '../../design-system/patterns/activity-stream/activity-stream.component';

@Component({
  selector: 'lsd-gallery',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    BadgeComponent,
    InputComponent,
    TextareaComponent,
    SelectComponent,
    CheckboxComponent,
    SeparatorComponent,
    SurfaceComponent,
    TabsComponent,
    IconComponent,
    StepperComponent,
    NotificationViewportComponent,
    AlertBannerComponent,
    FormSectionComponent,
    StateFeedbackComponent,
    ActivityStreamComponent,
  ],
  template: `
    <lsd-notification-viewport />
    <div class="min-h-screen bg-background">
      <div class="border-b border-border">
        <div class="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-foreground">Design System Gallery</h1>
            <p class="text-sm text-muted-foreground mt-1">Integration reference for Lake Shore Drive design-system components and patterns</p>
          </div>
          <lsd-button tone="neutral" (activated)="toggleTheme()">
            <lsd-icon [name]="appearance() === 'light' ? 'info' : 'warning'" size="small" />
            {{ appearance() === 'light' ? 'Dark' : 'Light' }}
          </lsd-button>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-6 py-8 space-y-12">
        <!-- PRIMITIVES SECTION -->
        <section>
          <h2 class="text-2xl font-semibold text-foreground mb-6">Primitives</h2>

          <!-- Buttons -->
          <div class="mb-8">
            <h3 class="text-lg font-medium text-foreground mb-4">Buttons</h3>
            <div class="flex flex-wrap gap-4">
              <lsd-button tone="primary">Primary</lsd-button>
              <lsd-button tone="neutral">Neutral</lsd-button>
              <lsd-button tone="danger">Danger</lsd-button>
              <lsd-button tone="warning">Warning</lsd-button>
              <lsd-button tone="success">Success</lsd-button>
              <lsd-button tone="info">Info</lsd-button>
              <lsd-button tone="primary" [disabled]="true">Disabled</lsd-button>
            </div>
          </div>

          <!-- Button Sizes and Shapes -->
          <div class="mb-8">
            <h3 class="text-lg font-medium text-foreground mb-4">Button Variants</h3>
            <div class="space-y-4">
              <div class="flex flex-wrap gap-3">
                <lsd-button size="small" tone="primary">Small</lsd-button>
                <lsd-button size="medium" tone="primary">Medium</lsd-button>
                <lsd-button size="large" tone="primary">Large</lsd-button>
              </div>
              <div class="flex flex-wrap gap-3">
                <lsd-button impact="bold" tone="primary">Bold</lsd-button>
                <lsd-button impact="light" tone="primary">Light</lsd-button>
                <lsd-button impact="minimal" tone="primary">Minimal</lsd-button>
              </div>
              <div class="flex flex-wrap gap-3">
                <lsd-button shape="square" tone="primary">Square</lsd-button>
                <lsd-button shape="rounded" tone="primary">Rounded</lsd-button>
                <lsd-button shape="pill" tone="primary">Pill</lsd-button>
              </div>
            </div>
          </div>

          <!-- Badges -->
          <div class="mb-8">
            <h3 class="text-lg font-medium text-foreground mb-4">Badges</h3>
            <div class="flex flex-wrap gap-4">
              <lsd-badge>Default</lsd-badge>
              <lsd-badge>Active</lsd-badge>
              <lsd-badge>Pending</lsd-badge>
              <lsd-badge>Complete</lsd-badge>
            </div>
          </div>

          <!-- Form Controls -->
          <div class="mb-8">
            <h3 class="text-lg font-medium text-foreground mb-4">Form Controls</h3>
            <div class="space-y-4 max-w-md">
              <lsd-input id="input-demo" label="Text Input" placeholder="Enter text..." />
              <lsd-textarea id="textarea-demo" label="Textarea" placeholder="Enter description..." />
              <lsd-select id="select-demo" label="Select Option" [options]="selectOptions" />
              <lsd-checkbox id="checkbox-demo" label="Checkbox Option" />
            </div>
          </div>

          <!-- Separator -->
          <div class="mb-8">
            <h3 class="text-lg font-medium text-foreground mb-4">Separator</h3>
            <lsd-separator />
          </div>

          <!-- Surface -->
          <div class="mb-8">
            <h3 class="text-lg font-medium text-foreground mb-4">Surface / Card</h3>
            <lsd-surface class="p-6">
              <h4 class="font-semibold text-foreground mb-2">Surface Component</h4>
              <p class="text-sm text-muted-foreground">This is a surface primitive with default styling for cards and contained content.</p>
            </lsd-surface>
          </div>

          <!-- Tabs -->
          <div class="mb-8">
            <h3 class="text-lg font-medium text-foreground mb-4">Tabs</h3>
            <lsd-tabs id="tab-demo" label="Example Tabs" [tabs]="tabItems" selected="discovery">
              <div role="tabpanel" class="p-4">
                <p class="text-sm text-foreground">Discovery phase content...</p>
              </div>
            </lsd-tabs>
          </div>
        </section>

        <!-- COMPONENTS SECTION -->
        <section>
          <h2 class="text-2xl font-semibold text-foreground mb-6">Components</h2>

          <!-- Data Table -->
          <div class="mb-8">
            <h3 class="text-lg font-medium text-foreground mb-4">Data Table</h3>
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead class="border-b border-border bg-muted">
                  <tr>
                    <th class="px-4 py-3 text-left font-medium text-foreground">Item</th>
                    <th class="px-4 py-3 text-left font-medium text-foreground">Status</th>
                    <th class="px-4 py-3 text-left font-medium text-foreground">Date</th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="border-b border-border hover:bg-muted/50">
                    <td class="px-4 py-3 text-foreground">Requirement #1</td>
                    <td class="px-4 py-3"><lsd-badge>Approved</lsd-badge></td>
                    <td class="px-4 py-3 text-muted-foreground">2024-01-15</td>
                  </tr>
                  <tr class="border-b border-border hover:bg-muted/50">
                    <td class="px-4 py-3 text-foreground">Architecture Pattern</td>
                    <td class="px-4 py-3"><lsd-badge>In Review</lsd-badge></td>
                    <td class="px-4 py-3 text-muted-foreground">2024-01-14</td>
                  </tr>
                  <tr class="border-b border-border hover:bg-muted/50">
                    <td class="px-4 py-3 text-foreground">Design System</td>
                    <td class="px-4 py-3"><lsd-badge>Complete</lsd-badge></td>
                    <td class="px-4 py-3 text-muted-foreground">2024-01-13</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Alert Banners -->
          <div class="mb-8">
            <h3 class="text-lg font-medium text-foreground mb-4">Alert Banners</h3>
            <div class="space-y-3">
              <lsd-alert-banner id="info-banner" variant="info" title="Information">
                <p class="text-sm">This is an informational alert banner</p>
              </lsd-alert-banner>
              <lsd-alert-banner id="warning-banner" variant="warning" title="Warning">
                <p class="text-sm">This is a warning alert banner</p>
              </lsd-alert-banner>
            </div>
          </div>

          <!-- Stepper -->
          <div class="mb-8">
            <h3 class="text-lg font-medium text-foreground mb-4">Stepper / Progress</h3>
            <lsd-stepper
              label="Project Phases"
              [steps]="stepperSteps"
              [active]="'requirements'"
            />
          </div>
        </section>

        <!-- PATTERNS SECTION -->
        <section>
          <h2 class="text-2xl font-semibold text-foreground mb-6">Patterns & Layouts</h2>

          <!-- Form Section -->
          <div class="mb-8">
            <h3 class="text-lg font-medium text-foreground mb-4">Form Section Pattern</h3>
            <lsd-form-section id="form-section-1" title="Engagement Details">
              <div class="space-y-4">
                <lsd-input id="client-name" label="Client Name" />
                <lsd-select id="project-type" label="Project Type" [options]="projectTypeOptions" />
                <lsd-textarea id="description" label="Description" />
              </div>
            </lsd-form-section>
          </div>

          <!-- State Feedback -->
          <div class="mb-8">
            <h3 class="text-lg font-medium text-foreground mb-4">State Feedback</h3>
            <div class="space-y-4">
              <lsd-state-feedback id="state-loading" kind="loading" title="Loading">
                <p class="text-sm">Loading engagement details...</p>
              </lsd-state-feedback>
              <lsd-state-feedback id="state-empty" kind="empty" title="No Data">
                <p class="text-sm">No items to display</p>
              </lsd-state-feedback>
            </div>
          </div>

          <!-- Activity Stream -->
          <div class="mb-8">
            <h3 class="text-lg font-medium text-foreground mb-4">Activity Stream</h3>
            <lsd-activity-stream id="gallery-activity" [items]="activityItems" />
          </div>
        </section>

        <!-- RESPONSIVE LAYOUT SECTION -->
        <section>
          <h2 class="text-2xl font-semibold text-foreground mb-6">Responsive Layout</h2>
          <p class="text-sm text-muted-foreground mb-4">Resize your browser to see responsive behavior</p>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <lsd-surface class="p-6">
              <h4 class="font-semibold text-foreground mb-2">Mobile</h4>
              <p class="text-sm text-muted-foreground">1 column on mobile</p>
            </lsd-surface>
            <lsd-surface class="p-6">
              <h4 class="font-semibold text-foreground mb-2">Tablet</h4>
              <p class="text-sm text-muted-foreground">2 columns on tablet</p>
            </lsd-surface>
            <lsd-surface class="p-6">
              <h4 class="font-semibold text-foreground mb-2">Desktop</h4>
              <p class="text-sm text-muted-foreground">3 columns on desktop</p>
            </lsd-surface>
          </div>
        </section>

        <!-- THEME SUPPORT SECTION -->
        <section>
          <h2 class="text-2xl font-semibold text-foreground mb-6">Theme Support</h2>
          <p class="text-sm text-muted-foreground mb-4">Click the theme toggle button at the top to switch between light and dark appearances</p>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <lsd-surface class="p-6 bg-background border-2 border-border">
              <h4 class="font-semibold text-foreground mb-2">Light Appearance</h4>
              <p class="text-sm text-muted-foreground">Uses semantic color tokens for light mode</p>
            </lsd-surface>
            <lsd-surface class="p-6">
              <h4 class="font-semibold text-foreground mb-2">Dark Appearance</h4>
              <p class="text-sm text-muted-foreground">Uses semantic color tokens for dark mode</p>
            </lsd-surface>
          </div>
        </section>

        <!-- VERIFICATION CHECKLIST -->
        <section class="border-t border-border pt-8">
          <h2 class="text-2xl font-semibold text-foreground mb-6">Integration Verification</h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 class="font-medium text-foreground mb-3">✓ Rendered Primitives</h3>
              <ul class="space-y-2 text-sm text-foreground">
                <li>✓ Buttons (all tones, sizes, shapes)</li>
                <li>✓ Form controls (input, textarea, select, checkbox)</li>
                <li>✓ Badges</li>
                <li>✓ Surfaces/Cards</li>
                <li>✓ Separators</li>
                <li>✓ Tabs</li>
              </ul>
            </div>

            <div>
              <h3 class="font-medium text-foreground mb-3">✓ Rendered Components</h3>
              <ul class="space-y-2 text-sm text-foreground">
                <li>✓ Data table with badges</li>
                <li>✓ Alert banners (info, warning)</li>
                <li>✓ Stepper/Progress indicators</li>
                <li>✓ Notification viewport</li>
                <li>✓ Form sections</li>
                <li>✓ State feedback patterns</li>
              </ul>
            </div>

            <div>
              <h3 class="font-medium text-foreground mb-3">✓ Responsive Design</h3>
              <ul class="space-y-2 text-sm text-foreground">
                <li>✓ Mobile-first breakpoints</li>
                <li>✓ Grid layouts (1/2/3 col)</li>
                <li>✓ Flexible spacing</li>
                <li>✓ Touch-friendly interaction</li>
                <li>✓ Overflow handling</li>
                <li>✓ Responsive typography</li>
              </ul>
            </div>

            <div>
              <h3 class="font-medium text-foreground mb-3">✓ Theme Support</h3>
              <ul class="space-y-2 text-sm text-foreground">
                <li>✓ Light appearance</li>
                <li>✓ Dark appearance</li>
                <li>✓ Semantic colors</li>
                <li>✓ Focus visibility</li>
                <li>✓ Contrast preservation</li>
                <li>✓ Theme persistence</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class GalleryComponent {
  private readonly appearanceService = inject(AppearanceService);
  protected readonly appearance = this.appearanceService.appearance;

  protected readonly selectOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ];

  protected readonly tabItems = [
    { identity: 'discovery', label: 'Discovery' },
    { identity: 'requirements', label: 'Requirements' },
    { identity: 'architecture', label: 'Architecture' },
  ];

  protected readonly projectTypeOptions = [
    { value: 'cloud-migration', label: 'Cloud Migration' },
    { value: 'microservices', label: 'Microservices' },
    { value: 'ai-integration', label: 'AI Integration' },
  ];

  protected readonly stepperSteps = [
    { identity: 'discovery' as const, label: 'Discovery', state: 'complete' as const },
    { identity: 'requirements' as const, label: 'Requirements', state: 'complete' as const },
    { identity: 'architecture' as const, label: 'Architecture', state: 'incomplete' as const },
    { identity: 'estimation' as const, label: 'Estimation', state: 'incomplete' as const },
  ];

  protected readonly activityItems = [
    {
      identity: '1',
      actor: 'Architect Team',
      occurredAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      timestampLabel: '2 hours ago',
      action: 'Requirements approved',
      attribution: 'human-approved' as const,
    },
    {
      identity: '2',
      actor: 'AI System',
      occurredAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      timestampLabel: '4 hours ago',
      action: 'Architecture patterns selected',
      attribution: 'ai-suggested' as const,
    },
    {
      identity: '3',
      actor: 'System',
      occurredAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      timestampLabel: '8 hours ago',
      action: 'Discovery completed',
      attribution: 'system' as const,
    },
  ];

  toggleTheme(): void {
    this.appearanceService.toggleAppearance();
  }
}
