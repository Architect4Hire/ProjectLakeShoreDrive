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
- `WorkbenchShellComponent` owns shell layout slots. Navigation, header,
  footer, current context, routes, and user controls are supplied by the
  application.
- `ClickOutsideDirective` provides interaction behavior without menu, profile,
  route, or domain knowledge. It remains a private implementation utility.

Lake Shore Drive business concepts may enter the design system only through
explicit recipes. Primitives, components, patterns, and layouts must not
import application feature models.
