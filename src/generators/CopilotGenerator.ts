import { UniversalAgentContext } from '../models/UniversalAgentContext';

export class CopilotGenerator {
    public static generate(context: UniversalAgentContext): string {
        let fullSystemPrompt = context.systemPrompt;
        if (context.role) fullSystemPrompt = `Role: ${context.role}\n\n` + fullSystemPrompt;
        if (context.description) fullSystemPrompt = `Description: ${context.description}\n\n` + fullSystemPrompt;
        if (context.toneAndStyle) fullSystemPrompt += `\n\nTone and Style: ${context.toneAndStyle}`;
        if (context.examples && context.examples.length > 0) {
            fullSystemPrompt += `\n\nExamples:\n` + context.examples.join('\n');
        }

        const messages: any[] = [];
        
        if (fullSystemPrompt) {
            messages.push({ role: 'system', content: fullSystemPrompt.trim() });
        }
        
        if (context.history && context.history.length > 0) {
            for (const msg of context.history) {
                messages.push({ role: msg.role, content: msg.content });
            }
        }

        const copilotFormat: any = {};
        
        if (messages.length > 0) {
            copilotFormat.messages = messages;
        }

        if (context.temperature !== undefined) copilotFormat.temperature = context.temperature;
        if (context.maxTokens !== undefined) copilotFormat.max_tokens = context.maxTokens;

        return JSON.stringify(copilotFormat, null, 2);
    }
}
