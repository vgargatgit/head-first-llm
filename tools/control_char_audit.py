#!/usr/bin/env python3
from pathlib import Path

root = Path(__file__).resolve().parents[1]
src = root / 'src'
audit = root / 'audit'
audit.mkdir(exist_ok=True)
rows = []
for path in sorted(src.glob('chapter-*.md'), key=lambda p: int(p.stem.split('-')[-1])):
    text = path.read_text(encoding='utf-8')
    for offset, ch in enumerate(text):
        if ord(ch) < 32 and ch not in '\n\r\t':
            line = text.count('\n', 0, offset) + 1
            col = offset - text.rfind('\n', 0, offset)
            context = text[max(0, offset-20):offset+25].replace('\n', ' ')
            rows.append((path.name, line, col, ord(ch), context))
out = ['# Control-character audit\n\n']
if not rows:
    out.append('No unexpected ASCII control characters found in chapter sources.\n')
else:
    out.append('| File | Line | Column | Code point | Context |\n')
    out.append('|---|---:|---:|---:|---|\n')
    for name, line, col, code, context in rows:
        out.append(f'| `{name}` | {line} | {col} | U+{code:04X} | `{context}` |\n')
(audit / 'control-character-audit.md').write_text(''.join(out), encoding='utf-8')
