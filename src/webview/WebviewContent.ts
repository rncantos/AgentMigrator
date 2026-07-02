import * as vscode from 'vscode';

export function getWebviewContent(webview: vscode.Webview, extensionUri: vscode.Uri) {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; script-src 'unsafe-inline';">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Agent Migrator</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap');
        
        :root {
            --bg-color: #0f172a;
            --card-bg: rgba(15, 23, 42, 0.45);
            --primary: #3b82f6;
            --primary-hover: #60a5fa;
            --text-main: #f8fafc;
            --text-muted: #94a3b8;
            --border-color: rgba(255, 255, 255, 0.08);
            --glow: 0 0 20px rgba(59, 130, 246, 0.5);
        }
        body {
            font-family: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif;
            background: linear-gradient(-45deg, #0f172a, #311847, #0f172a, #112a46);
            background-size: 400% 400%;
            animation: gradientBG 15s ease infinite;
            color: var(--text-main);
            margin: 0;
            padding: 2rem;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            overflow: hidden;
        }
        @keyframes gradientBG {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
        .particles {
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            z-index: 0;
            pointer-events: none;
            background-image: radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.15) 0%, transparent 20%),
                              radial-gradient(circle at 80% 70%, rgba(168, 85, 247, 0.15) 0%, transparent 20%);
            animation: float 10s ease-in-out infinite alternate;
        }
        @keyframes float {
            0% { transform: translateY(0px) scale(1); }
            100% { transform: translateY(-20px) scale(1.05); }
        }
        
        .container {
            position: relative;
            z-index: 1;
            max-width: 720px;
            width: 100%;
            background: var(--card-bg);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid var(--border-color);
            border-radius: 30px;
            padding: 4rem;
            box-shadow: 0 30px 60px -12px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255,255,255,0.1);
            animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            opacity: 0;
            transform: translateY(40px);
        }
        @keyframes slideUp {
            to { opacity: 1; transform: translateY(0); }
        }
        h1 {
            font-size: 3.5rem;
            margin-top: 0;
            margin-bottom: 0.5rem;
            background: linear-gradient(135deg, #60a5fa 0%, #d8b4fe 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            text-align: center;
            font-weight: 800;
            letter-spacing: -1px;
        }
        p.subtitle {
            text-align: center;
            color: var(--text-muted);
            margin-bottom: 3.5rem;
            font-size: 1.25rem;
            font-weight: 300;
        }
        .grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 2.5rem;
            margin-bottom: 3rem;
        }
        .form-group {
            display: flex;
            flex-direction: column;
            gap: 0.8rem;
        }
        label {
            font-weight: 600;
            color: var(--text-muted);
            font-size: 0.9rem;
            letter-spacing: 1px;
            text-transform: uppercase;
        }
        select {
            background: rgba(0, 0, 0, 0.2);
            color: white;
            border: 1px solid var(--border-color);
            padding: 1.2rem;
            border-radius: 16px;
            font-size: 1.1rem;
            font-family: 'Outfit', sans-serif;
            font-weight: 500;
            outline: none;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            cursor: pointer;
            -webkit-appearance: none;
            appearance: none;
            box-shadow: inset 0 2px 4px rgba(0,0,0,0.2);
        }
        select:focus, select:hover {
            border-color: var(--primary-hover);
            background: rgba(0, 0, 0, 0.4);
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.2), inset 0 2px 4px rgba(0,0,0,0.2);
            transform: translateY(-2px);
        }
        .file-upload {
            border: 2px dashed rgba(96, 165, 250, 0.3);
            border-radius: 20px;
            padding: 4rem 2rem;
            text-align: center;
            cursor: pointer;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            background: rgba(255,255,255,0.01);
            margin-bottom: 3rem;
            position: relative;
            overflow: hidden;
        }
        .file-upload::before {
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background: linear-gradient(135deg, rgba(59,130,246,0.1) 0%, rgba(168,85,247,0.1) 100%);
            opacity: 0;
            transition: opacity 0.4s;
        }
        .file-upload:hover::before {
            opacity: 1;
        }
        .file-upload:hover, .file-upload.dragover {
            border-color: var(--primary-hover);
            transform: scale(1.03);
            box-shadow: var(--glow);
        }
        .file-upload h3 {
            position: relative;
            z-index: 1;
            margin-bottom: 0.5rem;
            font-size: 1.4rem;
            font-weight: 600;
        }
        .file-upload p {
            position: relative;
            z-index: 1;
            color: var(--text-muted);
            margin-top: 0;
            font-size: 1.05rem;
            font-weight: 300;
        }
        .btn {
            background: linear-gradient(135deg, #3b82f6 0%, #a855f7 100%);
            color: white;
            border: none;
            padding: 1.4rem 2.5rem;
            border-radius: 18px;
            font-size: 1.3rem;
            font-family: 'Outfit', sans-serif;
            font-weight: 600;
            cursor: pointer;
            width: 100%;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 12px 30px -10px rgba(168, 85, 247, 0.6);
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 12px;
            position: relative;
            overflow: hidden;
        }
        .btn::after {
            content: '';
            position: absolute;
            top: -50%; left: -50%;
            width: 200%; height: 200%;
            background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 60%);
            opacity: 0;
            transition: opacity 0.4s;
            transform: scale(0.5);
        }
        .btn:hover:not(:disabled) {
            transform: translateY(-4px) scale(1.02);
            box-shadow: 0 20px 40px -10px rgba(168, 85, 247, 0.8);
        }
        .btn:hover:not(:disabled)::after {
            opacity: 1;
            transform: scale(1);
        }
        .btn:disabled {
            opacity: 0.4;
            cursor: not-allowed;
            background: #334155;
            box-shadow: none;
        }
        .file-info {
            position: relative;
            z-index: 1;
            margin-top: 1.5rem;
            color: #6ee7b7;
            font-weight: 600;
            font-size: 1.15rem;
            display: none;
            background: rgba(16, 185, 129, 0.15);
            padding: 0.8rem 1.2rem;
            border-radius: 10px;
            border: 1px solid rgba(16, 185, 129, 0.3);
            animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        @keyframes popIn {
            0% { transform: scale(0.8); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
        }
        .upload-icon {
            font-size: 4rem;
            margin-bottom: 1rem;
            display: inline-block;
            transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
            position: relative;
            z-index: 1;
            filter: drop-shadow(0 10px 15px rgba(0,0,0,0.3));
        }
        .file-upload:hover .upload-icon {
            transform: translateY(-10px) scale(1.1);
        }
    </style>
</head>
<body>
    <div class="particles"></div>
    <div class="container">
        <h1>Agent Migrator</h1>
        <p class="subtitle">Transfer context and memory between AIs like magic ✨</p>
        
        <div class="grid">
            <div class="form-group">
                <label for="source">Origin AI</label>
                <select id="source">
                    <option value="Claude">🤖 Claude</option>
                    <option value="Gemini">✨ Gemini</option>
                    <option value="Copilot">🚁 Copilot</option>
                </select>
            </div>
            <div class="form-group">
                <label for="target">Target AI</label>
                <select id="target">
                    <option value="Gemini">✨ Gemini</option>
                    <option value="Claude">🤖 Claude</option>
                    <option value="Copilot">🚁 Copilot</option>
                </select>
            </div>
        </div>

        <div class="file-upload" id="drop-zone">
            <span class="upload-icon">✨</span>
            <h3>Click to select JSON file</h3>
            <p>Upload the current configuration of your agent</p>
            <div class="file-info" id="file-info"></div>
        </div>

        <button class="btn" id="migrate-btn" disabled><span>Migrate Agent</span> 🚀</button>
    </div>

    <script>
        const vscode = acquireVsCodeApi();
        
        const dropZone = document.getElementById('drop-zone');
        const migrateBtn = document.getElementById('migrate-btn');
        const fileInfo = document.getElementById('file-info');
        const sourceSelect = document.getElementById('source');
        const targetSelect = document.getElementById('target');
        
        let selectedFileContent = null;
        let selectedFilePath = null;

        dropZone.addEventListener('click', () => {
            vscode.postMessage({ command: 'selectFile' });
        });

        migrateBtn.addEventListener('click', () => {
            if (selectedFileContent) {
                migrateBtn.style.transform = 'scale(0.95)';
                setTimeout(() => { migrateBtn.style.transform = ''; }, 150);
                
                vscode.postMessage({
                    command: 'migrate',
                    sourceFormat: sourceSelect.value,
                    targetFormat: targetSelect.value,
                    fileContent: selectedFileContent,
                    filePath: selectedFilePath
                });
            }
        });

        window.addEventListener('message', event => {
            const message = event.data;
            switch (message.command) {
                case 'fileSelected':
                    selectedFileContent = message.fileContent;
                    selectedFilePath = message.filePath;
                    fileInfo.style.display = 'inline-block';
                    fileInfo.textContent = '✅ Ready: ' + message.fileName;
                    migrateBtn.disabled = false;
                    dropZone.style.borderColor = '#34d399';
                    break;
            }
        });
    </script>
</body>
</html>
    `;
}
