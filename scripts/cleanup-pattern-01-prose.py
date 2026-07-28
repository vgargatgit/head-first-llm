from pathlib import Path

path = Path("src/chapter-07.md")
text = path.read_text(encoding="utf-8")
old = "Use cautious wording here: residual connections often make deep networks easier to train, but they do not guarantee that signals or gradients remain large, small, or stable. The branch can amplify, attenuate, reinforce, or oppose other contributions."
new = "Residual connections often make deep networks easier to train, but they do not guarantee that signals or gradients remain large, small, or stable. The branch can amplify, attenuate, reinforce, or oppose other contributions."

if old not in text:
    raise RuntimeError("Expected editorial sentence was not found exactly once")
if text.count(old) != 1:
    raise RuntimeError(f"Expected one editorial sentence, found {text.count(old)}")

path.write_text(text.replace(old, new, 1), encoding="utf-8")
print("cleaned src/chapter-07.md")
