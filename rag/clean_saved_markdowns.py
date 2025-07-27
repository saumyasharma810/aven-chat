import os
from pathlib import Path
from clean_markdown import clean_markdown_text

def clean_all_markdowns(folder_path: str):
    folder = Path(folder_path)
    for file in folder.glob("*.md"):
        with open(file, "r", encoding="utf-8") as f:
            raw_text = f.read()
        cleaned_text = clean_markdown_text(raw_text)
        with open(file, "w", encoding="utf-8") as f:
            f.write(cleaned_text)
        print(f"Cleaned: {file.name}")

# Run this
if __name__ == "__main__":
    clean_all_markdowns("data/markdowns")
