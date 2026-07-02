import { UniversalAgentContext } from '../models/UniversalAgentContext';

export class GeminiParser {
    public static parse(jsonString: string): UniversalAgentContext {
        try {
            const data = JSON.parse(jsonString);
            
            if (!data.systemInstruction && !data.contents) {
                throw new Error("No systemInstruction or contents fields detected. Are you sure the origin is Gemini?");
            }

            let systemPrompt = '';
            if (data.systemInstruction?.parts && data.systemInstruction.parts.length > 0) {
                systemPrompt = data.systemInstruction.parts[0].text || '';
            }

            return {
                systemPrompt,
                temperature: data.generationConfig?.temperature,
                maxTokens: data.generationConfig?.maxOutputTokens,
                history: data.contents?.map((msg: any) => ({
                    role: msg.role === 'model' ? 'assistant' : 'user',
                    content: msg.parts?.[0]?.text || ''
                })) || []
            };
        } catch (error: any) {
            throw new Error(`GeminiParser Error: ${error.message}`);
        }
    }
}
