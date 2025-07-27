from .query_pipeline import get_query_chain
qa_chain = get_query_chain()

def start_chat():
    print("Welcome to AvenBot! Type 'exit' or 'quit' to end the chat.")
    print("Ask me anything about the documents I have stored.")
    while True:
        query = input("You: ")
        if query.lower() in ["exit", "quit"]:
            break

        # get_related_docs(query)
        # get_query_chain_mannual(query)
        result = qa_chain.invoke({"query": query})
        print("\nAvenBot:", result["result"])
        print("Sources:")
        for doc in result["source_documents"]:
            print("-", doc.metadata.get("source", "unknown"))

def get_response(query: str):
    result = qa_chain.invoke({"query": query})
    response = result["result"]
    sources = [doc.metadata.get("source", "unknown") for doc in result["source_documents"]]
    return {"response": response, "sources": sources}


if __name__ == "__main__":
    start_chat()