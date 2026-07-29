from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[2]

REPLACEMENTS = {
    "src/chapter-02.md": [
        (
            "We will use the same four-dimensional SAT state from Chapter 1:",
            "We will use the same four-dimensional current hidden state for SAT from Chapter 1:",
        ),
    ],
    "src/chapter-03.md": [
        (
            "We use the same four-dimensional SAT state:",
            "We use the same four-dimensional current hidden state for SAT:",
        ),
    ],
    "src/chapter-04.md": [
        (
            "The previous chapters created two learned views of every token state:",
            "The previous chapters created two learned views of every token's current hidden state:",
        ),
        (
            "Causal masking is based on position, not token identity.\n\nThe rule for row \(i\) and column \(j\) is:",
            "Causal masking is based on **row position in the sequence tensor**, not token identity.\n\n"
            "That row-order rule controls which earlier positions a Query may use. It is a visibility constraint, "
            "not a complete positional representation of absolute location or relative distance.\n\n"
            "The rule for row \(i\) and column \(j\) is:",
        ),
    ],
    "src/chapter-05.md": [
        (
            "We continue with the hidden-state matrix used throughout the book:",
            "We continue with the current hidden-state matrix entering this attention block:",
        ),
    ],
    "src/chapter-06.md": [
        (
            "Imagine that two specialists inspect the same three token states.",
            "Imagine that two specialists inspect the same three current hidden states.",
        ),
        (
            "Both specialists receive the same input matrix:",
            "Both specialists receive the same current hidden-state matrix:",
        ),
        (
            "The same four-dimensional token state is therefore projected into a different two-dimensional space for this head.",
            "The same four-dimensional current hidden state is therefore projected into a different two-dimensional space for this head.",
        ),
    ],
    "src/chapter-07.md": [
        (
            "![The Team Lead receives concatenated specialist reports while the original token states continue along a residual highway toward separate normalisation booths.]",
            "![The Team Lead receives concatenated specialist reports while the incoming token states continue along a residual highway toward separate normalisation booths.]",
        ),
        (
            "![The output-projection update joins the original token state on a residual highway before the token proceeds to normalisation.]",
            "![The output-projection update joins the incoming token state on a residual highway before the token proceeds to normalisation.]",
        ),
        (
            "The original input is:",
            "The incoming hidden-state matrix is:",
        ),
        (
            "If the attention update is small, much of the original representation remains available.",
            "If the attention update is small, much of the incoming representation remains available.",
        ),
        (
            "| original case file | input representation $x$ |",
            "| incoming case file | input representation $x$ |",
        ),
        (
            "The residual highway keeps the original case file available, and normalisation keeps the updated file numerically manageable.",
            "The residual highway keeps the incoming case file available, and normalisation keeps the updated file numerically manageable.",
        ),
    ],
    "src/chapter-08.md": [
        (
            "# The position-wise MLP\n\nFor one token row \(n_t\), a simple two-layer feed-forward network is:",
            "# The position-wise MLP\n\n"
            "Here, **position-wise** means that the same MLP is applied independently to each token row. "
            "It does not mean that the MLP supplies positional information or replaces the architecture's positional mechanism.\n\n"
            "For one token row \(n_t\), a simple two-layer feed-forward network is:",
        ),
    ],
}


def replace_once(text: str, old: str, new: str, path: str) -> str:
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"{path}: expected one replacement target, found {count}: {old[:90]!r}")
    return text.replace(old, new, 1)


def equation_blocks(text: str) -> list[str]:
    return re.findall(r"\$\$[\s\S]*?\$\$", text)


def image_targets(text: str) -> list[str]:
    return re.findall(r"!\[[^\]]*\]\(([^)]+)\)", text)


def numeric_tokens(text: str) -> list[str]:
    return re.findall(r"(?<![A-Za-z_])[-+]?\d+(?:\.\d+)?(?![A-Za-z_])", text)


for relative_path, replacements in REPLACEMENTS.items():
    path = ROOT / relative_path
    before = path.read_text(encoding="utf-8")
    after = before
    for old, new in replacements:
        after = replace_once(after, old, new, relative_path)

    if equation_blocks(before) != equation_blocks(after):
        raise SystemExit(f"{relative_path}: display equations changed during terminology sweep")
    if image_targets(before) != image_targets(after):
        raise SystemExit(f"{relative_path}: image targets changed during terminology sweep")
    if numeric_tokens(before) != numeric_tokens(after):
        raise SystemExit(f"{relative_path}: numerical tokens changed during terminology sweep")
    if before.count("$$") != after.count("$$"):
        raise SystemExit(f"{relative_path}: display-math delimiters changed")

    path.write_text(after, encoding="utf-8")

chapters = {
    number: (ROOT / f"src/chapter-{number:02d}.md").read_text(encoding="utf-8")
    for number in range(2, 9)
}

required_phrases = {
    2: "current hidden state for SAT from Chapter 1",
    3: "current hidden state for SAT",
    4: "visibility constraint, not a complete positional representation",
    5: "current hidden-state matrix entering this attention block",
    6: "same current hidden-state matrix",
    7: "incoming hidden-state matrix",
    8: "does not mean that the MLP supplies positional information",
}
for number, phrase in required_phrases.items():
    if phrase not in chapters[number]:
        raise SystemExit(f"Chapter {number}: missing required terminology: {phrase}")

for number, text in chapters.items():
    if re.search(r"\bX\b[^\n]{0,80}\b(?:bare|raw|just) token embeddings?\b", text, re.IGNORECASE):
        raise SystemExit(f"Chapter {number}: X is still described as bare token embeddings")

if "Causal masking is based on position, not token identity." in chapters[4]:
    raise SystemExit("Chapter 4: ambiguous causal-mask wording remains")
if "same three token states" in chapters[6] or "same input matrix:" in chapters[6]:
    raise SystemExit("Chapter 6: ambiguous input-state wording remains")
if "The original input is:" in chapters[7]:
    raise SystemExit("Chapter 7: ambiguous original-input wording remains")

stories_path = ROOT / "docs/stories.md"
stories = stories_path.read_text(encoding="utf-8")
old_status = "## COH-2.2 — Standardise positional wording across Chapters 2–8\n\n**Status:** Planned"
new_status = "## COH-2.2 — Standardise positional wording across Chapters 2–8\n\n**Status:** Complete"
stories = replace_once(stories, old_status, new_status, "docs/stories.md")
stories_path.write_text(stories, encoding="utf-8")

print("COH-2.2 terminology sweep applied and validated across Chapters 2–8.")
