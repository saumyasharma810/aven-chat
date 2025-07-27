from firecrawl import FirecrawlApp
import os
from dotenv import load_dotenv


load_dotenv()

app = FirecrawlApp(os.getenv('FIRECRAWL_API_KEY'))


def get_firecrawl_client(url: str):
    # Scraping the website:
    return app.scrape_url(url=url, formats=['markdown'], wait_for=2000)