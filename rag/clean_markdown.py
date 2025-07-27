import re

def clean_markdown_text(text: str) -> str:
    # Remove redundant newlines and whitespace
    text = re.sub(r'\n\s*\n', '\n\n', text)  # normalize multiple newlines
    text = re.sub(r'[ \t]+', ' ', text)      # normalize excessive spaces/tabs

    # Remove markdown links but keep the text
    text = re.sub(r'\[([^\]]+)\]\([^)]+\)', r'\1', text)

    # Remove image links
    text = re.sub(r'!\[.*?\]\(.*?\)', '', text)

    # Remove HTML tags if any remained
    text = re.sub(r'<[^>]+>', '', text)

    # Remove navigation, footer text, or page artifacts (adjust as per your HTML)
    artifact_keywords = ['back to top', '©', 'aven.io', 'cookies', 'privacy policy']
    for word in artifact_keywords:
        text = re.sub(fr'.*{word}.*\n?', '', text, flags=re.IGNORECASE)

    # Strip leading/trailing whitespace
    return text.strip()
