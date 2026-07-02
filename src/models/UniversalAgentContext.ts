export interface UniversalAgentContext {
    name?: string;
    role?: string;
    description?: string;
    systemPrompt: string;
    temperature?: number;
    maxTokens?: number;
    history?: { role: 'user' | 'assistant'; content: string }[];
    toneAndStyle?: string;
    examples?: string[];
}
