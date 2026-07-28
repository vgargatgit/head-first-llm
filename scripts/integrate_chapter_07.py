from pathlib import Path

chapter_path = Path('src/chapter-07.md')
text = chapter_path.read_text(encoding='utf-8')


def insert_before(anchor: str, block: str) -> None:
    global text
    if block.strip() in text:
        return
    if anchor not in text:
        raise RuntimeError(f'Missing Chapter 7 anchor: {anchor}')
    text = text.replace(anchor, block + '\n\n' + anchor, 1)


hero = '''<!-- chapter-07-art:hero:start -->
![The Team Lead receives concatenated specialist reports while the original token states continue along a residual highway toward separate normalisation booths.](../assets/chapter-07/01_chapter_hero_team_lead.webp){.hero}
<!-- chapter-07-art:hero:end -->'''
if hero.strip() not in text:
    marker = '---\n\n# The question this chapter answers'
    if marker not in text:
        raise RuntimeError('Missing Chapter 7 front-matter anchor')
    text = text.replace(marker, '---\n\n' + hero + '\n\n# The question this chapter answers', 1)

insert_before(
    "# Verify SAT's output projection",
    '''<!-- chapter-07-art:output-calculation:start -->
![A workbook-style Team Lead panel shows a four-feature token report passing through a learned four-by-four output-projection matrix to produce a four-coordinate update.](../assets/chapter-07/02_output_projection_calculation.webp)
<!-- chapter-07-art:output-calculation:end -->'''
)

insert_before(
    r'# What \(W^O\) actually mixes',
    '''<!-- chapter-07-art:feature-mixing:start -->
![Feature lines from concatenated head reports are mixed within one token row; output projection does not perform another Query-Key comparison.](../assets/chapter-07/03_output_projection_feature_mixing.webp)
<!-- chapter-07-art:feature-mixing:end -->'''
)

insert_before(
    '# The residual highway',
    '''<!-- chapter-07-art:residual-highway:start -->
![The output-projection update joins the original token state on a residual highway before the token proceeds to normalisation.](../assets/chapter-07/04_residual_highway.webp)
<!-- chapter-07-art:residual-highway:end -->'''
)

insert_before(
    '# Residual addition requires matching shapes',
    '''<!-- chapter-07-art:shape-match:start -->
![Matching three-by-four input and update grids align cell by cell so their residual sum remains a three-by-four tensor.](../assets/chapter-07/05_residual_shape_match.webp)
<!-- chapter-07-art:shape-match:end -->'''
)

insert_before(
    '# LayerNorm works within each token',
    '''<!-- chapter-07-art:per-token-layernorm:start -->
![THE, CAT, and SAT enter separate LayerNorm booths, each calculating its own mean and variance across four feature coordinates before learned scale and shift.](../assets/chapter-07/06_per_token_layernorm.webp)
<!-- chapter-07-art:per-token-layernorm:end -->'''
)

insert_before(
    '# Exact LayerNorm calculation for SAT',
    '''<!-- chapter-07-art:exact-layernorm:start -->
![SAT's residual row is normalised with mean 0.064982 and variance 0.174902, producing approximately negative 0.066680, negative 0.316240, 1.573850, and negative 1.190930.](../assets/chapter-07/07_exact_sat_layernorm.webp)
<!-- chapter-07-art:exact-layernorm:end -->'''
)

insert_before(
    '# Chapter takeaway',
    '''<!-- chapter-07-art:variants-handoff:start -->
![Post-norm and pre-norm block orderings are compared, LayerNorm is distinguished from RMSNorm, and THE, CAT, and SAT head toward separate Chapter 8 private thinking rooms.](../assets/chapter-07/08_norm_variants_and_handoff.webp)
<!-- chapter-07-art:variants-handoff:end -->'''
)

if text.count('../assets/chapter-07/') != 8:
    raise RuntimeError(f'Expected 8 Chapter 7 image references, found {text.count("../assets/chapter-07/")}')
chapter_path.write_text(text, encoding='utf-8')

app_path = Path('site/app.js')
app = app_path.read_text(encoding='utf-8')
app = app.replace("const BUILD_VERSION = '20260728.6';", "const BUILD_VERSION = '20260728.7';")
old = "7: { title: 'The Team Lead Combines the Reports', source: 'src/chapter-07.md', assetFrom: [], assetTo: '', assetAliases: {} },"
new = "7: { title: 'The Team Lead Combines the Reports', source: 'src/chapter-07.md', assetFrom: ['../assets/chapter-07/', '/assets/chapter-07/'], assetTo: 'assets/chapter-07/', assetAliases: {} },"
if old not in app and new not in app:
    raise RuntimeError('Missing Chapter 7 reader mapping')
app = app.replace(old, new)
app_path.write_text(app, encoding='utf-8')

for path_string in ['site/chapter.html', 'site/index.html']:
    path = Path(path_string)
    body = path.read_text(encoding='utf-8').replace('20260728.6', '20260728.7')
    path.write_text(body, encoding='utf-8')

plan_path = Path('docs/chapter-07/chapter-07-scene-plan.md')
plan = plan_path.read_text(encoding='utf-8')
plan = plan.replace('- Final artwork generation: not started.', '- Final artwork generation: complete for the accepted poster and all eight scene assets.')
plan = plan.replace('- Asset integration into the chapter: not started.', '- Asset integration into the chapter: complete.')
plan = plan.replace('- Website and mobile review: pending final artwork.', '- Website and mobile review: pending deployed preview review.')
plan_path.write_text(plan, encoding='utf-8')

changelog_path = Path('CHANGELOG.md')
changelog = changelog_path.read_text(encoding='utf-8')
entry = '''## 2026-07-28 — Chapter 7 graphics added

- Added the accepted Chapter 7 full-page poster and eight WebP scene assets under `assets/chapter-07/`.
- Introduced the Team Lead, output-projection board, residual highway, per-token normalisation booths, and Private Thinking Room handoff.
- Integrated output projection, feature mixing, residual addition, shape compatibility, per-token LayerNorm, exact SAT normalisation, and normalisation variants into the manuscript.
- Activated Chapter 7 assets in the website reader and refreshed the site cache version.
- Updated the Chapter 7 production plan.

'''
if '## 2026-07-28 — Chapter 7 graphics added' not in changelog:
    anchor = 'All notable changes to **LLMs from the Inside Out** are recorded here.\n\n'
    if anchor not in changelog:
        raise RuntimeError('Missing changelog insertion anchor')
    changelog = changelog.replace(anchor, anchor + entry, 1)
changelog_path.write_text(changelog, encoding='utf-8')
