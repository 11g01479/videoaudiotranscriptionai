
import { GoogleGenAI } from "@google/genai";

if (!process.env.API_KEY) {
    throw new Error("API_KEY 環境変数が設定されていません。");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const result = reader.result as string;
            // Remove the data URL prefix e.g. "data:video/mp4;base64,"
            resolve(result.split(',')[1]);
        };
        reader.onerror = (error) => reject(error);
    });
};

export const generateTranscriptFromFile = async (file: File): Promise<string> => {
    try {
        const base64Data = await fileToBase64(file);

        const filePart = {
            inlineData: {
                mimeType: file.type,
                data: base64Data,
            },
        };

        const textPart = {
            text: "このファイルの音声をすべて日本語で文字起こししてください。話者を「話者1」「話者2」のように数字で区別し、話者が変わるたびに改行して、誰が話しているかを示してください。",
        };
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            // For multi-modal prompts, it's best practice to put text parts before media parts,
            // and the `contents` field should be a single Content object, not an array.
            contents: { parts: [textPart, filePart] },
        });

        const transcript = response.text;
        if (!transcript) {
            throw new Error("APIから有効な文字起こしテキストが返されませんでした。");
        }
        
        return transcript;

    } catch (error) {
        console.error("文字起こし生成エラー:", error);
        if (error instanceof Error) {
            if (error.message.includes('API key not valid')) {
                 throw new Error("APIキーが無効です。設定を確認してください。");
            }
             if (error.message.includes('request entity too large')) {
                throw new Error("ファイルサイズが大きすぎます。より小さいファイルで試してください。");
            }
        }
        throw new Error("Gemini APIとの通信中にエラーが発生しました。");
    }
};
