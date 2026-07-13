## Change

Move the phone image from `absolute right-0` (edge of viewport) to sit directly next to the centered hero content block.

### Implementation

In `src/pages/Check24.tsx`:

1. Remove the phone image from its current absolute position outside the content container (line ~229-235).
2. Change the hero layout: wrap the text content and phone image in a `flex` row inside the existing `max-w-3xl` container.
   - Left/center: existing text content (keeps `text-center`).
   - Right: phone image, relatively positioned, vertically centered.
3. On smaller screens (`< lg`), the phone stays hidden as before.

This places the phone directly adjacent to the countdown/text instead of pinned to the viewport edge.
