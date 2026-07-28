from pathlib import Path

NEW_VERSION = "20260728.11"

app_path = Path("site/app.js")
app = app_path.read_text(encoding="utf-8")
old_app = "const BUILD_VERSION = '20260728.9';"
new_app = f"const BUILD_VERSION = '{NEW_VERSION}';"
if app.count(old_app) != 1:
    raise RuntimeError(f"Expected one app build version marker, found {app.count(old_app)}")
app_path.write_text(app.replace(old_app, new_app, 1), encoding="utf-8")

chapter_path = Path("site/chapter.html")
chapter = chapter_path.read_text(encoding="utf-8")
old_version = "20260728.10"
count = chapter.count(old_version)
if count < 1:
    raise RuntimeError("Expected chapter.html cache-version references")
chapter_path.write_text(chapter.replace(old_version, NEW_VERSION), encoding="utf-8")

print(f"Updated site build version to {NEW_VERSION}; replaced {count} chapter.html references")
