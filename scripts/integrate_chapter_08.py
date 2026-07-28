from pathlib import Path
import re


CHAPTER_DIR = "../assets/chapter-08/"

chapter_path = Path("src/chapter-08.md")
text = chapter_path.read_text(encoding="utf-8")


def insert_before(anchor: str, marker: str, block: str) -> None:
    global text
    if marker in text:
        return
    if anchor not in text:
        raise RuntimeError(f"Missing Chapter 8 anchor: {anchor}")
    text = text.replace(anchor, block.rstrip() + "\n\n" + anchor, 1)


hero_marker = "<!-- chapter-08-art:hero:start -->"
hero = """<!-- chapter-08-art:hero:start -->
![After a shared attention meeting, THE, CAT, and SAT enter separate but identical private MLP rooms that transform each token row independently using one shared parameter blueprint.](../assets/chapter-08/01_chapter_hero_private_thinking_room.png){.hero}
<!-- chapter-08-art:hero:end -->"""
if hero_marker not in text:
    front_anchor = "---\n\n# The question this chapter answers"
    if front_anchor not in text:
        raise RuntimeError("Missing Chapter 8 front-matter anchor")
    text = text.replace(front_anchor, "---\n\n" + hero + "\n\n# The question this chapter answers", 1)

insert_before(
    "# Expand, activate, contract",
    "<!-- chapter-08-art:mechanism:start -->",
    """<!-- chapter-08-art:mechanism:start -->
![A cartoon MLP pipeline expands one four-feature token row through W1 into six intermediate features, applies ReLU coordinate by coordinate, and contracts the result through W2 into a four-feature update.](../assets/chapter-08/02_expand_activate_contract.png)
<!-- chapter-08-art:mechanism:end -->""",
)

insert_before(
    "# Calculate SAT's expanded representation",
    "<!-- chapter-08-art:expansion:start -->",
    """<!-- chapter-08-art:expansion:start -->
![SAT's four input features multiply the four-by-six W1 matrix and add b1, with the first expanded coordinate verified and all six pre-activation values displayed.](../assets/chapter-08/03_exact_sat_expansion.png)
<!-- chapter-08-art:expansion:end -->""",
)

insert_before(
    "# Apply the activation",
    "<!-- chapter-08-art:activation:start -->",
    """<!-- chapter-08-art:activation:start -->
![Six ReLU gates retain SAT's positive intermediate features and replace the negative fourth coordinate with zero; THE and CAT show different activation patterns under the same rule.](../assets/chapter-08/04_activation_gate.png)
<!-- chapter-08-art:activation:end -->""",
)

insert_before(
    "# Contract SAT back to the model width",
    "<!-- chapter-08-art:contraction:start -->",
    """<!-- chapter-08-art:contraction:start -->
![SAT's six activated features multiply the six-by-four W2 matrix and add b2, producing a four-coordinate MLP update whose first coordinate is verified.](../assets/chapter-08/05_exact_sat_contraction.png)
<!-- chapter-08-art:contraction:end -->""",
)

insert_before(
    "# Calculate the MLP for every token",
    "<!-- chapter-08-art:positionwise:start -->",
    """<!-- chapter-08-art:positionwise:start -->
![THE, CAT, and SAT travel through separate copies of the same position-wise MLP, sharing W1, b1, W2, and b2 while producing different P, U, and F rows without cross-token mixing.](../assets/chapter-08/06_positionwise_shared_mlp.png)
<!-- chapter-08-art:positionwise:end -->""",
)

insert_before(
    "# The second residual connection",
    "<!-- chapter-08-art:residual:start -->",
    """<!-- chapter-08-art:residual:start -->
![The three-by-four MLP update joins the residual highway at a second addition junction, and row-wise LayerNorm produces the completed three-by-four Transformer block output.](../assets/chapter-08/07_mlp_residual_and_norm.png)
<!-- chapter-08-art:residual:end -->""",
)

