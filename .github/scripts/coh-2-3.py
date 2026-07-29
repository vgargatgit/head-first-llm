from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[2]
CHAPTER_PATH = ROOT / "src/chapter-09.md"
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


before = CHAPTER_PATH.read_text(encoding="utf-8")
after = before

after = replace_once(
    after,
    "The previous chapters began with a matrix of token states:",
    "Chapters 1–8 worked with a current hidden-state matrix that was already prepared for the attention block:",
    "Chapter 9 opening matrix description",
)

old_opening = """# A deliberate rewind

Chapter 8 completed one Transformer block. This chapter steps backward to expose an assumption already built into our running matrix.

Before the first block, a decoder-only Transformer begins with token IDs and creates token embeddings:

$$
E=
\begin{bmatrix}
e_1\\
e_2\\
\vdots\\
e_n
\end{bmatrix}
$$

It must then make position available somehow.

Common approaches include:

- learned absolute positional embeddings;
- fixed sinusoidal position encodings;
- relative-position biases;
- rotary position embeddings, usually called **RoPE**.

The mechanism is architecture-specific, but the requirement is universal: the model needs information that distinguishes one ordering from another.
"""

new_opening = """# Open the position box

Chapter 1 gave us a minimum scaffold: token IDs become token embeddings, and the architecture makes position available before or inside attention. Chapters 1–8 then treated the supplied $X$ as the current hidden-state matrix already prepared for the block, rather than pausing to unpack the position mechanism.

Now we can open that labelled box. The timing is **pedagogical, not computational**. Position was not added after the block completed in Chapter 8; it entered the computation wherever the target architecture defines it.

Why teach the details now? We already understand Queries, Keys, Query–Key scores, and causal masking. That makes the architectural differences precise:

- additive methods alter the initial hidden state;
- RoPE acts directly on Query and Key coordinate pairs;
- relative-position biases alter attention logits.

We can also keep three ideas separate:

- **row alignment** is tensor bookkeeping;
- **causal visibility** controls which positions a Query may use;
- a **positional mechanism** makes location or relative distance available to learned computation.

Before the first block, a decoder-only Transformer begins with token IDs and creates token embeddings:

$$
E=
\begin{bmatrix}
e_1\\
e_2\\
\vdots\\
e_n
\end{bmatrix}
$$

It must then make position available somehow.

Common approaches include:

- learned absolute positional embeddings;
- fixed sinusoidal position encodings;
- relative-position biases;
- rotary position embeddings, usually called **RoPE**.

This list is a menu of architecture choices, not a universal pipeline in which every method is applied. A target model may use one approach or a documented combination. The shared requirement is that the computation can distinguish one ordering from another.
"""

after = replace_once(after, old_opening, new_opening, "Chapter 9 position-box opening")

after = replace_once(
    after,
    "# Approach 1: learned absolute positional embeddings\n\nOne direct solution is to learn one vector for each supported position.",
    "# Approach 1: learned absolute positional embeddings\n\nStart with the additive model introduced as Chapter 1's compact teaching bridge. In this architecture family, a position vector has model width and is added to the token embedding. This is one positional design, not a mandatory step that must also occur before RoPE.\n\nOne direct solution is to learn one vector for each supported position.",
    "Transition into learned absolute positions",
)

after = replace_once(
    after,
    "# Recovering our running input matrix\n\nThe first eight chapters used:",
    "# Unpacking one additive version of our running matrix\n\nChapters 1–8 used the following $X^{(0)}$ as the prepared state entering the first block. They did not require us to decompose it. To make learned absolute positions concrete, suppose this particular toy matrix came from $E+P$. This is an illustrative reconstruction of the additive approach, not a claim that a RoPE-based architecture would also create $X^{(0)}$ by adding $P$.\n\nThe prepared matrix was:",
    "Running-matrix reconstruction framing",
)

after = replace_once(
    after,
    "# Coming next: the residual stream climbs the stack\n\nOne Transformer block produces another matrix with the same outer shape:",
    "# Coming next: the residual stream climbs the stack\n\nWith the target architecture's positional treatment now explicit, the prepared token states can flow through the Transformer stack. One Transformer block produces another matrix with the same outer shape:",
    "Chapter 9 final handoff",
)

if display_equations(before) != display_equations(after):
    raise SystemExit("Chapter 9 display equations changed during reframing")
if image_targets(before) != image_targets(after):
    raise SystemExit("Chapter 9 image targets changed during reframing")
if before.count("$$") != after.count("$$"):
    raise SystemExit("Chapter 9 display-math delimiter count changed")

required = [
    "# Open the position box",
    "Chapters 1–8 then treated the supplied $X$ as the current hidden-state matrix already prepared for the block",
    "pedagogical, not computational",
    "RoPE acts directly on Query and Key coordinate pairs",
    "row alignment",
    "causal visibility",
    "positional mechanism",
    "not a universal pipeline",
    "not a mandatory step that must also occur before RoPE",
    "# Unpacking one additive version of our running matrix",
    "not a claim that a RoPE-based architecture would also create $X^{(0)}$ by adding $P$",
    "With the target architecture's positional treatment now explicit",
]
for phrase in required:
    if phrase not in after:
        raise SystemExit(f"Chapter 9 is missing required wording: {phrase}")

for forbidden in ["# A deliberate rewind", "This chapter steps backward"]:
    if forbidden in after:
        raise SystemExit(f"Chapter 9 still contains rewind framing: {forbidden}")

headings = [
    "# Approach 1: learned absolute positional embeddings",
    "# Approach 2: sinusoidal position encodings",
    "# Approach 3: rotary position embeddings",
]
positions = [after.index(heading) for heading in headings]
if positions != sorted(positions):
    raise SystemExit("Chapter 9 positional approaches are no longer in the intended order")

for guardrail in [
    "RoPE does not normally add a position vector to the hidden state.",
    "A causal mask does introduce an ordering constraint",
    "# Exact RoPE calculation",
    "# Why Values are normally not rotated",
]:
    if guardrail not in after:
        raise SystemExit(f"Chapter 9 lost an important technical guardrail: {guardrail}")

CHAPTER_PATH.write_text(after, encoding="utf-8")

stories = STORIES_PATH.read_text(encoding="utf-8")
stories = replace_once(
    stories,
    "## COH-2.3 — Reframe Chapter 9 as opening the position mechanism\n\n**Status:** Planned",
    "## COH-2.3 — Reframe Chapter 9 as opening the position mechanism\n\n**Status:** Complete",
    "COH-2.3 story status",
)
STORIES_PATH.write_text(stories, encoding="utf-8")

print("COH-2.3 Chapter 9 reframing applied and validated.")
