# Business-neutral design-system APIs

Production design-system layers contain reusable visual and interaction
capability. They do not own routes, application records, remote data access,
starter labels, profile data, or feature workflows.

The initial transformed APIs follow these boundaries:

- `ButtonComponent` accepts typed visual and native-button inputs and projects
  its label/content.
- `DataTableComponent` owns only the accessible table surface and density. Its
  columns, rows, records, filtering, selection, and actions are supplied by a
  consuming feature through table markup and content projection.
- `WorkbenchShellRecipeComponent` owns the supported responsive shell slots.
  Navigation, header actions, current context, routes, and user controls are
  supplied by the application.

Lake Shore Drive business concepts may enter the design system only through
explicit recipes. Primitives, components, patterns, and layouts must not
import application feature models.
