---
name: RailVista Design System
colors:
  surface: '#fcf9f8'
  surface-dim: '#dcd9d9'
  surface-bright: '#fcf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f2'
  surface-container: '#f0eded'
  surface-container-high: '#eae7e7'
  surface-container-highest: '#e5e2e1'
  on-surface: '#1c1b1b'
  on-surface-variant: '#444653'
  inverse-surface: '#313030'
  inverse-on-surface: '#f3f0ef'
  outline: '#747684'
  outline-variant: '#c4c5d5'
  surface-tint: '#3557bc'
  primary: '#002068'
  on-primary: '#ffffff'
  primary-container: '#003399'
  on-primary-container: '#8aa4ff'
  inverse-primary: '#b5c4ff'
  secondary: '#0058bc'
  on-secondary: '#ffffff'
  secondary-container: '#1070e8'
  on-secondary-container: '#fefcff'
  tertiary: '#002e1c'
  on-tertiary: '#ffffff'
  tertiary-container: '#00472d'
  on-tertiary-container: '#00c081'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dce1ff'
  primary-fixed-dim: '#b5c4ff'
  on-primary-fixed: '#00164e'
  on-primary-fixed-variant: '#153ea3'
  secondary-fixed: '#d8e2ff'
  secondary-fixed-dim: '#adc6ff'
  on-secondary-fixed: '#001a41'
  on-secondary-fixed-variant: '#004494'
  tertiary-fixed: '#55feb5'
  tertiary-fixed-dim: '#2ae19b'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005234'
  background: '#fcf9f8'
  on-background: '#1c1b1b'
  surface-variant: '#e5e2e1'
  status-warning: '#FEBB02'
  surface-muted: '#F5F7FA'
  border-light: '#E2E8F0'
typography:
  display-lg:
    fontFamily: Hanken Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  title-md:
    fontFamily: Hanken Grotesk
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Hanken Grotesk
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 64px
  container-max: 1280px
---

## Brand & Style

This design system is engineered for a premium travel-tech startup, aiming to revolutionize the rail booking experience. The brand personality is **dependable yet forward-thinking**, moving away from legacy administrative aesthetics toward a high-performance, user-centric interface.

The design style is **Minimalist with High-Contrast Interactive Elements**. It leverages a "startup-grade" aesthetic characterized by:
- **Clarity & Trust:** A focus on legibility and systematic information density to reduce cognitive load during complex booking flows.
- **Premium Utility:** Utilizing generous whitespace and high-quality typography to evoke the feeling of a modern airline or luxury travel app.
- **Dynamic Energy:** Subtle use of motion and vibrant primary accents to represent progress and movement.

## Colors

The palette is anchored in a professional **Midnight Blue** (#003399), referencing the heritage of Indian Railways but refined for a digital-first audience. 

- **Primary & Secondary:** These blues are used for core branding, navigation, and primary calls to action.
- **Tertiary:** A vibrant Mint Green (derived from the logo) is used sparingly for success states, confirmations, and "live" status indicators.
- **Neutral:** We utilize a deep Charcoal for text and a range of cool grays for borders and backgrounds to maintain a crisp, airy environment. 
- **Accent:** A warm gold is reserved for utility warnings or highlighting "Best Value" train options, mirroring premium travel patterns.

## Typography

This design system uses **Hanken Grotesk** for its exceptional clarity and modern, geometric profile. It provides a balance between technical precision and approachable softness.

- **Headlines:** Use Bold and Semi-Bold weights with tighter letter-spacing for a commanding, premium look.
- **Body:** Standardized at 16px for optimal readability across demographics. 
- **Labels:** Small labels use a slightly heavier weight and increased tracking to ensure legibility when displaying ticket details or station codes.
- **Numeric Data:** Ensure "tabular lining" figures are used for arrival/departure times to allow for easy vertical scanning in search results.

## Layout & Spacing

The layout philosophy follows a **Fluid Grid with Fixed Constraints**. This ensures the interface feels expansive on desktop while remaining focused on mobile.

- **Desktop:** A 12-column grid with 24px gutters. Content is centered within a 1280px container to maintain a premium, editorial feel.
- **Mobile:** A 4-column grid with 16px margins. 
- **Rhythm:** An 8px linear scale (using a 4px base unit) governs all padding and margins. Generous vertical spacing is prioritized between sections to avoid the cluttered feel of traditional booking portals.

## Elevation & Depth

To create a "Vista" feel, the system uses **Tonal Layering combined with Ambient Shadows**.

- **Surfaces:** The base layer is pure white (#FFFFFF). Secondary content containers use a subtle off-white or very light gray (#F5F7FA) to create soft separation without the need for heavy borders.
- **Shadows:** We use multi-layered, low-opacity shadows. Shadows should feel like ambient light, using a tint of the Primary Blue (e.g., `rgba(0, 51, 153, 0.08)`) rather than pure black.
- **Interaction:** Upon hover, interactive cards should slightly "lift" (decrease shadow blur, increase offset) to provide tactile feedback.

## Shapes

The shape language is **Soft-Rounded**, aiming for an approachable and modern tech aesthetic. 

- **Containers & Cards:** Use a consistent 16px (`rounded-xl`) radius to soften the high-density data typical of rail schedules.
- **Buttons & Inputs:** Use an 8px (`rounded-lg`) radius for a more structured, functional appearance.
- **Search Bars:** The primary search bar on landing pages may use a **Pill-shape** to emphasize it as the primary entry point.

## Components

### Buttons
- **Primary:** Solid Primary Blue background with white text. High contrast is mandatory. 
- **Secondary:** Outlined with a 1.5px stroke in Primary Blue.
- **States:** Hover states should involve a slight darkening of the fill; active states should show a subtle inward scale (98%).

### Elevated Cards
Booking results and featured destinations use cards with a 16px radius and ambient blue-tinted shadows. Internal padding should be a minimum of 24px to ensure content does not feel cramped.

### Modern Input Fields
Inputs use a "floating label" or "clear top label" approach. The border-bottom is emphasized with a thicker 2px stroke when focused using the Secondary Blue. Backgrounds are kept white or very light gray to ensure accessibility.

### Train Status Chips
Small, high-contrast badges for "On Time," "Delayed," or "Platform Changed." These use the Tertiary Green or Status Warning Yellow with a high-saturation background and darkened text for maximum visibility.

### Search Bar
The primary search component should be elevated and oversized, often spanning the full width of the container on mobile, with distinct sections for "Origin," "Destination," and "Date."