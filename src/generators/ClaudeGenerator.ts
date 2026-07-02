import { UniversalAgentContext } from '../models/UniversalAgentContext';

export class ClaudeGenerator {
    public static generate(context: UniversalAgentContext): string {
        let fullSystemPrompt = context.systemPrompt;
        if (context.role) fullSystemPrompt = `Role: ${context.role}\n\n` + fullSystemPrompt;
        if (context.description) fullSystemPrompt = `Description: ${context.description}\n\n` + fullSystemPrompt;
        if (context.toneAndStyle) fullSystemPrompt += `\n\nTone and Style: ${context.toneAndStyle}`;
        if (context.examples && context.examples.length > 0) {
            fullSystemPrompt += `\n\nExamples:\n` + context.examples.join('\n');
        }

        const claudeFormat: any = {};
        
        if (fullSystemPrompt) {
            claudeFormat.system = fullSystemPrompt.trim();
        }

        if (context.temperature !== undefined) claudeFormat.temperature = context.temperature;
        if (context.maxTokens !== undefined) claudeFormat.max_tokens = context.maxTokens;

        if (context.history && context.history.length > 0) {
            claudeFormat.messages = context.history.map(msg => ({
                role: msg.role, 
                content: msg.content
            }));
        }

        return JSON.stringify(claudeFormat, null, 2);
    }
}
