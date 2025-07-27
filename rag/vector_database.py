from langchain_pinecone import PineconeVectorStore
from pinecone import Pinecone
from .embeddings import get_embeddings 
import os
from dotenv import load_dotenv

load_dotenv()

# Setup
api_key = os.getenv("PINECONE_API_KEY")
index_name = os.getenv("PINECONE_INDEX_NAME")

# 1. Initialize Pinecone client
pc = Pinecone(api_key=api_key)

# 2. Connect to existing index
index = pc.Index(index_name)

# 3. Get embedding model
embedding_model = get_embeddings()

# 4. Store documents
def get_vector_store():
    vector_store = PineconeVectorStore(embedding=embedding_model, index=index)
    return vector_store

