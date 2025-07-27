from langchain.chains import RetrievalQA
from .llm_model import get_chat_model
from .retriever import get_retriever
from .query_prompt import get_prompt


def get_query_chain():
    llm = get_chat_model()
    retriever = get_retriever()
    
    qa_chain = RetrievalQA.from_chain_type(
        llm=llm,
        retriever=retriever,
        chain_type="stuff",
        chain_type_kwargs={"prompt": get_prompt()},
        return_source_documents=True
    )
    return qa_chain






