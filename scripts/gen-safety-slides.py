#!/usr/bin/env python3
"""
Copy the Safety & Security slide PNGs into public/safety-slides/<slug>/ in the
correct in-lesson order, and emit lib/safety-slides.ts mapping each module slug
to its ordered list of { src, alt } slides.

Slide ordering within a lesson:
  - a base slide "Lesson N ..." (no letter/number suffix) comes first
  - letter-suffixed slides "Lesson NA", "NB", ... order by letter (A=1, B=2, ...)
  - number-suffixed slides "Lesson N-1", "N-2", ... order by the number
  - a stray "The Bottom Line" with no index sorts last
"""

import os
import re
import shutil

REPO = "/Users/ntschetter/clients/CBC/CBC_Scheduling_Training"
SRC_ROOT = os.path.join(REPO, "Safety & Security Source Material")
PUBLIC_DEST = os.path.join(REPO, "public", "safety-slides")
MANIFEST = os.path.join(REPO, "lib", "safety-slides.ts")

# module order (== lesson number) -> module slug, from safety-curriculum.ts
ORDER_TO_SLUG = {
    1: "sec-team-framework",
    2: "sec-pre-service",
    3: "sec-changes-escalate",
    4: "sec-reports-comms",
    5: "sec-access-control",
    6: "sec-movement",
    7: "sec-medical",
    8: "sec-fire-hazmat",
    9: "sec-weather-shelter",
    10: "sec-lockdown",
    11: "sec-disruptive",
    12: "sec-suspicious",
    13: "sec-missing-child",
    14: "sec-violent-intruder",
    15: "sec-recovery",
}


def sort_key(fname: str):
    """Return an integer sub-order for a slide filename within its lesson."""
    stem = fname[:-4]  # strip .png
    # number suffix: "Lesson 10-13 ...", "Lesson 3-1 - ..."
    m = re.search(r"Lesson\s*\d+-(\d+)", stem)
    if m:
        return int(m.group(1))
    # letter suffix: "Lesson 1A - ...", "Lesson 2M — ..." (A=1 ...)
    m = re.search(r"Lesson\s*\d+([A-Z])\b", stem)
    if m:
        return ord(m.group(1)) - ord("A") + 1
    # base slide: "Lesson 1 -Safety...", "Lesson 2 - Start Ready"
    if re.search(r"Lesson\s*\d+\s", stem):
        return 0
    # stray, e.g. "The Bottom Line" — sort last
    return 9999


def alt_text(fname: str) -> str:
    """Human-readable alt/caption derived from the filename."""
    stem = fname[:-4]
    # drop the leading "Lesson N", "Lesson NA", "Lesson N-M" label and separators
    t = re.sub(r"^\s*Lesson\s*\d+[A-Z]?(?:-\d+)?\s*[-—]?\s*", "", stem)
    t = t.strip(" -—")
    return t if t else stem.strip()


def slugify(text: str) -> str:
    text = text.lower()
    text = re.sub(r"[^a-z0-9]+", "-", text)
    return text.strip("-")


def find_lesson_dirs():
    """Map lesson number -> absolute lesson directory path."""
    out = {}
    for chapter in sorted(os.listdir(SRC_ROOT)):
        cdir = os.path.join(SRC_ROOT, chapter)
        if not os.path.isdir(cdir):
            continue
        for lesson in os.listdir(cdir):
            ldir = os.path.join(cdir, lesson)
            if not os.path.isdir(ldir):
                continue
            m = re.search(r"Lesson\s*(\d+)", lesson)
            if not m:
                continue
            out[int(m.group(1))] = ldir
    return out


def main():
    lesson_dirs = find_lesson_dirs()
    if os.path.isdir(PUBLIC_DEST):
        shutil.rmtree(PUBLIC_DEST)
    os.makedirs(PUBLIC_DEST)

    manifest = {}  # slug -> list[(src, alt)]
    total = 0

    for order in sorted(ORDER_TO_SLUG):
        slug = ORDER_TO_SLUG[order]
        ldir = lesson_dirs.get(order)
        if not ldir:
            print(f"!! no lesson dir for order {order} ({slug})")
            continue
        pngs = [f for f in os.listdir(ldir) if f.lower().endswith(".png")]
        pngs.sort(key=lambda f: (sort_key(f), f.lower()))

        dest_dir = os.path.join(PUBLIC_DEST, slug)
        os.makedirs(dest_dir, exist_ok=True)

        slides = []
        for i, fname in enumerate(pngs, start=1):
            alt = alt_text(fname)
            base = slugify(alt) or f"slide-{i}"
            out_name = f"{i:02d}-{base}.png"
            shutil.copy2(os.path.join(ldir, fname), os.path.join(dest_dir, out_name))
            slides.append((f"/safety-slides/{slug}/{out_name}", alt))
            total += 1
        manifest[slug] = slides
        print(f"{slug}: {len(slides)} slides")

    # ---- write the TS manifest ----
    def esc(s: str) -> str:
        return s.replace("\\", "\\\\").replace('"', '\\"')

    lines = []
    lines.append("/**")
    lines.append(" * Safety & Security lesson slide decks.")
    lines.append(" * ---------------------------------------------------------------------------")
    lines.append(" * AUTO-GENERATED from the church's Safety & Security slide PNGs (one folder per")
    lines.append(" * lesson). The images live in public/safety-slides/<slug>/ and are listed here")
    lines.append(" * in slide order. Regenerate with `python3 scripts/gen-safety-slides.py`")
    lines.append(" * rather than editing by hand.")
    lines.append(" *")
    lines.append(" * Each safety module's `slides` field is populated from this map in")
    lines.append(" * lib/safety-curriculum.ts, and ModuleRunner renders them via SlideDeck.")
    lines.append(" */")
    lines.append("")
    lines.append('import type { ModuleSlide } from "./curriculum";')
    lines.append("")
    lines.append("export const safetySlides: Record<string, ModuleSlide[]> = {")
    for order in sorted(ORDER_TO_SLUG):
        slug = ORDER_TO_SLUG[order]
        slides = manifest.get(slug, [])
        lines.append(f'  "{slug}": [')
        for src, alt in slides:
            lines.append(f'    {{ src: "{esc(src)}", alt: "{esc(alt)}" }},')
        lines.append("  ],")
    lines.append("};")
    lines.append("")

    with open(MANIFEST, "w") as f:
        f.write("\n".join(lines))

    print(f"\nTotal slides copied: {total}")
    print(f"Manifest written: {MANIFEST}")


if __name__ == "__main__":
    main()
