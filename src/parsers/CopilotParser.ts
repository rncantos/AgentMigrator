import { UniversalAgentContext } from '../models/UniversalAgentContext';

export class CopilotParser {
    public static parse(jsonString: string): UniversalAgentContext {
        try {
            const data = JSON.parse(jsonString);
            
            if (!data.messages) {
                throw new Error("No messages field detected. Are you sure the origin is Copilot?");
            }

            let systemPrompt = '';
            const history: { role: 'user' | 'assistant'; content: string }[] = [];

            if (data.messages && Array.isArray(data.messages)) {
                for (const msg of data.messages) {
                    if (msg.role === 'system') {
                        systemPrompt = msg.content || '';
                    } else if (msg.role === 'user' || msg.role === 'assistant') {
                        history.push({ role: msg.role, content: msg.content || '' });
                    }
                }
            }

            return {
                systemPrompt,
                temperature: data.temperature,
                maxTokens: data.max_tokens,
                history
            };
        } catch (error: any) {
            throw new Error(`CopilotParser Error: ${error.message}`);
        }
    }
}
