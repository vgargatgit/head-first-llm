#!/usr/bin/env python3
"""Static manuscript audit for the 24-chapter LLM book."""
from __future__ import annotations

import re
from pathlib import Path
from collections import Counter

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "src"
AUDIT = ROOT / "audit"
AUDIT.mkdir(exist_ok=True)

chapter_files = sorted(SRC.glob("chapter-*.md"))
callout_classes = ("big-idea", "translation", "warning", "exercise")


def matrix_shape(body: str):
    rows = [r.strip() for r in re.split(r"\\\\", body.strip()) if r.strip()]
    widths = []
    for row in rows:
        widths.append(len([c for c in row.split("&")]))
    return len(rows), widths


def count_unescaped_dollars(text: str) -> int:
    text = re.sub(r"\\\$", "", text)
    text = re.sub(r"\$\$[\s\S]*?\$\$", "", text)
    return text.count("$")

all_text = []
report = []
report.append("# Automated manuscript and renderer audit\n")
report.append(f"Audited {len(chapter_files)} chapter files.\n")
report.append("## High-confidence book-wide findings\n")

raw_callout_total = 0
raw_callout_markdown_total = 0
missing_images_total = 0
matrix_irregular_total = 0
chapter_summaries = []

for path in chapter_files:
    text = path.read_text(encoding="utf-8")
    all_text.append(f"\n\n===== {path.as_posix()} =====\n\n{text}")
    issues = []

    # Front matter and chapter-title visibility.
    fm = re.match(r"^---\n([\s\S]*?)\n---\n", text)
    title = None
    body = text
    if fm:
        title_match = re.search(r'^title:\s*["\']?(.*?)["\']?\s*$', fm.group(1), re.M)
        title = title_match.group(1) if title_match else None
        body = text[fm.end():]
    else:
        issues.append("Missing or malformed YAML front matter.")

    first_heading = re.search(r"^#\s+(.+)$", body, re.M)
    if title and first_heading and title.split("—", 1)[-1].strip() not in first_heading.group(1):
        issues.append(
            "Front-matter chapter title is not emitted by the reader and the first H1 is a section heading; "
            "the rendered article therefore opens without its chapter title."
        )

    # Raw HTML callouts containing Markdown.
    callout_count = 0
    callout_md = 0
    for cls in callout_classes:
        pattern = re.compile(rf'<div\s+class=["\']{re.escape(cls)}["\']\s*>\s*([\s\S]*?)\s*</div>', re.I)
        for match in pattern.finditer(body):
            callout_count += 1
            inner = match.group(1)
            if re.search(r"(^|\n)\s*(#{1,6}\s|[-*+]\s|\d+\.\s)|\*\*|\$\$|`", inner):
                callout_md += 1
    raw_callout_total += callout_count
    raw_callout_markdown_total += callout_md
    if callout_md:
        issues.append(f"{callout_md} raw HTML callout block(s) contain Markdown that Marked will not reliably parse.")

    # Structural balance checks.
    if body.count("```") % 2:
        issues.append("Unbalanced fenced-code delimiter count.")
    if body.count("$$") % 2:
        issues.append("Unbalanced display-math delimiter count.")
    inline_dollars = count_unescaped_dollars(body)
    if inline_dollars % 2:
        issues.append("Odd number of inline-dollar delimiters after excluding display math.")
    for cls in callout_classes:
        opens = len(re.findall(rf'<div\s+class=["\']{re.escape(cls)}["\']\s*>', body, re.I))
        closes = len(re.findall(r"</div>", body, re.I))
        # Overall closing count is checked below; class-specific closes are not labelled.
        if opens and closes == 0:
            issues.append(f"Opening {cls} callout found without any closing div.")
    if len(re.findall(r"<div\b", body, re.I)) != len(re.findall(r"</div>", body, re.I)):
        issues.append("Unbalanced raw HTML div tags.")

    # Image references.
    for alt, target in re.findall(r"!\[([^\]]*)\]\(([^)]+)\)", body):
        clean = target.split("?", 1)[0].split("#", 1)[0]
        if re.match(r"^[a-z]+://", clean):
            continue
        candidate_paths = [ROOT / clean, path.parent / clean]
        if not any(p.exists() for p in candidate_paths):
            missing_images_total += 1
            issues.append(f"Missing referenced image: `{target}` ({alt or 'no alt text'}).")

    # Matrix row-width consistency and inventory for manual shape review.
    matrices = []
    for m in re.finditer(r"\\begin\{(?:bmatrix|pmatrix|matrix)\}([\s\S]*?)\\end\{(?:bmatrix|pmatrix|matrix)\}", body):
        rows, widths = matrix_shape(m.group(1))
        matrices.append((rows, widths, body.count("\n", 0, m.start()) + 1))
        if widths and len(set(widths)) > 1:
            matrix_irregular_total += 1
            issues.append(f"Irregular matrix row widths near source line {matrices[-1][2]}: {widths}.")

    # Suspicious dimension-language near explicit vectors.
    lines = body.splitlines()
    for i, line in enumerate(lines):
        size_match = re.search(r"vector\s+(?:of\s+)?(?:size|length|dimension)\s*(?:is|=|:)??\s*(\d+)", line, re.I)
        if not size_match:
            continue
        expected = int(size_match.group(1))
        window = "\n".join(lines[i:i+18])
        vm = re.search(r"\\begin\{bmatrix\}([\s\S]*?)\\end\{bmatrix\}", window)
        if vm:
            rows, widths = matrix_shape(vm.group(1))
            actual = widths[0] if rows == 1 and widths else rows if widths and all(w == 1 for w in widths) else None
            if actual is not None and actual != expected:
                issues.append(f"Vector-size prose says {expected}, but nearby explicit vector has {actual} entries (near line {i+1}).")

    # Markdown table consistency.
    table_lines = [(idx + 1, line) for idx, line in enumerate(lines) if line.strip().startswith("|") and line.strip().endswith("|")]
    groups = []
    current = []
    last = None
    for item in table_lines:
        if last is None or item[0] == last + 1:
            current.append(item)
        else:
            if len(current) >= 2:
                groups.append(current)
            current = [item]
        last = item[0]
    if len(current) >= 2:
        groups.append(current)
    for group in groups:
        counts = [line.count("|") for _, line in group]
        if len(set(counts)) > 1:
            issues.append(f"Markdown table has inconsistent column delimiters around lines {group[0][0]}–{group[-1][0]}: {counts}.")

    chapter_summaries.append((path.name, title or "(unknown title)", len(body.splitlines()), len(matrices), issues))

