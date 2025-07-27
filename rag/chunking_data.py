from langchain.text_splitter import RecursiveCharacterTextSplitter


def chunk_markdown_files(docs):
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,      
        chunk_overlap=200,    
        separators=["\n\n", "\n", ".", " ", ""]  
    )
    chunked_docs = text_splitter.split_documents(docs)
    return chunked_docs