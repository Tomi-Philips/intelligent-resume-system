import mammoth from 'mammoth';
import { extractText, getDocumentProxy } from 'unpdf';

export async function extractTextFromBuffer(
  buffer: Buffer,
  mimeType: string,
  fileName: string
): Promise<{ text: string; error?: string }> {
  try {
    const lowerName = fileName.toLowerCase();

    // PDF Extraction
    if (mimeType.includes('pdf') || lowerName.endsWith('.pdf')) {
      const pdf = await getDocumentProxy(new Uint8Array(buffer));
      const { text } = await extractText(pdf, { mergePages: true });

      const cleanText = (text || '').trim();
      if (!cleanText) {
        return {
          text: '',
          error: 'The uploaded PDF document contains no readable text (it may be scanned/image-only).',
        };
      }
      return { text: cleanText };
    }

    // DOCX Extraction
    if (
      mimeType.includes('wordprocessingml') ||
      mimeType.includes('docx') ||
      lowerName.endsWith('.docx')
    ) {
      const result = await mammoth.extractRawText({ buffer });
      const cleanText = (result.value || '').trim();
      if (!cleanText) {
        return {
          text: '',
          error: 'The uploaded DOCX document contains no readable text.',
        };
      }
      return { text: cleanText };
    }

    // Plain text fallback
    if (mimeType.includes('text/plain') || lowerName.endsWith('.txt')) {
      const text = buffer.toString('utf-8').trim();
      return { text };
    }

    return {
      text: '',
      error: 'Unsupported document format. Please upload a PDF or DOCX file.',
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to extract text from document.';
    return {
      text: '',
      error: `Error processing file: ${errorMsg}`,
    };
  }
}