report.append(
    f"- Found **{raw_callout_total}** custom callout blocks; **{raw_callout_markdown_total}** contain Markdown syntax inside raw HTML and are at risk of displaying literal `**`, `##`, lists, or equation delimiters.\n"
)
report.append(
    "- The reader strips YAML front matter but does not render its `title` or `subtitle`; chapters whose first H1 is “The question this chapter answers” open without the chapter name.\n"
)
report.append(f"- Found **{missing_images_total}** missing local image reference(s).\n")
report.append(f"- Found **{matrix_irregular_total}** matrices with inconsistent row widths.\n")

report.append("\n## Per-chapter static findings\n")
for filename, title, line_count, matrix_count, issues in chapter_summaries:
    report.append(f"\n### {filename} — {title}\n")
    report.append(f"- Body lines: {line_count}; explicit matrices: {matrix_count}.\n")
    if issues:
        for issue in issues:
            report.append(f"- **Review:** {issue}\n")
    else:
        report.append("- No high-confidence structural issue detected by the static checks.\n")

report.append("\n## Scope and limitations\n")
report.append(
    "This automated pass checks structural Markdown/HTML, missing local assets, delimiter balance, table consistency, explicit matrix row widths, and simple nearby vector-size statements. "
    "It does not prove semantic correctness of every equation. The concatenated manuscript is emitted separately for expert line-by-line review.\n"
)

(AUDIT / "static-audit.md").write_text("".join(report), encoding="utf-8")
(AUDIT / "all-chapters.txt").write_text("".join(all_text), encoding="utf-8")
print(f"Wrote audit for {len(chapter_files)} chapters")
