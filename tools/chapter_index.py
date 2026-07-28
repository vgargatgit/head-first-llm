#!/usr/bin/env python3
from pathlib import Path

root = Path(__file__).resolve().parents[1]
src = root / 'src'
audit = root / 'audit'
audit.mkdir(exist_ok=True)
files = sorted(src.glob('chapter-*.md'), key=lambda p: int(p.stem.split('-')[-1]))
line = 1
rows = []
parts = []
for path in files:
    prefix = f"\n\n===== {path.as_posix()} =====\n\n"
    text = path.read_text(encoding='utf-8')
    start = line + prefix.count('\n')
    part = prefix + text
    end = line + part.count('\n')
    rows.append((path.name, start, end))
    parts.append(part)
    line = end + 1
(audit / 'all-chapters.txt').write_text(''.join(parts), encoding='utf-8')
out = ['# Concatenated manuscript line index\n\n', '| Chapter file | Start line | End line |\n', '|---|---:|---:|\n']
for name, start, end in rows:
    out.append(f'| `{name}` | {start} | {end} |\n')
(audit / 'chapter-index.md').write_text(''.join(out), encoding='utf-8')
