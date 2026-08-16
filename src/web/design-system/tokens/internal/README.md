# Primitive colors

`primitive-colors.ts` is the machine-readable raw palette beneath future
semantic light and dark themes. Its scale names and numeric steps must never
appear in application feature code.

The palette is intentionally private:

- It is not exported by `tokens/index.ts` or the design-system public API.
- Components must consume semantic tokens rather than these values.
- Semantic token definitions will select appropriate steps for purpose,
  interaction state, appearance, and contrast requirements.
- A raw step is not evidence that a foreground/background pairing is
  accessible. Semantic pairings require WCAG 2.2 contrast verification.

Each scale spans a very light step (`50`) through a very dark step (`950`) so
light and dark appearances can select contrasting surfaces and foregrounds.
Numeric steps represent palette progression only; they carry no semantic
meaning.

