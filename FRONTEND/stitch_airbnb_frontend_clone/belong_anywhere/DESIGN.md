---
name: Belong Anywhere
colors:
  surface: '#fcf9f8'
  surface-dim: '#dcd9d9'
  surface-bright: '#fcf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f2'
  surface-container: '#f0eded'
  surface-container-high: '#eae7e7'
  surface-container-highest: '#e5e2e1'
  on-surface: '#1b1c1c'
  on-surface-variant: '#5c3f41'
  inverse-surface: '#303030'
  inverse-on-surface: '#f3f0ef'
  outline: '#906f70'
  outline-variant: '#e5bdbe'
  surface-tint: '#be0038'
  primary: '#ba0036'
  on-primary: '#ffffff'
  primary-container: '#e21e4a'
  on-primary-container: '#fffbff'
  inverse-primary: '#ffb2b6'
  secondary: '#ba0033'
  on-secondary: '#ffffff'
  secondary-container: '#e51344'
  on-secondary-container: '#fffbff'
  tertiary: '#00676b'
  on-tertiary: '#ffffff'
  tertiary-container: '#008287'
  on-tertiary-container: '#f3ffff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdada'
  primary-fixed-dim: '#ffb2b6'
  on-primary-fixed: '#40000d'
  on-primary-fixed-variant: '#920029'
  secondary-fixed: '#ffdada'
  secondary-fixed-dim: '#ffb3b5'
  on-secondary-fixed: '#40000b'
  on-secondary-fixed-variant: '#920026'
  tertiary-fixed: '#91f2f7'
  tertiary-fixed-dim: '#74d6db'
  on-tertiary-fixed: '#002021'
  on-tertiary-fixed-variant: '#004f52'
  background: '#fcf9f8'
  on-background: '#1b1c1c'
  surface-variant: '#e5e2e1'
typography:
  display:
    fontFamily: Plus Jakarta Sans
    fontSize: 3rem
    fontWeight: '700'
    lineHeight: 3.5rem
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 2rem
    fontWeight: '600'
    lineHeight: 2.5rem
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.625rem
    fontWeight: '600'
    lineHeight: 2rem
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.25rem
    fontWeight: '600'
    lineHeight: 1.625rem
    letterSpacing: -0.005em
  title-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 1rem
    fontWeight: '600'
    lineHeight: 1.375rem
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.125rem
    fontWeight: '400'
    lineHeight: 1.625rem
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 0.9375rem
    fontWeight: '400'
    lineHeight: 1.375rem
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 0.875rem
    fontWeight: '400'
    lineHeight: 1.25rem
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 0.875rem
    fontWeight: '600'
    lineHeight: 1.125rem
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 0.75rem
    fontWeight: '600'
    lineHeight: 1rem
  label-caps:
    fontFamily: Plus Jakarta Sans
    fontSize: 0.6875rem
    fontWeight: '700'
    lineHeight: 0.875rem
    letterSpacing: 0.04em
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  gutter: 1.5rem
  margin: 2.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1rem
  space-xl: 1.5rem
---

## Brand & Style

The design system embodies belonging, trust, warmth, and frictionless discovery. It prioritizes content-first travel exploration where high-resolution imagery takes center stage, supported by human, restrained, and intentional UI scaffolding. The emotional posture is welcoming, sophisticated yet accessible, and dependable.

The aesthetic blends **Modern Geometric Minimalism** with tactile, floating spatial accents. Layouts feature abundant whitespace, unhurried type scales, and subtle environmental depth. Interactive touchpoints prioritize immediate visual clarity: high-contrast typography anchors the eye, while soft borders and gentle diffuse drop shadows guide spatial transitions without competing against photography.

## Colors

The palette is engineered around high legibility, brand recognizability, and photographic clarity:

- **Primary (`#FF385C` - Rausch):** Reserved for primary brand moments, key conversion actions (Instant Book, Request to Book), heart-favorite active states, and focus accents.
- **Secondary (`#E00B41`):** Hover and pressed states for primary actions, providing grounded optical feedback under cursor interaction.
- **Tertiary (`#008489`):** Accent tone historically utilized for rare verification marks, verified host badges, or contextual micro-highlights.
- **Neutrals & Surfaces:**
  - **High-Emphasis Charcoal (`#222222`):** Primary headings, titles, active labels, and critical values.
  - **Secondary Mid-Gray (`#717171`):** Subtitles, meta-information, dates, distances, and empty-state iconography.
  - **Light Border Gray (`#DDDDDD`):** Persistent structural dividers, card borders, and resting pill containers.
  - **Subtle Surface Gray (`#F7F7F7`):** Hover states on neutral buttons, search pill segments, and pill tab backgrounds.
  - **Divider Hairline (`#EBEBEB`):** Segment line separators and horizontal section breaks.
  - **Pure White (`#FFFFFF`):** Base canvas and floating surface layers.

## Typography

The type system relies on **Plus Jakarta Sans** to channel the clarity, geometric balance, and warmth of modern human-centered grotesques. 

- **Weight Disciplines:** Use `700` selectively for brand anchors and micro-eyebrows. Use `600` across all interactive titles, section headings, and listing names. Use `400` for conversational body copy and metadata.
- **Hierarchy Mapping:**
  - Listing titles use `title-md` (`1rem`, `weight: 600`) with charcoal color.
  - Price tags use `title-md` for the amount paired with `body-sm` (`400`) for "night".
  - Search segment inputs use `label-caps` for the upper prompt ("Where", "Check-in", "Who") and `body-sm` for the value placeholder.

## Layout & Spacing

