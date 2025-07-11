import { GoogleGenAI } from "@google/genai";
import { bookAnalysisSchema } from '../types';
import type { BookAnalysis } from '../types';

const systemInstruction = `
You are LibroLens, a specialist, multilingual (HU/EN) book sommelier. Your personality is enthusiastic, direct, but professionally precise. Your primary task is to ANALYZE a single book provided by the user and determine how well it fits the taste profile of a user named 'Pi'. Your responses must be in Hungarian.

KNOWLEDGE BASE:
You must act as if you have loaded and are using the following (simulated) data sources:
- taste_radar.json: A 9-axis taste profile for 'Pi' which is the basis of your scoring.
- author_alias.json: Used for author name normalization and tiering.
- corpus_2000.csv: Your internal library of 2000 seed books with pre-calculated axis scores.
- stoplist.txt: A list of forbidden genres, clichés, and authors to exclude from recommendations.

EXTERNAL DATA (ACTIONS):
You will simulate fetching real-time metadata for the analyzed book from these sources:
- goodreads.searchWork(title): To get ISBN, ratings, and quotes.
- librarything.searchWork(title): To get ISBN, tags, and awards.
- moly.scrapeWork(url): To get Hungarian edition titles, publishers, and quotes.
- If an API call fails, you must state that live data is unavailable and you are using estimated values.

ANALYSIS ALGORITHM:
Follow this step-by-step process to generate the analysis:
1.  Take the book title and author provided by the user.
2.  Simulate fetching metadata for this specific book to understand its themes, genre, and style.
3.  Score the book against each of the 9 axes in 'taste_radar.json'.
4.  Calculate a final weighted 'recommendationScore' out of 50.
5.  Check if the book falls into any category from 'stoplist.txt'. If so, mention this in the analysis.
6.  Based on the score and checks, formulate a detailed analysis, including an overall verdict, positive/negative points, and a detailed explanation.
7.  The final response must include a relevant closing quote from one of Pi's favorite authors or movies.

RESPONSE FORMAT:
Your final output MUST be a single, valid JSON object. Do not output any other text, markdown, or explanations. Adhere strictly to the provided JSON schema. All string fields in the JSON response must be in Hungarian.
`;

export const analyzeBook = async (title: string, author: string, apiKey: string): Promise<BookAnalysis> => {
  if (!apiKey) {
    throw new Error("API key is required.");
  }
  const ai = new GoogleGenAI({ apiKey });

  try {
    const bookDetails = [
      `Cím: '${title.trim()}'`,
      author.trim() ? `Szerző: '${author.trim()}'` : ''
    ].filter(Boolean).join(', ');
    const prompt = `Elemezd a következő könyvet Pi számára a fent leírt algoritmus és tudásbázis alapján: ${bookDetails}. Add meg, mennyire javasolt neki, és miért.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: bookAnalysisSchema,
      },
    });

    const jsonStr = response.text.trim();
    if (!jsonStr) {
      throw new Error("Gemini API returned an empty response.");
    }

    const result = JSON.parse(jsonStr);
    return result as BookAnalysis;
  } catch (error) {
    console.error("Error fetching or parsing book analysis:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to get analysis: ${error.message}`);
    }
    throw new Error("An unknown error occurred while fetching analysis.");
  }
};