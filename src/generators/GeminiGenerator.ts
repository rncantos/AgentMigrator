import { UniversalAgentContext } from '../models/UniversalAgentContext';

export class GeminiGenerator {
    public static generate(context: UniversalAgentContext): string {
        
        let fullSystemPrompt = context.systemPrompt;
        if (context.role) fullSystemPrompt = `Role: ${context.role}\n\n` + fullSystemPrompt;
        if (context.description) fullSystemPrompt = `Description: ${context.description}\n\n` + fullSystemPrompt;
        if (context.toneAndStyle) fullSystemPrompt += `\n\nTone and Style: ${context.toneAndStyle}`;
        if (context.examples && context.examples.length > 0) {
            fullSystemPrompt += `\n\nExamples:\n` + context.examples.join('\n');
        }

        const geminiFormat: any = {};
        
        if (fullSystemPrompt) {
            geminiFormat.systemInstruction = {
                parts: [{ text: fullSystemPrompt.trim() }]
            };
        }

        if (context.temperature !== undefined || context.maxTokens !== undefined) {
            geminiFormat.generationConfig = {};
            if (context.temperature !== undefined) geminiFormat.generationConfig.temperature = context.temperature;
            if (context.maxTokens !== undefined) geminiFormat.generationConfig.maxOutputTokens = context.maxTokens;
        }

        if (context.history && context.history.length > 0) {
            geminiFormat.contents = context.history.map(msg => ({
                role: msg.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: msg.content }]
            }));
        }

        return JSON.stringify(geminiFormat, null, 2);
    }
}
