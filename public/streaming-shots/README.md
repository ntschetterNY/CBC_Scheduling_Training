# Booth screenshots for the Live Streaming track

The Live Streaming modules teach from annotated diagrams drawn in
`components/StreamingVisual.tsx`, so this folder starts empty.

To add real screen grabs to a module:

1. Make a folder here named after the module slug, e.g.
   `public/streaming-shots/stream-ecamm-tour/`.
2. Drop the PNGs in, named so they sort in the order you want them shown
   (`01-main-window.png`, `02-scenes-panel.png`, …).
3. List them in `lib/streaming-shots.ts` under the same slug.

They then render under the lessons in the same slide viewer the Safety track
uses — prev/next, a thumbnail strip, and click to enlarge.

Module slugs: `stream-overview`, `stream-ecamm-tour`, `stream-scenes`,
`stream-streamdeck`, `stream-cameras`, `stream-audio`, `stream-run-a-service`,
`stream-troubleshooting`.
