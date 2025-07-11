import { Type } from "@google/genai";

export interface BookAnalysis {
  title: string;
  author: string;
  recommendationScore: number;
  overallVerdict: string;
  analysisText: string;
  positivePoints: string[];
  negativePoints: string[];
  closingQuote: {
    text: string;
    author: string;
  };
}

export const bookAnalysisSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING, description: "Az elemzett könyv címe." },
        author: { type: Type.STRING, description: "Az elemzett könyv szerzője." },
        recommendationScore: { type: Type.INTEGER, description: "Pontszám 50-ből, a 'taste_radar' alapján, mennyire illik Pi-hez." },
        overallVerdict: { type: Type.STRING, description: "Rövid, egy-két szavas összefoglaló ítélet (pl. 'Nagyon ajánlott', 'Nem illik hozzád', 'Megfontolandó'). Magyarul." },
        analysisText: { type: Type.STRING, description: "Részletes, magyar nyelvű elemzés, amely kifejti, hogy a könyv miért kapta a pontszámot, hivatkozva a 'taste_radar' tengelyeire." },
        positivePoints: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Néhány pontba szedett pozitívum, amiért tetszhet Pi-nek. Magyarul."
        },
        negativePoints: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Néhány pontba szedett negatívum vagy lehetséges kizáró ok. Magyarul."
        },
        closingQuote: {
            type: Type.OBJECT,
            properties: {
                text: { type: Type.STRING, description: "Egy rövid, releváns záró idézet magyarul." },
                author: { type: Type.STRING, description: "Az idézet szerzője." }
            },
            required: ["text", "author"]
        }
    },
    required: ["title", "author", "recommendationScore", "overallVerdict", "analysisText", "positivePoints", "negativePoints", "closingQuote"]
};
