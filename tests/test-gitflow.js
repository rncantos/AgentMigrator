const fs = require('fs');
const { ClaudeParser } = require('../out/parsers/ClaudeParser.js');
const { GeminiGenerator } = require('../out/generators/GeminiGenerator.js');

try {
    const claudeJson = fs.readFileSync('/Users/rncantos/develop/claude-agents/gitflow_reviewer_agent.json', 'utf8');
    const ctx = ClaudeParser.parse(claudeJson);
    const gemini = GeminiGenerator.generate(ctx);
    console.log(gemini);
} catch (e) {
    console.error(e);
}
