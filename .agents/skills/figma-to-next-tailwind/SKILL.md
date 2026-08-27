---
name: figma-to-next-tailwind
description: >
  Implement or correct Paintball website layouts from Figma in the existing
  static Next.js App Router project with React, TypeScript, Tailwind CSS v4,
  and next/image. Use for pages, sections, responsive states, weakly structured
  Figma files, visual comparison, and layout bugs. Preserve the project's simple
  SSG architecture and existing design language; do not introduce SSR, runtime
  content loading, new frontend frameworks, or unnecessary abstractions.
---

# Figma to Next + Tailwind

Build the supplied Figma design directly in the existing Paintball project.
Treat Next.js as a static site generator and Tailwind as the main styling tool.
Aim for visual accuracy, simple code, and reliable responsive behavior.

## Project contract

- Work in the existing Next.js App Router, React, TypeScript, and Tailwind v4
  structure.
- Keep the public site statically generated. Do not add SSR, dynamic rendering,
  Next API routes, Server Actions, or runtime requests for page content.
- Keep Bitrix content behind the existing build-time JSON boundary. Do not expose
  Bitrix internals in frontend components.
- Keep pages and presentational sections as ordinary components. Add
  `'use client'` only to a small component that actually needs state or browser
  events.
- Reuse existing components, utilities, fonts, colors, assets, and breakpoints.
- Do not add dependencies, configuration files, a new design system, or generic
  abstractions for a one-page task.
- Follow `AGENTS.md` and the current repository structure when they define a
  stricter project rule.

## Start with the actual task

Before editing:

1. Inspect the target route or section and nearby components.
2. Inspect `globals.css`, existing Tailwind utilities, and relevant local assets.
3. Inspect only the necessary Figma frame, selected node, measurements, and
   exported assets.
4. Compare the design with the current implementation and identify the smallest
   coherent change.

Do not write a separate discovery document unless the user asks for one. Do not
refactor unrelated code.

## Reconstruct Figma, do not copy its layer tree

Figma may contain default layer names, extra groups, missing Auto Layout,
inconsistent measurements, absolute coordinates, or no mobile frame. Infer the
real interface from:

1. visual hierarchy;
2. repeated alignment lines and spacing;
3. typography and content priority;
4. repeated cards, controls, and section patterns;
5. existing project conventions.

Use meaningful components such as `Hero`, `QuizCard`, or `SectionHeading`.
Do not reproduce names such as `Frame 123`, and do not translate canvas `x/y`
coordinates into page-level `left/top` values.

Normalize tiny accidental differences between identical Figma instances. Keep
an unusual value when it clearly controls the composition or represents a real
variant.

## Implement with simple layout primitives

Prefer, in order:

1. normal document flow;
2. Flexbox;
3. CSS Grid;
4. absolute positioning for intentional overlap or decoration.

Use Tailwind classes in TSX for ordinary component styling. Keep global fonts,
CSS variables, Tailwind v4 `@theme` mappings, and true global foundations in
`globals.css`. Use an arbitrary value when the design genuinely needs one; do
not create a token for every measurement.

Keep related elements in the same layout system. For example, if descriptive
text, player artwork, and a quiz must avoid one another, put them on the same
grid and position the artwork relative to its central grid area. Do not center
the artwork independently against the viewport.

Keep important content in normal flow. Use fixed heights only when the design is
truly viewport-bound and the shorter supported viewports have been checked.

## Images and layered artwork

- Reuse local assets before exporting or generating replacements.
- Use `next/image` with the asset's real dimensions, a correct `alt`, and useful
  `sizes` when the rendered width is responsive.
- Use `fill` only inside a positioned wrapper with an intentional crop rule.
- Do not crop faces, bodies, equipment, products, or text merely to make the
  rectangle fit.
- Inspect transparent PNGs visually. CSS positions the whole image rectangle;
  it cannot detect heads, feet, or transparent padding inside the file.
- When a layered PNG must align with text, keep the surrounding layout stable
  and tune one clear property such as `bottom`, `object-position`, or
  `translate-y`.
- Use a separate mobile asset only when the composition genuinely cannot adapt
  with CSS. Keep the implementation direct; do not build an image abstraction
  for one hero.

## Responsive behavior

Build mobile-first unless the existing section already follows another clear
pattern. Infer missing mobile layouts from content priority rather than shrinking
the desktop frame.

- Preserve reading order and important actions.
- Stack or wrap content before it collides.
- Use project breakpoints first; add a custom breakpoint only at a real failure
  point.
- Prefer fluid width, gap, and type constraints over clusters of close media
  queries.
- Check viewport height as well as width for full-screen heroes.
- Never solve adaptation with page-wide `transform: scale()`.
- Prevent unintended horizontal scrolling and white gaps around the page.

For a normal change, verify one compact mobile, one common mobile, one laptop,
and one desktop size. Add more sizes only when the composition changes there.

## Interaction and accessibility

- Use links for navigation and buttons for actions.
- Keep headings and landmarks semantic.
- Keep controls keyboard-accessible with visible focus states.
- Use React state for quizzes, menus, tabs, and dialogs; do not manipulate the
  DOM as application state.
- Keep decorative layers out of the accessibility tree and use
  `pointer-events-none` when they must not block controls.

## Finish and verify

1. Compare the changed section with Figma at representative sizes.
2. Check that there is no horizontal overflow, white edge, accidental clipping,
   broken stacking, or control hidden under artwork.
3. Confirm that mobile content remains readable and usable on a short viewport.
4. Run the project-required format check, lint, and static production build.
5. Report the files changed, the responsive decisions made, and any intentional
   visual deviation.

When the design is ambiguous, prefer the simplest layout that preserves its
visual hierarchy and works across the supported sizes.
