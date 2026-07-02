import { UniversalAgentContext } from '../models/UniversalAgentContext';

export class ClaudeParser {
    public static parse(jsonString: string): UniversalAgentContext {
        try {
            const data = JSON.parse(jsonString);
            const root = data.request ? data.request : data;

            const system = root.system || root.system_prompt;

            if (!system && !root.messages) {
                throw new Error("No system or messages fields detected in this file.");
            }

            return {
                name: root.name,
                role: root.role,
                description: root.description,
                systemPrompt: system || '',
                temperature: root.temperature,
                maxTokens: root.max_tokens,
                toneAndStyle: root.tone_and_style,
                examples: root.review_examples || root.examples,
                history: root.messages?.map((msg: any) => ({
                    role: msg.role,
                    content: msg.content
                })) || []
            };
        } catch (error: any) {
            throw new Error(`ClaudeParser Error: ${error.message}`);
        }
    }
}
