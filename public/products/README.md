# Product photos

Drop the real product photos here and they appear automatically in the
"Our gear" gallery (on the Modules page and in the Welcome module). Use these
exact filenames:

| File          | Product                              |
| ------------- | ------------------------------------ |
| `sq-6.jpg`    | Allen & Heath SQ-6 console           |
| `me-500.jpg`  | Allen & Heath ME-500 personal mixer  |
| `ar2412.jpg`  | Allen & Heath AR2412 stage box       |

Any web image format works (`.jpg`, `.png`, `.webp`); if you use a different
extension, update the matching `img` path in `components/GearGallery.tsx`.
A roughly 4:3 landscape image looks best. Until a file is present, the card
shows a labelled placeholder instead of a broken image.
