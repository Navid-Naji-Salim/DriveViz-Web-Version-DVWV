# Design System Strategy: The Kinetic Precision

## 1. Overview & Creative North Star
This design system is built upon the Creative North Star of **"Kinetic Precision."** In the luxury automotive sector, the interface should never feel like a static website; it must feel like a high-performance instrument cluster. We are moving away from "standard" web layouts to an **Editorial Engineering** aesthetic—a blend of high-end automotive journalism and precision technical schematics.

The system breaks the "template" look through intentional asymmetry. We utilize large-scale typography that occasionally bleeds off the grid, overlapping translucent layers that mimic the depth of automotive paint, and a focus on "White Space as Luxury." By prioritizing tonal depth over structural lines, we create an environment that feels as reliable as a Toyota chassis and as premium as a flagship Lexus interior.

---

## 2. Colors
Our palette is a study in monochromatic sophistication, punctuated by the mechanical intensity of Toyota’s signature red.

### Color Tokens
*   **Primary (Action):** `#bd0014` (Toyota Red). Use for high-intent conversion points.
*   **Primary Container:** `#eb0a1e`. Use for hover states or large-scale brand accents.
*   **Surface Hierarchy:** 
    *   `surface`: `#f9f9f9` (The canvas)
    *   `surface_container_low`: `#f3f3f3`
    *   `surface_container_high`: `#e8e8e8`
*   **Structural Neutrals:** `on_surface` (`#1a1c1c`) for text; `secondary` (`#5f5e5e`) for technical metadata.

### The "No-Line" Rule
To achieve a high-end editorial feel, **1px solid borders are strictly prohibited for sectioning.** Boundaries must be defined solely through background color shifts. For example, a configuration panel should not have a border; instead, use a `surface_container_low` background sitting against a `surface` canvas.

### The "Glass & Gradient" Rule
Flatness is the enemy of premium design. 
*   **Floating UI:** Floating configurator menus must use Glassmorphism. Use the `surface` color at 80% opacity with a `20px` backdrop-blur. 
*   **Visual Soul:** Main CTAs (e.g., "Reserve Now") should utilize a subtle linear gradient from `primary` (#bd0014) to `primary_container` (#eb0a1e) at a 135-degree angle. This adds a "metallic luster" reminiscent of automotive finish.

---

## 3. Typography
We utilize **Inter** as our typographic engine. It is a clean, modern sans-serif that mirrors the legibility of a digital speedometer.

*   **The Hero Statement (Display-LG):** Use for car model names (e.g., "CROWN"). Set to `3.5rem` with tight letter-spacing (-0.02em). This is your editorial anchor.
*   **The Technical Label (Label-MD):** Use for specs (e.g., "2.5L HYBRID"). Set to `0.75rem` in All-Caps with wide letter-spacing (+0.1em) for a high-tech, precision feel.
*   **The Narrative (Body-LG):** Use for vehicle descriptions. The `1rem` size ensures readability while maintaining a sophisticated air.

**Hierarchy Strategy:** Use `display-md` for price points to give them an authoritative, "fixed" presence on the screen.

---

## 4. Elevation & Depth
In this system, depth is a result of **Tonal Layering**, not structural boxes.

*   **The Layering Principle:** Treat the UI as stacked sheets of fine material. Place a `surface_container_lowest` card (Pure White) on a `surface_container_low` (#f3f3f3) section to create a soft, natural lift.
*   **Ambient Shadows:** Avoid "drop shadows." If an element must float (like a configuration tooltip), use a `24px` blur with 4% opacity of the `on_surface` color. It should feel like an ambient occlusion shadow found in high-end 3D rendering.
*   **The "Ghost Border" Fallback:** If a divider is mandatory for accessibility, use the `outline_variant` (#e9bcb7) at **15% opacity**. It should be felt, not seen.
*   **Surface Nesting:** Deep configuration options should be "nested." An inner selection chip should be `surface_container_highest` (#e2e2e2) when placed inside a `surface_container` (#eeeeee) panel.

---

## 5. Components

### Configurator Buttons
*   **Primary:** Gradient fill (`primary` to `primary_container`), `0.25rem` (sm) roundedness. Use white text.
*   **Secondary:** `surface_container_highest` background with `on_surface` text. No border.
*   **Tertiary:** Ghost style. No background, `on_surface` text, becomes `surface_container_low` on hover.

### Configuration Chips (Color & Trim)
*   Forbid standard rounded pills. Use **Square-ish** chips with the `sm` (`0.125rem`) roundedness scale for a more industrial, automotive-part feel.
*   Active state: A `2px` offset "Ghost Border" using the `primary` red token.

### Input Fields
*   Do not use boxed inputs. Use a "Minimalist Undersline" approach or a `surface_container_low` solid fill with no border. 
*   Error states: Use the `error` (#ba1a1a) token for the label and a subtle `error_container` glow behind the input.

### Feature Cards & Lists
*   **No Dividers:** Separate list items (like engine specs) using `1.5rem` of vertical white space or alternating `surface` and `surface_container_low` backgrounds.
*   **The "Spec" Grid:** Use an asymmetrical 60/40 split. 60% for the high-fidelity car render, 40% for the configuration controls, layered over a `surface_bright` background.

---

## 6. Do's and Don'ts

### Do
*   **DO** use "Negative Space" as a functional element. Let the car render breathe.
*   **DO** use `display-lg` typography that overlaps the car imagery slightly (using high-contrast colors) to create a 3D sense of space.
*   **DO** use the `full` roundedness scale (9999px) *only* for small interactive toggles or badges, keeping structural elements at `sm` or `none`.

### Don't
*   **DON'T** use 100% black (#000000). Always use `on_surface` (#1a1c1c) for a softer, more premium "ink" look.
*   **DON'T** use standard Material Design "elevated" cards with heavy shadows. This breaks the automotive precision of the system.
*   **DON'T** use "Toyota Red" for non-interactive elements. It is a functional color; using it for decoration dilutes its power as a call-to-action.