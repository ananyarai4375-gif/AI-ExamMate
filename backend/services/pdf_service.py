from pypdf import PdfReader
import io


def extract_text_from_pdf(file_bytes: bytes) -> str:
    """
    Extract text from an uploaded PDF.
    """

    try:
        reader = PdfReader(io.BytesIO(file_bytes))

        text_parts = []

        for page in reader.pages:
            page_text = page.extract_text()

            if page_text:
                text_parts.append(page_text)

        text = "\n".join(text_parts)

        return text.strip()

    except Exception as e:
        raise ValueError(f"Could not read PDF: {str(e)}")