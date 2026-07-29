from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[2]
CH8_PATH = ROOT / "src/chapter-08.md"
CH9_PATH = ROOT / "src/chapter-09.md"
CH10_PATH = ROOT / "src/chapter-10.md"
STORIES_PATH = ROOT / "docs/stories.md"


def replace_once(text: str, old: str, new: str, label: str) -> str:
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"{label}: expected one replacement target, found {count}")
    return text.replace(old, new, 1)


def display_equations(text: str) -> list[str]:
    return re.findall(r"\$\$[\s\S]*?\$\$", text)


def image_targets(text: str) -> list[str]:
    return re.findall(r"!\[[^\]]*\]\(([^)]+)\)", text)


before = {
    8: CH8_PATH.read_text(encoding="utf-8"),
    9: CH9_PATH.read_text(encoding="utf-8"),
    10: CH10_PATH.read_text(encoding="utf-8"),
}
after = dict(before)

old_ch8 = """# Coming next: stack the blocks and predict a token

We have completed one Transformer block, but an LLM normally contains many such blocks.

The next stage of the book can follow:

- how hidden states evolve through a stack of layers;
- how the final position is converted into vocabulary logits;
- how softmax creates next-token probabilities;
- how greedy decoding, sampling, temperature, top-k, and top-p choose the next token.

The reader now has all the machinery needed to connect attention mechanics to actual text generation.
"""
new_ch8 = """# Coming next: open the position box, then climb the stack

We have completed the computation inside one simplified Transformer block. Throughout Chapters 1–8, however, the supplied $X$ was treated as already prepared for that block, with the target architecture's positional treatment accounted for.

The next chapter opens that earlier assumption and compares how architectures make order and relative distance available. This is a change in **teaching focus**, not a later step in the forward pass: positional treatment belongs before or inside attention, depending on the architecture.

Once that box is open, the book can follow the prepared hidden states through:

- repeated refinement across a stack of blocks;
- conversion of the final position into vocabulary logits;
- softmax and next-token probabilities;
- greedy decoding, sampling, temperature, top-k, and top-p.

> **First complete the block, then inspect how its input was prepared, then follow the residual stream through depth and prediction.**
"""
after[8] = replace_once(after[8], old_ch8, new_ch8, "Chapter 8 final handoff")

old_ch9 = """# Coming next: the residual stream climbs the stack

With the target architecture's positional treatment now explicit, the prepared token states can flow through the Transformer stack. One Transformer block produces another matrix with the same outer shape:

$$
X^{(1)}\in\mathbb{R}^{n\times d_{\text{model}}}
$$

That matrix enters another block, and then another:

$$
X^{(0)}
\rightarrow
X^{(1)}
\rightarrow
\cdots
\rightarrow
X^{(L)}
$$

Chapter 10 follows token representations through depth and shows why every layer owns its own attention, MLP, normalisation, and KV-cache state.
"""
new_ch9 = """# Coming next: carry the prepared state through depth

Chapter 1 introduced the minimum scaffold, Chapters 2–8 showed what one block does with a prepared input, and this chapter made the architecture-specific positional treatment explicit. The stack now has a well-defined starting state: $X^{(0)}$ is the prepared hidden-state matrix entering the first block.

The first block produces another matrix with the same outer shape:

$$
X^{(1)}\in\mathbb{R}^{n\times d_{\text{model}}}
$$

That output becomes the next block's input, and refinement continues:

$$
X^{(0)}
\rightarrow
X^{(1)}
\rightarrow
\cdots
\rightarrow
X^{(L)}
$$

Chapter 10 can therefore begin directly with depth: it follows the residual stream through the stack and shows why every layer owns its own attention, MLP, normalisation, and KV-cache state.
"""
after[9] = replace_once(after[9], old_ch9, new_ch9, "Chapter 9 stack handoff")

old_ch10_open = """# The question this chapter answers

Chapter 8 completed one simplified Transformer block.

For the three-token sequence, its output was:
"""
new_ch10_open = """# The question this chapter answers

Chapter 9 made the architecture's positional treatment explicit. We now take $X^{(0)}$ as the prepared, position-aware hidden-state matrix entering the stack and move directly to depth.

Chapter 8 calculated the output of the first simplified Transformer block. For the three-token sequence, that output was:
"""
after[10] = replace_once(after[10], old_ch10_open, new_ch10_open, "Chapter 10 opening continuity")

after[10] = replace_once(
    after[10],
    "# One block is one refinement step\n\nLet the initial representation entering the stack be:",
    "# One block is one refinement step\n\nUse the prepared starting state established in Chapter 9:",
    "Chapter 10 prepared-state handoff",
)

for number, path in [(8, CH8_PATH), (9, CH9_PATH), (10, CH10_PATH)]:
    if display_equations(before[number]) != display_equations(after[number]):
        raise SystemExit(f"Chapter {number}: display equations changed during continuity edit")
    if image_targets(before[number]) != image_targets(after[number]):
        raise SystemExit(f"Chapter {number}: image targets changed during continuity edit")
    if before[number].count("$$") != after[number].count("$$"):
        raise SystemExit(f"Chapter {number}: display-math delimiters changed")
    path.write_text(after[number], encoding="utf-8")

required = {
    8: [
        "open the position box, then climb the stack",
        "change in **teaching focus**, not a later step in the forward pass",
        "inspect how its input was prepared",
    ],
    9: [
        "carry the prepared state through depth",
        "$X^{(0)}$ is the prepared hidden-state matrix entering the first block",
        "begin directly with depth",
    ],
    10: [
        "We now take $X^{(0)}$ as the prepared, position-aware hidden-state matrix entering the stack",
        "Use the prepared starting state established in Chapter 9",
    ],
}
for number, phrases in required.items():
    for phrase in phrases:
        if phrase not in after[number]:
            raise SystemExit(f"Chapter {number}: missing continuity wording: {phrase}")

for forbidden in [
    "# Coming next: stack the blocks and predict a token",
    "Chapter 8 completed one simplified Transformer block.",
    "With the target architecture's positional treatment now explicit, the prepared token states can flow through the Transformer stack.",
]:
    if any(forbidden in after[number] for number in (8, 9, 10)):
        raise SystemExit(f"Old transition wording remains: {forbidden}")

chapter10_opening = after[10].split("# What is the residual stream?", 1)[0]
for repeated_detail in [
    "learned absolute positional embeddings",
    "sinusoidal position encodings",
    "relative-position biases",
    "rotary position embeddings",
    "RoPE",
]:
    if repeated_detail in chapter10_opening:
        raise SystemExit(f"Chapter 10 re-explains position instead of proceeding to depth: {repeated_detail}")

stories = STORIES_PATH.read_text(encoding="utf-8")
stories = replace_once(
    stories,
    "## COH-2.5 — Review the Chapter 8→9→10 continuity\n\n**Status:** Planned",
    "## COH-2.5 — Review the Chapter 8→9→10 continuity\n\n**Status:** Complete",
    "COH-2.5 story status",
)
STORIES_PATH.write_text(stories, encoding="utf-8")

print("COH-2.5 continuity validated across Chapters 8, 9, and 10.")
