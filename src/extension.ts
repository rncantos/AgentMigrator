import * as vscode from 'vscode';
import * as path from 'path';
import { getWebviewContent } from './webview/WebviewContent';
import { ClaudeParser } from './parsers/ClaudeParser';
import { GeminiParser } from './parsers/GeminiParser';
import { CopilotParser } from './parsers/CopilotParser';
import { ClaudeGenerator } from './generators/ClaudeGenerator';
import { GeminiGenerator } from './generators/GeminiGenerator';
import { CopilotGenerator } from './generators/CopilotGenerator';
import { UniversalAgentContext } from './models/UniversalAgentContext';

const parsers: Record<string, (json: string) => UniversalAgentContext> = {
    'Claude': ClaudeParser.parse,
    'Gemini': GeminiParser.parse,
    'Copilot': CopilotParser.parse
};

const generators: Record<string, (context: UniversalAgentContext) => string> = {
    'Claude': ClaudeGenerator.generate,
    'Gemini': GeminiGenerator.generate,
    'Copilot': CopilotGenerator.generate
};

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('agent-migrator.migrate', async () => {
        const panel = vscode.window.createWebviewPanel(
            'agentMigratorUI',
            '✨ Agent Migrator',
            vscode.ViewColumn.One,
            {
                enableScripts: true,
                retainContextWhenHidden: true
            }
        );

        panel.webview.html = getWebviewContent(panel.webview, context.extensionUri);

        panel.webview.onDidReceiveMessage(
            async message => {
                switch (message.command) {
                    case 'selectFile':
                        const fileUris = await vscode.window.showOpenDialog({
                            canSelectMany: false,
                            openLabel: 'Select Config (JSON)',
                            filters: { 'JSON': ['json'] }
                        });
                        
                        if (fileUris && fileUris.length > 0) {
                            const uri = fileUris[0];

                            // Security: File size limit to prevent DoS via huge JSON
                            const stat = await vscode.workspace.fs.stat(uri);
                            if (stat.size > 5 * 1024 * 1024) { // 5MB limit
                                vscode.window.showErrorMessage('Security Error: File is too large to process (max 5MB).');
                                return;
                            }

                            const fileData = await vscode.workspace.fs.readFile(uri);
                            const fileContent = Buffer.from(fileData).toString('utf8');
                            
                            panel.webview.postMessage({
                                command: 'fileSelected',
                                fileName: path.basename(uri.fsPath),
                                filePath: uri.fsPath,
                                fileContent: fileContent
                            });
                        }
                        return;

                    case 'migrate':
                        try {
                            const { sourceFormat, targetFormat, fileContent, filePath } = message;
                            const cleanSourceFormat = sourceFormat.replace(/[^a-zA-Z]/g, '');
                            const cleanTargetFormat = targetFormat.replace(/[^a-zA-Z]/g, '');

                            if (cleanSourceFormat === cleanTargetFormat) {
                                vscode.window.showWarningMessage('Origin and Target formats are the same.');
                                return;
                            }

                            const universalContext = parsers[cleanSourceFormat](fileContent);
                            const targetJson = generators[cleanTargetFormat](universalContext);

                            const defaultSavePath = filePath.replace(/\.json$/, `_${cleanTargetFormat.toLowerCase()}.json`);
                            const saveUri = await vscode.window.showSaveDialog({
                                defaultUri: vscode.Uri.file(defaultSavePath),
                                filters: { 'JSON': ['json'] },
                                saveLabel: `Save ${cleanTargetFormat} Config`
                            });

                            if (saveUri) {
                                await vscode.workspace.fs.writeFile(saveUri, Buffer.from(targetJson, 'utf8'));
                                vscode.window.showInformationMessage(`✨ Successfully migrated to ${cleanTargetFormat}!`);
                            }
                        } catch (error: any) {
                            vscode.window.showErrorMessage(`Migration Error: ${error.message}`);
                        }
                        return;
                }
            },
            undefined,
            context.subscriptions
        );
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}