The layout operates on a fluid, edge-to-edge container paradigm structured for screen scale optimization.

- **Desktop Breakpoints & Grid Rules:**
  - **Ultra-Wide (`≥ 1640px`):** 6-column listing grid, outer margin `5rem`, column gutter `1.5rem`.
  - **Standard Desktop (`1440px - 1639px`):** 5-column listing grid, outer margin `2.5rem`, column gutter `1.5rem`.
  - **Compact Desktop (`1128px - 1439px`):** 4-column listing grid, outer margin `2.5rem`, column gutter `1.5rem`.
  - **Small Desktop / Large Tablet (`744px - 1127px`):** 3-column listing grid, outer margin `2rem`, column gutter `1rem`.
- **Rhythm & Safe Insets:**
  - Global navigation bar maintains a fixed desktop height of `80px` with persistent horizontal alignment matching the page margin.
  - Category bar sits `0` distance directly below the header with sticky scrolling behavior.
  - Listing card image ratio is fixed at `20:19` across all grid variations. Vertical text spacing under each card uses `space-xs` (4px) to `space-sm` (8px).

## Elevation & Depth

Visual hierarchy uses flat surfaces bounded by crisp hairlines (`1px solid #DDDDDD`), punctuated by diffuse ambient elevation for interactive or floating states:

- **Surface Level 0 (Canvas):** Flat pure white (`#FFFFFF`) with zero shadow.
- **Level 1 (Structural Borders):** Dividers and card frames constructed using `#EBEBEB` and `#DDDDDD` without shadow.
- **Level 2 (Resting Floating Pill):** Floating compact search pill in header rest state:
  `box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.05);`
- **Level 3 (Search Bar Expanded & Card Hover):** Hover state over search bar or floating modal sheet:
  `box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);`
- **Level 4 (Floating Map Button & Modals):** Central bottom-anchored "Show map" pills and dropdown pickers:
  `box-shadow: 0 6px 16px rgba(0, 0, 0, 0.16);`

## Shapes

The design system implements a rounded and pill-dominant shape profile:

- **Pill Geometry (`rounded-full` / `9999px`):**
  - Primary, secondary, and icon action buttons.
  - Expanded search bar container and inner hover segments.
  - Superhost status pills, price pills, and filter modal triggers.
- **Card Geometry (`rounded-xl` / `1rem`):**
  - Listing photography carousel containers (`border-radius: 0.75rem` to `1rem`).
  - Dropdown menu flyouts and guest selector panels.
- **Form Controls:**
  - Inputs inside modals utilize standard `0.5rem` (`rounded`) interior grouping with outer `0.75rem` boundaries.

## Components

### Header & Navigation
- Top navigation pinned at `80px` height with a 1px baseline border (`#EBEBEB`).
- Left: Brand icon mark in `#FF385C`.
- Center: Resting search pill showing three concatenated sections ("Anywhere | Any week | Add guests") with a round `#FF385C` search icon container (`32px × 32px`).
- Right: "Become a Host" plain text link, globe language selector, and user profile pill button containing hamburger icon and profile avatar inside a `#DDDDDD` border.

### 3-Segment Expanded Desktop Search Bar
- Centered container spanning up to `850px` with a pure white background and `box-shadow: 0 16px 32px rgba(0,0,0,0.15)`.
- Divided into three interactive zones separated by vertical hairline dividers (`#DDDDDD`):
  1. **Where:** "Search destinations" input field with placeholder text in `#717171`.
  2. **Check-in / Check-out:** Side-by-side date selectors displaying "Add dates".
  3. **Who:** "Add guests" trigger, terminated by a circular `#FF385C` search action button (`48px × 48px`).
- Active segment switches to white background with surrounding segments shaded in `#EBEBEB` on hover.

### Category Icon Carousel
- Horizontal flex track with sticky header positioning.
- Category item: 24px line icon paired with an 11px medium title.
- Default state: `#717171` color with no border.
- Hover state: `#222222` color with a 2px `#DDDDDD` bottom indicator.
- Active state: `#222222` color with an intentional 2px `#222222` bottom underline positioned `10px` below the text.

### Listing Cards
- **Media Container:** Aspect ratio `20:19`, corner radius `0.75rem`, overflow hidden.
- **Carousel Controls:** Prev/Next chevron buttons inside `32px` white circular pills, hidden by default and revealed only on card hover. Bottom-centered pagination dots (active dot white, inactive dots white at 60% opacity).
- **Heart Favorite Button:** Top-right corner, `24px` vector with a `2px` white stroke and semi-transparent fill in resting state; transitions to solid `#FF385C` when saved.
- **Superhost Badge:** Top-left white floating chip with `border-radius: 0.25rem`, subtle shadow, displaying uppercase text with bold star icon.
- **Meta Block:**
  - Row 1: Bold title (destination/neighborhood) aligned left; star rating + review count aligned right.
  - Row 2: Distance or host category in `#717171`.
  - Row 3: Available date range in `#717171`.
  - Row 4: Nightly rate in bold `#222222` followed by "night" in regular `#717171`.

### Buttons & Interactive Controls
- **Primary Pill:** `#FF385C` background, `#FFFFFF` label, bold weight, `height: 48px`, horizontal padding `24px`. Hover transitions smoothly to `#E00B41`.
- **Secondary Ghost:** Transparent surface with 1px `#222222` outline, `#222222` text, hover fills with `#F7F7F7`.
- **Icon Utility Buttons:** Circular `32px` or `40px` dimensions, 1px border `#DDDDDD`, transparent background, resting on `#FFFFFF`.