# ingest/crawl.py
import requests
import re
import os
import json
from firecrawl_client import get_firecrawl_client
from urllib.parse import urlparse

def save_string_to_file(folder_path, file_name, content_string):
    os.makedirs(folder_path, exist_ok=True)
    with open(os.path.join(folder_path, file_name), 'w') as f:
        f.write(content_string)

def save_json_to_file(folder_path, file_name, data):
    os.makedirs(folder_path, exist_ok=True)
    with open(os.path.join(folder_path, file_name), 'w') as f:
        json.dump(data, f, indent=2)

def get_slug_from_url(url):
    path = urlparse(url).path.strip("/")
    return path.replace("/", "_") or "home"

# 1. Fetch sitemap and extract URLs
sitemap = requests.get('https://www.aven.com/sitemap.xml').text
all_links = re.findall(r'<loc>(.*?)</loc>', sitemap)
save_string_to_file('data', 'urls.txt', '\n'.join(all_links))

# 2. Crawl and save each page
for link in all_links:
    slug = get_slug_from_url(link)
    markdown_path = f"data/markdowns/{slug}.md"
    
    # ✅ Don't re-crawl if already exists
    if os.path.exists(markdown_path):
        print(f"[✔] Skipping already crawled: {slug}")
        continue

    try:
        print(f"[→] Crawling: {link}")
        crawled = get_firecrawl_client(link)
        
        # Save everything
        save_string_to_file('data/markdowns', f"{slug}.md", crawled.markdown)
        save_json_to_file('data/metadata', f"{slug}.json", crawled.metadata)
        print(f"[✓] Saved: {slug}")
    except Exception as e:
        print(f"[✗] Error scraping {link}: {e}")
