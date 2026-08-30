# Booth-tablet screenshots (module `stream-audio`)

The "Audio on the Stream" module teaches the tablet from redrawn, annotated
diagrams (`stream-tablet-home` and `stream-mixing-station` in
`components/StreamingVisual.tsx`) so the labels stay readable on a phone and in
dark mode.

If you also want the raw screen grabs from the tablet shown under the lessons,
drop them in here with these names:

| File | What it should show |
| --- | --- |
| `01-tablet-home.png` | The tablet home screen with the Mixing Station icon |
| `02-mixing-station-streaming.png` | Mixing Station on the **Streaming** custom layout |

Then uncomment the `"stream-audio"` entry in
[`lib/streaming-shots.ts`](../../../lib/streaming-shots.ts). They render under
the lessons in the same slide viewer the Safety track uses — prev/next, a
thumbnail strip, and click to enlarge.

Re-capture them (and redraw the diagrams) whenever the custom layout changes.
