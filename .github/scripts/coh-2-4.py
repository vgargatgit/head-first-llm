from pathlib import Path
import re
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[2]
CHAPTER_PATH = ROOT / "src/chapter-01.md"
MASTER_PLAN_PATH = ROOT / "docs/inference-loop-scene-master-plan.md"
STORIES_PATH = ROOT / "docs/stories.md"
SCENE_PLAN_PATH = ROOT / "docs/chapter-01/position-bridge-scene-plan.md"
ASSET_PATH = ROOT / "assets/chapter-01/05_position_bridge.svg"


def replace_once(text: str, old: str, new: str, label: str) -> str:
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"{label}: expected one replacement target, found {count}")
    return text.replace(old, new, 1)


def display_equations(text: str) -> list[str]:
    return re.findall(r"\$\$[\s\S]*?\$\$", text)


if not SCENE_PLAN_PATH.exists():
    raise SystemExit("Approved Chapter 1 position-bridge scene plan is missing")
if "**Status:** Approved for production" not in SCENE_PLAN_PATH.read_text(encoding="utf-8"):
    raise SystemExit("Position-bridge scene plan is not approved for production")
if not ASSET_PATH.exists():
    raise SystemExit("Position-bridge SVG asset is missing")

try:
    root = ET.parse(ASSET_PATH).getroot()
except ET.ParseError as exc:
    raise SystemExit(f"Position-bridge SVG is not valid XML: {exc}") from exc

if root.tag.split("}")[-1] != "svg":
    raise SystemExit("Position-bridge asset root element is not SVG")
asset_text = ASSET_PATH.read_text(encoding="utf-8")
for phrase in [
    "THE POSITION BRIDGE",
    "TOKEN IDENTITY",
    "POSITION REGISTRAR",
    "INITIAL STATE",
    "X⁽⁰⁾ = E + P",
    "Some architectures inject position differently",
]:
    if phrase not in asset_text:
        raise SystemExit(f"Position-bridge asset is missing required visual text: {phrase}")
if "<title" not in asset_text or "<desc" not in asset_text:
    raise SystemExit("Position-bridge SVG needs embedded title and description metadata")

chapter_before = CHAPTER_PATH.read_text(encoding="utf-8")
chapter_after = chapter_before
anchor = (
    "The tensor still preserves row alignment: row 2 belongs to `CAT`. That is bookkeeping. "
    "The learned projections receive the row's numerical values; they do not automatically receive a rich semantic feature saying “I am position 2.” "
    "A positional mechanism must make location or relative distance available to the computation."
)
illustration = (
    anchor
    + "\n\n"
    + "![SAT carries a token-embedding card labelled E while a Position Registrar supplies an address card labelled P; the two contributions form an initial hidden-state passport X zero that enters the first attention block](../assets/chapter-01/05_position_bridge.svg)"
)
chapter_after = replace_once(chapter_after, anchor, illustration, "Chapter 1 position-bridge placement")

if display_equations(chapter_before) != display_equations(chapter_after):
    raise SystemExit("Chapter 1 display equations changed while integrating the illustration")
if chapter_before.count("../assets/chapter-01/05_position_bridge.svg") != 0:
    raise SystemExit("Chapter 1 already referenced the position-bridge asset")
if chapter_after.count("../assets/chapter-01/05_position_bridge.svg") != 1:
    raise SystemExit("Chapter 1 must reference the position-bridge asset exactly once")
CHAPTER_PATH.write_text(chapter_after, encoding="utf-8")

master_before = MASTER_PLAN_PATH.read_text(encoding="utf-8")
master_after = master_before
old_purpose = (
    "Distinguish the original embedding from the current hidden state at a later layer. "
    "The existing passport also supplies the minimum position bridge: identity and positional treatment are present at the model entrance, while Chapter 9 opens the architecture-specific mechanisms in detail. "
    "This prose update does not add or prescribe a new illustration; the dedicated position-bridge artwork remains a separate visual-production story."
)
new_purpose_and_scene = """Distinguish the original embedding from the current hidden state at a later layer. The passport introduces identity and position at the model entrance; the dedicated position bridge below now makes the additive teaching model explicit while Chapter 9 opens the architecture-specific mechanisms in detail.

### Scene 4 — The position bridge

Current asset:

```text
assets/chapter-01/05_position_bridge.svg
```

Approved scene plan:

```text
docs/chapter-01/position-bridge-scene-plan.md
```

Implemented composition:

- SAT carries a token-embedding card labelled `E`;
- the Position Registrar supplies an address card labelled `P₃`;
- the two contributions appear in one initial-state passport labelled `X⁽⁰⁾`;
- the prepared passport points into the first attention block;
- the bottom banner states that `X⁽⁰⁾ = E + P` is one common additive teaching model;
- the architecture note points readers to Chapter 9 for non-additive approaches.

Purpose:

Provide a compact, mobile-readable visual anchor for the Chapter 1 positional scaffold without teaching the detailed formulas or implying that every architecture adds a positional vector.

Technical guardrail:

The token character is the token occurrence. `E`, `P`, and `X⁽⁰⁾` are cards representing numerical contributions or states. The `P₃` card is supplied by the architecture; it must not suggest that projection matrices automatically interpret the tensor row number as a semantic position feature.

Approved alt text:

> SAT carries a token-embedding card labelled E. A Position Registrar supplies an address card labelled P. The two contributions form an initial hidden-state passport labelled X zero, which enters the first attention block. A note says that this additive view is one teaching model and that other architectures inject position differently.
"""
master_after = replace_once(master_after, old_purpose, new_purpose_and_scene, "Chapter 1 scene inventory")
master_after = replace_once(
    master_after,
    "### Scene 4 — Before and after attention",
    "### Scene 5 — Before and after attention",
    "Renumber Chapter 1 before-and-after scene",
)

for phrase in [
    "### Scene 4 — The position bridge",
    "assets/chapter-01/05_position_bridge.svg",
    "docs/chapter-01/position-bridge-scene-plan.md",
    "The token character is the token occurrence.",
    "must not suggest that projection matrices automatically interpret the tensor row number",
    "### Scene 5 — Before and after attention",
]:
    if phrase not in master_after:
        raise SystemExit(f"Inference master plan is missing required COH-2.4 content: {phrase}")
MASTER_PLAN_PATH.write_text(master_after, encoding="utf-8")

stories = STORIES_PATH.read_text(encoding="utf-8")
stories = replace_once(
    stories,
    "## COH-2.4 — Plan and integrate a position bridge illustration\n\n**Status:** Planned",
    "## COH-2.4 — Plan and integrate a position bridge illustration\n\n**Status:** Complete",
    "COH-2.4 story status",
)
STORIES_PATH.write_text(stories, encoding="utf-8")

print("COH-2.4 position bridge planned, integrated and validated.")
