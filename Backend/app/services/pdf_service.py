# pyrefly: ignore [missing-import]
from langchain_community.document_loaders import PyPDFLoader
# pyrefly: ignore [missing-import]
from langchain_text_splitters import RecursiveCharacterTextSplitter

def load_and_split_pdf(pdf_path: str):
    """
    Load PDF and split into chunks.
    """

    loader = PyPDFLoader(pdf_path)

    documents = loader.load()

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=800,
        chunk_overlap=100,
    )

    chunks = splitter.split_documents(documents)

    return chunks

def extract_raw_text_from_pdf(pdf_path: str) -> str:
    """
    Extract raw text from a PDF without chunking.
    """
    loader = PyPDFLoader(pdf_path)
    documents = loader.load()
    
    # Combine the page_content of all pages
    text = "\n".join([doc.page_content for doc in documents])
    
    return text
