# Product photos

Drop the real product photos here and they appear automatically in the
"Our gear" gallery (on the Modules page and in the Welcome module). Use these
exact filenames:

| File           | Product                              | Status            |
| -------------- | ------------------------------------ | ----------------- |
| `sq-6.png`     | Allen & Heath SQ-6 console           | ✅ included        |
| `me-500.png`   | Allen & Heath ME-500 personal mixer  | ✅ included        |
| `ar2412.jpg`   | Allen & Heath AR2412 stage box       | ✅ included        |

All three product images come from official Allen & Heath materials (the
SQ-6 marketing photo, the ME-500 User Guide AP11137, and the AR2412 Getting
Started Guide). To swap any of them, replace the file with the same name.

Any web image format works (`.jpg`, `.png`, `.webp`); if you use a different
extension, update the matching `img` path in `components/GearGallery.tsx`.
A roughly 4:3 landscape image looks best. Until a file is present, the card
shows a labelled placeholder instead of a broken image.
