/**
 * Booth screenshots for the Live Streaming modules.
 * ---------------------------------------------------------------------------
 * The walkthroughs teach from redrawn, annotated diagrams
 * (components/StreamingVisual.tsx) rather than raw screen grabs, because the
 * diagrams stay readable on a phone, work in dark mode, and can be labelled.
 *
 * If you also want the real screen grabs in a module — a photo of the booth
 * rig, a fresh capture after a layout change — drop the PNGs in
 * public/streaming-shots/<module-slug>/ and list them here in the order they
 * should appear. Whatever this map holds is attached to the matching module in
 * lib/streaming-curriculum.ts and rendered by the same SlideDeck the Safety
 * track uses (prev/next, thumbnails, click to enlarge).
 *
 * Example — a captured Ecamm window and Stream Deck profile:
 *
 *   "stream-ecamm-tour": [
 *     { src: "/streaming-shots/stream-ecamm-tour/01-main-window.png",
 *       alt: "The Ecamm Live main window with the WS + SLIDES scene live" },
 *   ],
 *   "stream-streamdeck": [
 *     { src: "/streaming-shots/stream-streamdeck/01-service-profile.png",
 *       alt: "The 15-key Stream Deck service profile" },
 *   ],
 *
 * Keys must match a module slug in lib/streaming-curriculum.ts; anything else
 * is ignored. Keep the images under a couple of MB each — they are served
 * straight out of /public.
 */

import type { ModuleSlide } from "./curriculum";

export const streamingShots: Record<string, ModuleSlide[]> = {};