insert_before(
    "# Chapter takeaway",
    "<!-- chapter-08-art:block-rewind:start -->",
    """<!-- chapter-08-art:block-rewind:start -->
![A complete Transformer block floor plan shows attention, the first residual and normalisation, the private position-wise MLP, and the second residual and normalisation, followed by a rewind toward positional information.](../assets/chapter-08/08_complete_transformer_block_and_rewind.png)
<!-- chapter-08-art:block-rewind:end -->""",
)

reference_count = text.count(CHAPTER_DIR)
if reference_count != 8:
    raise RuntimeError(f"Expected 8 Chapter 8 image references, found {reference_count}")
chapter_path.write_text(text, encoding="utf-8")


app_path = Path("site/app.js")
app = app_path.read_text(encoding="utf-8")
old_mapping = "8: { title: 'The Private Thinking Room', source: 'src/chapter-08.md', assetFrom: [], assetTo: '', assetAliases: {} },"
new_mapping = "8: { title: 'The Private Thinking Room', source: 'src/chapter-08.md', assetFrom: ['../assets/chapter-08/', '/assets/chapter-08/'], assetTo: 'assets/chapter-08/', assetAliases: {} },"
if old_mapping not in app and new_mapping not in app:
    raise RuntimeError("Missing Chapter 8 reader mapping")
app = app.replace(old_mapping, new_mapping)

version_match = re.search(r"const BUILD_VERSION = '([^']+)';", app)
if not version_match:
    raise RuntimeError("Missing website BUILD_VERSION")
old_version = version_match.group(1)
base, separator, suffix = old_version.rpartition(".")
if separator and suffix.isdigit():
    new_version = f"{base}.{int(suffix) + 1}"
else:
    new_version = old_version + ".1"
app = app.replace(f"const BUILD_VERSION = '{old_version}';", f"const BUILD_VERSION = '{new_version}';", 1)
app_path.write_text(app, encoding="utf-8")

for path_string in ["site/chapter.html", "site/index.html"]:
    path = Path(path_string)
    body = path.read_text(encoding="utf-8")
    if old_version not in body:
        raise RuntimeError(f"Expected build version {old_version} in {path_string}")
    path.write_text(body.replace(old_version, new_version), encoding="utf-8")


plan_path = Path("docs/chapter-08/chapter-08-scene-plan.md")
plan = plan_path.read_text(encoding="utf-8")
plan = plan.replace(
    "- Final artwork generation: not started.",
    "- Final artwork generation: complete for the accepted cartoon set and all eight scene assets.",
)
plan = plan.replace(
    "- Asset integration into the chapter: not started.",
    "- Asset integration into the chapter: complete.",
)
plan = plan.replace(
    "- Website and mobile review: pending final artwork.",
    "- Website and mobile review: pending deployed preview review.",
)
plan_path.write_text(plan, encoding="utf-8")


changelog_path = Path("CHANGELOG.md")
changelog = changelog_path.read_text(encoding="utf-8")
entry = """## 2026-07-28 — Chapter 8 graphics added

- Added eight approved cartoon-style PNG scenes under `assets/chapter-08/`.
- Integrated the Private Thinking Room hero, expand–activate–contract mechanism, exact SAT expansion and contraction, ReLU gate, shared position-wise MLP, second residual and normalisation, and complete-block rewind into the manuscript.
- Added technical alt text for every Chapter 8 scene.
- Activated Chapter 8 assets in the website reader and refreshed the reader cache version.
- Updated the Chapter 8 production plan.

"""
if "## 2026-07-28 — Chapter 8 graphics added" not in changelog:
    anchor = "All notable changes to **LLMs from the Inside Out** are recorded here.\n\n"
    if anchor not in changelog:
        raise RuntimeError("Missing changelog insertion anchor")
    changelog = changelog.replace(anchor, anchor + entry, 1)
changelog_path.write_text(changelog, encoding="utf-8")

print(f"Integrated eight Chapter 8 images and bumped the reader from {old_version} to {new_version}.")
