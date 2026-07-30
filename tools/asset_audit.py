#!/usr/bin/env python3
"""Resolve manuscript image paths the same way as the website reader and verify assets."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "src"
AUDIT = ROOT / "audit"
AUDIT.mkdir(exist_ok=True)

CONFIG = {
    1: {
        "from": ["chapter_1_graphics/", "chapter-1-graphics/", "../assets/chapter-01/", "/assets/chapter-01/"],
        "to": "assets/chapter-01/",
        "aliases": {},
    },
    2: {
        "from": ["chapter_2_graphics/", "chapter-2-graphics/", "../assets/chapter-02/", "/assets/chapter-02/"],
        "to": "assets/chapter-02/",
        "aliases": {
            "assets/chapter-02/02_question_coach_story.png": "assets/chapter-02/02_question_coach_pipeline.png",
            "assets/chapter-02/04_shared_coach.png": "assets/chapter-02/04_shared_question_coach.png",
            "assets/chapter-02/06_handoff_to_keys.png": "assets/chapter-02/07_handoff_to_keys.png",
        },
    },
    3: {
        "from": ["chapter_3_graphics/", "chapter-3-graphics/", "../assets/chapter-03/", "/assets/chapter-03/"],
        "to": "assets/chapter-03/",
        "aliases": {},
    },
    4: {"from": ["../assets/chapter-04/", "/assets/chapter-04/"], "to": "assets/chapter-04/", "aliases": {}},
    5: {"from": ["../assets/chapter-05/", "/assets/chapter-05/"], "to": "assets/chapter-05/", "aliases": {}},
    6: {"from": ["../assets/chapter-06/", "/assets/chapter-06/"], "to": "assets/chapter-06/", "aliases": {}},
    7: {"from": ["../assets/chapter-07/", "/assets/chapter-07/"], "to": "assets/chapter-07/", "aliases": {}},
    18: {"from": ["../assets/chapter-18/", "/assets/chapter-18/"], "to": "assets/chapter-18/", "aliases": {}},
}


def resolve(chapter: int, target: str) -> str:
    clean = target.split("?", 1)[0].split("#", 1)[0]
    cfg = CONFIG.get(chapter, {"from": [], "to": "", "aliases": {}})
    result = clean
    for prefix in cfg["from"]:
        result = result.replace(prefix, cfg["to"])
    result = cfg["aliases"].get(result, result)
    return result

rows = []
for path in sorted(SRC.glob("chapter-*.md"), key=lambda p: int(p.stem.split("-")[-1])):
    chapter = int(path.stem.split("-")[-1])
    text = path.read_text(encoding="utf-8")
    for alt, target in re.findall(r"!\[([^\]]*)\]\(([^)]+)\)", text):
        if re.match(r"^[a-z]+://", target):
            rows.append((chapter, target, target, True, "external"))
            continue
        resolved = resolve(chapter, target)
        exists = (ROOT / resolved).is_file()
        rows.append((chapter, target, resolved, exists, alt or "(no alt text)"))

out = ["# Reader-resolved asset audit\n\n"]
if not rows:
    out.append("No Markdown image references were found.\n")
else:
    missing = sum(1 for row in rows if not row[3])
    out.append(f"Checked **{len(rows)}** image references after applying the current website reader's prefix rewrites and aliases. **{missing}** resolve to files that are absent from the repository checkout.\n\n")
    out.append("| Chapter | Source target | Reader-resolved path | Exists? | Alt text |\n")
    out.append("|---:|---|---|:---:|---|\n")
    for chapter, source, resolved, exists, alt in rows:
        escaped_alt = alt.replace("|", "\\|")
        out.append(f"| {chapter} | `{source}` | `{resolved}` | {'Yes' if exists else '**No**'} | {escaped_alt} |\n")

(AUDIT / "asset-audit.md").write_text("".join(out), encoding="utf-8")
print(f"Checked {len(rows)} image references")
