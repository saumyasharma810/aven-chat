from load_markdown import load_markdown_files
from chunking_data import chunk_markdown_files
from vector_database import get_vector_store


# loading markdown files
docs = load_markdown_files("data/markdowns")
print(f"Loaded {len(docs)} markdown files")
print(docs[0].page_content[:300]) 

#chunking the documents
chunked_docs = chunk_markdown_files(docs)
print(f"Chunked into {len(chunked_docs)} chunks")
print(chunked_docs[0].page_content[:300])

#saving to the vector store
vector_store = get_vector_store() 
vector_store.add_documents(chunked_docs)
print("Documents stored in vector database successfully.")






