import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    console.log('Simple JSX Detector is now active!');
    vscode.window.showInformationMessage('Simple JSX Detector is now active!');
    
    // Create output channel for debugging
    const outputChannel = vscode.window.createOutputChannel('JSX Detector Debug');
    outputChannel.show();
    outputChannel.appendLine('Simple JSX Detector is now active!');

    // Create a simple decoration type
    const jsxDecorationType = vscode.window.createTextEditorDecorationType({
        after: {
            contentText: ' → JSX',
            color: 'blue',
            fontWeight: 'bold'
        }
    });

    // Function to update decorations
    function updateDecorations(editor: vscode.TextEditor) {
        const document = editor.document;
        const fileName = document.fileName;
        
        console.log(`Updating decorations for: ${fileName}`);
        outputChannel.appendLine(`Updating decorations for: ${fileName}`);
        
        if (!fileName.endsWith('.tsx') && !fileName.endsWith('.jsx')) {
            outputChannel.appendLine('Not a TSX/JSX file, skipping');
            return;
        }

        const decorations: vscode.DecorationOptions[] = [];
        const text = document.getText();
        const lines = text.split('\n');

        // Find all JSX elements with their boundaries
        const jsxElements: Array<{
            name: string,
            startLine: number,
            startChar: number,
            endLine: number,
            endChar: number,
            isSelfClosing: boolean,
            depth: number
        }> = [];

        // First pass: find all opening tags
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const jsxRegex = /<(\w+)/g;
            let match;
            
            while ((match = jsxRegex.exec(line)) !== null) {
                const elementName = match[1];
                const elementStart = match.index;
                
                // Skip TypeScript generics and other false positives
                if (elementName.includes('Props') || 
                    elementName.includes('Type') || 
                    elementName.includes('Interface') ||
                    elementName.includes('Filters') ||
                    elementName.includes('AllStations') ||
                    elementName === 'string' ||
                    elementName === 'number' ||
                    elementName === 'boolean' ||
                    elementName === 'any' ||
                    elementName === 'void' ||
                    elementName === 'null' ||
                    elementName === 'undefined') {
                    continue;
                }
                
                // Check if it's self-closing
                const isSelfClosing = line.includes('/>');
                
                // Find the closing tag (if not self-closing)
                let endLine = i;
                let endChar = line.length;
                
                if (!isSelfClosing) {
                    // Look for closing tag in the same line or subsequent lines
                    const closingTag = `</${elementName}>`;
                    let found = false;
                    
                    // Check current line first
                    const currentLineClosingIndex = line.indexOf(closingTag);
                    if (currentLineClosingIndex !== -1) {
                        endChar = currentLineClosingIndex + closingTag.length;
                        found = true;
                    } else {
                        // Look in subsequent lines (limit to 50 lines to avoid infinite search)
                        const maxSearchLines = Math.min(i + 50, lines.length);
                        for (let j = i + 1; j < maxSearchLines; j++) {
                            const nextLine = lines[j];
                            const nextLineClosingIndex = nextLine.indexOf(closingTag);
                            if (nextLineClosingIndex !== -1) {
                                endLine = j;
                                endChar = nextLineClosingIndex + closingTag.length;
                                found = true;
                                break;
                            }
                        }
                    }
                    
                    if (!found) {
                        // If no closing tag found, assume it's self-closing
                        endChar = line.length;
                    }
                }
                
                // Better depth calculation - count opening tags minus closing tags
                const textBefore = text.substring(0, text.indexOf(line) + elementStart);
                const openingTags = (textBefore.match(/<\w+/g) || []).length;
                const closingTags = (textBefore.match(/<\/\w+>/g) || []).length;
                const depth = Math.max(0, openingTags - closingTags);
                
                jsxElements.push({
                    name: elementName,
                    startLine: i,
                    startChar: elementStart,
                    endLine: endLine,
                    endChar: endChar,
                    isSelfClosing: isSelfClosing,
                    depth: depth
                });
            }
        }

        // Debug: show all found elements
        outputChannel.appendLine(`Found ${jsxElements.length} JSX elements:`);
        jsxElements.forEach((element, index) => {
            outputChannel.appendLine(`  ${index + 1}. ${element.name} (line ${element.startLine + 1}-${element.endLine + 1}, depth ${element.depth}, self-closing: ${element.isSelfClosing})`);
        });

        // Create decorations for each JSX element
        jsxElements.forEach((element, index) => {
            const startPosition = new vscode.Position(element.startLine, element.startChar);
            const endPosition = new vscode.Position(element.startLine, element.startChar + element.name.length + 1);
            const range = new vscode.Range(startPosition, endPosition);
            
            // Create beautiful ASCII art tree
            const asciiTree = createASCIIElementTree(element, jsxElements);
            outputChannel.appendLine(`Creating decoration for ${element.name}: ${asciiTree}`);
            
            decorations.push({
                range,
                renderOptions: {
                    after: {
                        contentText: asciiTree,
                        color: element.name[0] === element.name[0].toUpperCase() ? '#10b981' : '#3b82f6',
                        fontWeight: 'bold'
                    }
                }
            });
        });

        console.log(`Applying ${decorations.length} decorations`);
        outputChannel.appendLine(`Applying ${decorations.length} decorations`);
        
        // Show all elements that will be decorated
        decorations.forEach((dec, index) => {
            const line = editor.document.lineAt(dec.range.start.line);
            const elementText = line.text.substring(dec.range.start.character, dec.range.end.character);
            outputChannel.appendLine(`  ${index + 1}. ${elementText}`);
        });
        
        editor.setDecorations(jsxDecorationType, decorations);
    }

    // Update decorations when document changes
    const disposable = vscode.workspace.onDidChangeTextDocument((event) => {
        const editor = vscode.window.activeTextEditor;
        if (editor && editor.document === event.document) {
            updateDecorations(editor);
        }
    });

    // Update decorations when active editor changes
    const editorChangeDisposable = vscode.window.onDidChangeActiveTextEditor((editor) => {
        if (editor) {
            updateDecorations(editor);
        }
    });

    // Update decorations for current editor
    const currentEditor = vscode.window.activeTextEditor;
    if (currentEditor) {
        updateDecorations(currentEditor);
    }

    context.subscriptions.push(disposable, editorChangeDisposable);
}

// Function to create beautiful ASCII art tree for JSX elements
function createASCIIElementTree(element: any, allElements: any[]): string {
    try {
        const isComponent = element.name[0] === element.name[0].toUpperCase();
        const icon = isComponent ? '⚛' : '▢';
        
        // Find direct children of this element
        const children = allElements.filter(child => 
            child.startLine > element.startLine && 
            child.startLine < element.endLine &&
            child.depth === element.depth + 1
        );
        
        if (children.length === 0) {
            // No children - simple element
            if (element.isSelfClosing) {
                return ` → ${icon} ${element.name}`;
            } else {
                return ` → ${icon} ${element.name}`;
            }
        } else {
            // Has children - show tree structure
            let tree = ` → ${icon} ${element.name}\n`;
            
            children.forEach((child, index) => {
                const isLast = index === children.length - 1;
                const connector = isLast ? '└─' : '├─';
                const childIcon = child.name[0] === child.name[0].toUpperCase() ? '⚛' : '▢';
                tree += `    ${connector} ${childIcon} ${child.name}\n`;
            });
            
            return tree;
        }
    } catch (error) {
        return ` → ${element.name}`;
    }
}

export function deactivate() {}
