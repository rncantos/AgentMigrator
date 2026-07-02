const fs = require('fs');
const { ClaudeParser } = require('../out/parsers/ClaudeParser.js');
const { GeminiGenerator } = require('../out/generators/GeminiGenerator.js');

try {
    const claudeJson = fs.readFileSync(__dirname + '/mocks/claude.json', 'utf8');
    console.log("Raw JSON:", claudeJson.substring(0, 50));
    const ctx = ClaudeParser.parse(claudeJson);
    console.log("Parsed Context:", ctx);
    const gemini = GeminiGenerator.generate(ctx);
    console.log("Generated Gemini:", gemini);
} catch (e) {
    console.error(e);
}
