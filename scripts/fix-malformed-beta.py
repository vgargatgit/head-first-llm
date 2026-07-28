from pathlib import Path

changed = []
for path in sorted(Path("src").glob("chapter-*.md")):
    text = path.read_text(encoding="utf-8")
    repaired = text.replace("\x08eta", "\\beta")
    if repaired != text:
        path.write_text(repaired, encoding="utf-8")
        changed.append((str(path), text.count("\x08eta")))

if not changed:
    raise RuntimeError("No malformed beta escapes were found")

for path, count in changed:
    print(f"repaired {count} malformed beta escape(s) in {path}")
