# Product photos

Drop the real product photos here and they appear automatically in the
"Our gear" gallery (on the Modules page and in the Welcome module). Use these
exact filenames:

| File           | Product                              | Status            |
| -------------- | ------------------------------------ | ----------------- |
| `sq-6.jpg`     | Allen & Heath SQ-6 console           | needed            |
| `me-500.png`   | Allen & Heath ME-500 personal mixer  | ✅ included        |
| `ar2412.jpg`   | Allen & Heath AR2412 stage box       | needed            |

The ME-500 image was taken from the official Allen & Heath ME-500 User Guide
(AP11137). For the SQ-6 and AR2412, drop a photo in with the filename above.

Any web image format works (`.jpg`, `.png`, `.webp`); if you use a different
extension, update the matching `img` path in `components/GearGallery.tsx`.
A roughly 4:3 landscape image looks best. Until a file is present, the card
shows a labelled placeholder instead of a broken image.
