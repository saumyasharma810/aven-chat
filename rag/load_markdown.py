from langchain_community.document_loaders import DirectoryLoader, TextLoader

def load_markdown_files(directory_path: str):
    loader = DirectoryLoader(
        path=directory_path,
        glob="**/*.md",                   # All markdown files recursively
        loader_cls=TextLoader,
        show_progress=True
    )
    documents = loader.load()
    return documents