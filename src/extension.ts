import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { ReturnDetector } from './returnDetector';

// Load custom element configuration
function loadElementConfig(): { components: string[], htmlElements: string[] } {
    try {
        const configPath = path.join(__dirname, '..', 'element-config.json');
        const configData = fs.readFileSync(configPath, 'utf8');
        const config = JSON.parse(configData);
        
        return {
            components: config.customElements.components || [],
            htmlElements: config.customElements.htmlElements || []
        };
    } catch (error) {
        console.log('Could not load element config, using defaults');
        return {
            components: [],
            htmlElements: []
        };
    }
}

export function activate(context: vscode.ExtensionContext) {
    console.log('Gulf Return Detector extension is now active!');
    vscode.window.showInformationMessage('Gulf Return Detector is now active!');

    const returnDetector = new ReturnDetector();
    const elementConfig = loadElementConfig();
    console.log('Loaded element config components:', elementConfig.components.slice(0, 10)); // Show first 10 components
    
    // SUPER SIMPLE TEST: Just show a message when any document changes
    const disposable = vscode.workspace.onDidChangeTextDocument((event) => {
        console.log('Document changed:', event.document.fileName);
        vscode.window.showInformationMessage('Document changed: ' + event.document.fileName);
    });
    context.subscriptions.push(disposable);
    
    // Create professional decoration types for different return styles
    const simpleReturnDecorationType = vscode.window.createTextEditorDecorationType({
        backgroundColor: 'rgba(99, 102, 241, 0.15)', // Indigo background for simple returns
        border: '2px solid rgba(99, 102, 241, 0.3)',
        borderRadius: '6px',
        overviewRulerColor: 'rgba(99, 102, 241, 0.8)',
        overviewRulerLane: vscode.OverviewRulerLane.Right,
        before: {
            contentText: '🔄',
            color: 'rgba(99, 102, 241, 0.9)',
            fontWeight: 'bold',
            margin: '0 8px 0 0'
        },
        after: {
            color: 'rgba(99, 102, 241, 0.8)',
            fontWeight: '600',
            fontStyle: 'italic',
            margin: '0 0 0 12px'
        }
    });

    const componentReturnDecorationType = vscode.window.createTextEditorDecorationType({
        backgroundColor: 'rgba(16, 185, 129, 0.15)', // Emerald background for component returns
        border: '2px solid rgba(16, 185, 129, 0.3)',
        borderRadius: '6px',
        overviewRulerColor: 'rgba(16, 185, 129, 0.8)',
        overviewRulerLane: vscode.OverviewRulerLane.Right,
        before: {
            contentText: '⚛️',
            color: 'rgba(16, 185, 129, 0.9)',
            fontWeight: 'bold',
            margin: '0 8px 0 0'
        },
        after: {
            color: 'rgba(16, 185, 129, 0.8)',
            fontWeight: '600',
            fontStyle: 'italic',
            margin: '0 0 0 12px'
        }
    });

    const fragmentReturnDecorationType = vscode.window.createTextEditorDecorationType({
        backgroundColor: 'rgba(245, 158, 11, 0.15)', // Amber background for fragments
        border: '2px solid rgba(245, 158, 11, 0.3)',
        borderRadius: '6px',
        overviewRulerColor: 'rgba(245, 158, 11, 0.8)',
        overviewRulerLane: vscode.OverviewRulerLane.Right,
        before: {
            contentText: '📦',
            color: 'rgba(245, 158, 11, 0.9)',
            fontWeight: 'bold',
            margin: '0 8px 0 0'
        },
        after: {
            color: 'rgba(245, 158, 11, 0.8)',
            fontWeight: '600',
            fontStyle: 'italic',
            margin: '0 0 0 12px'
        }
    });

    const nullReturnDecorationType = vscode.window.createTextEditorDecorationType({
        backgroundColor: 'rgba(107, 114, 128, 0.15)', // Gray background for null returns
        border: '2px solid rgba(107, 114, 128, 0.3)',
        borderRadius: '6px',
        overviewRulerColor: 'rgba(107, 114, 128, 0.8)',
        overviewRulerLane: vscode.OverviewRulerLane.Right,
        before: {
            contentText: '∅',
            color: 'rgba(107, 114, 128, 0.9)',
            fontWeight: 'bold',
            margin: '0 8px 0 0'
        },
        after: {
            contentText: ' → renders nothing',
            color: 'rgba(107, 114, 128, 0.8)',
            fontWeight: '600',
            fontStyle: 'italic',
            margin: '0 0 0 12px'
        }
    });

    // Advanced: Component Tree Visualization
    const componentTreeDecorationType = vscode.window.createTextEditorDecorationType({
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        border: '2px solid rgba(34, 197, 94, 0.3)',
        borderRadius: '8px',
        before: {
            contentText: '🌳',
            color: 'rgba(34, 197, 94, 0.9)',
            fontWeight: 'bold',
            margin: '0 8px 0 0'
        },
        after: {
            contentText: ' → Component Tree',
            color: 'rgba(34, 197, 94, 0.8)',
            fontWeight: '600',
            margin: '0 0 0 12px'
        }
    });

    // Advanced: Clickable Navigation
    const clickableDecorationType = vscode.window.createTextEditorDecorationType({
        cursor: 'pointer',
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
        border: '2px solid rgba(168, 85, 247, 0.3)',
        borderRadius: '6px',
        after: {
            contentText: ' 🔗',
            color: 'rgba(168, 85, 247, 0.8)',
            fontWeight: 'bold'
        }
    });

    // ELEGANT HIERARCHICAL SYSTEM: Parent Components (Bold & Prominent)
    const parentComponentDecorationType = vscode.window.createTextEditorDecorationType({
        backgroundColor: 'rgba(16, 185, 129, 0.2)', // Stronger emerald for parents
        border: '3px solid rgba(16, 185, 129, 0.6)',
        borderRadius: '8px',
        fontWeight: 'bold',
        before: {
            contentText: '👑',
            color: 'rgba(16, 185, 129, 1)',
            fontWeight: 'bold',
            margin: '0 8px 0 0'
        },
        after: {
            contentText: ' → PARENT COMPONENT',
            color: 'rgba(16, 185, 129, 0.9)',
            fontWeight: '700',
            margin: '0 0 0 12px'
        }
    });

    // ELEGANT HIERARCHICAL SYSTEM: Child Components (Subtle & Refined)
    const childComponentDecorationType = vscode.window.createTextEditorDecorationType({
        backgroundColor: 'rgba(99, 102, 241, 0.15)', // Softer indigo for children
        border: '2px dashed rgba(99, 102, 241, 0.4)',
        borderRadius: '6px',
        fontWeight: 'normal',
        before: {
            contentText: '👶',
            color: 'rgba(99, 102, 241, 0.8)',
            fontWeight: 'normal',
            margin: '0 6px 0 0'
        },
        after: {
            contentText: ' → child component',
            color: 'rgba(99, 102, 241, 0.7)',
            fontWeight: '500',
            fontStyle: 'italic',
            margin: '0 0 0 10px'
        }
    });

    // ELEGANT HIERARCHICAL SYSTEM: Nested Child Components (Ultra Subtle)
    const nestedChildDecorationType = vscode.window.createTextEditorDecorationType({
        backgroundColor: 'rgba(245, 158, 11, 0.1)', // Very subtle amber
        border: '1px dotted rgba(245, 158, 11, 0.3)',
        borderRadius: '4px',
        fontWeight: 'lighter',
        before: {
            contentText: '🌱',
            color: 'rgba(245, 158, 11, 0.6)',
            fontWeight: 'lighter',
            margin: '0 4px 0 0'
        },
        after: {
            contentText: ' → nested',
            color: 'rgba(245, 158, 11, 0.6)',
            fontWeight: '400',
            fontStyle: 'italic',
            margin: '0 0 0 8px'
        }
    });

    // ELEGANT HIERARCHICAL SYSTEM: Root Components (Ultra Bold & Royal)
    const rootComponentDecorationType = vscode.window.createTextEditorDecorationType({
        backgroundColor: 'rgba(220, 38, 127, 0.2)', // Royal pink for roots
        border: '4px solid rgba(220, 38, 127, 0.7)',
        borderRadius: '10px',
        fontWeight: '900',
        before: {
            contentText: '🏆',
            color: 'rgba(220, 38, 127, 1)',
            fontWeight: '900',
            margin: '0 10px 0 0'
        },
        after: {
            contentText: ' → ROOT COMPONENT',
            color: 'rgba(220, 38, 127, 1)',
            fontWeight: '900',
            margin: '0 0 0 15px'
        }
    });

    // VISUAL RETURN PREVIEW: Instant visual understanding
    const visualReturnPreviewType = vscode.window.createTextEditorDecorationType({
        backgroundColor: 'rgba(59, 130, 246, 0.1)', // Blue background
        border: '2px solid rgba(59, 130, 246, 0.4)',
        borderRadius: '6px',
        fontWeight: 'bold',
        after: {
            color: 'rgba(59, 130, 246, 0.9)',
            fontWeight: 'bold',
            margin: '0 0 0 15px'
        }
    });

    // VISUAL RETURN PREVIEW: Component-heavy returns
    const componentHeavyReturnType = vscode.window.createTextEditorDecorationType({
        backgroundColor: 'rgba(16, 185, 129, 0.15)', // Green for components
        border: '2px solid rgba(16, 185, 129, 0.5)',
        borderRadius: '6px',
        fontWeight: 'bold',
        after: {
            color: 'rgba(16, 185, 129, 0.9)',
            fontWeight: 'bold',
            margin: '0 0 0 15px'
        }
    });

    // VISUAL RETURN PREVIEW: Element-heavy returns
    const elementHeavyReturnType = vscode.window.createTextEditorDecorationType({
        backgroundColor: 'rgba(245, 158, 11, 0.15)', // Amber for elements
        border: '2px solid rgba(245, 158, 11, 0.5)',
        borderRadius: '6px',
        fontWeight: 'bold',
        after: {
            color: 'rgba(245, 158, 11, 0.9)',
            fontWeight: 'bold',
            margin: '0 0 0 15px'
        }
    });

    // VISUAL RETURN PREVIEW: Simple returns
    const simpleReturnPreviewType = vscode.window.createTextEditorDecorationType({
        backgroundColor: 'rgba(107, 114, 128, 0.1)', // Gray for simple
        border: '1px solid rgba(107, 114, 128, 0.3)',
        borderRadius: '4px',
        fontWeight: 'normal',
        after: {
            color: 'rgba(107, 114, 128, 0.8)',
            fontWeight: 'normal',
            margin: '0 0 0 10px'
        }
    });

    // INLINE JSX TREE ART: Show trees right next to JSX elements
    const inlineJSXTreeType = vscode.window.createTextEditorDecorationType({
        backgroundColor: 'rgba(59, 130, 246, 0.08)', // Very subtle blue
        border: '1px solid rgba(59, 130, 246, 0.2)',
        borderRadius: '4px',
        after: {
            color: 'rgba(59, 130, 246, 0.7)',
            fontWeight: 'normal',
            margin: '0 0 0 8px'
        }
    });

    // INLINE JSX TREE ART: Component elements
    const inlineComponentTreeType = vscode.window.createTextEditorDecorationType({
        backgroundColor: 'rgba(16, 185, 129, 0.08)', // Very subtle green
        border: '1px solid rgba(16, 185, 129, 0.2)',
        borderRadius: '4px',
        after: {
            color: 'rgba(16, 185, 129, 0.7)',
            fontWeight: 'normal',
            margin: '0 0 0 8px'
        }
    });

    // ELEGANT HIERARCHICAL ANALYSIS: Advanced Component Relationship Detection
    function analyzeComponentHierarchy(content: string, functionName?: string): { 
        components: string[], 
        depth: number, 
        complexity: 'low' | 'medium' | 'high',
        hasNestedComponents: boolean,
        hierarchy: 'root' | 'parent' | 'child' | 'nested',
        componentRelationships: { parent: string, children: string[] }[]
    } {
        const components: string[] = [];
        let depth = 0;
        let maxDepth = 0;
        let hasNestedComponents = false;

        // Advanced parser to find component usage with relationships
        const componentRegex = /<(\w+[A-Z]\w*)/g;
        let match;
        while ((match = componentRegex.exec(content)) !== null) {
            components.push(match[1]);
        }

        // Calculate nesting depth and relationships
        const openTags = content.match(/</g) || [];
        const closeTags = content.match(/<\//g) || [];
        depth = openTags.length - closeTags.length;
        maxDepth = Math.max(maxDepth, depth);

        // Check for nested components
        hasNestedComponents = components.length > 1;

        // Determine complexity
        let complexity: 'low' | 'medium' | 'high' = 'low';
        if (components.length > 3 || maxDepth > 3) complexity = 'high';
        else if (components.length > 1 || maxDepth > 1) complexity = 'medium';

        // ELEGANT HIERARCHY DETECTION
        let hierarchy: 'root' | 'parent' | 'child' | 'nested' = 'child';
        
        // Root components: Main page/container components
        if (functionName && (
            functionName.includes('Page') || 
            functionName.includes('App') || 
            functionName.includes('Main') ||
            functionName.includes('Layout') ||
            functionName.includes('Container')
        )) {
            hierarchy = 'root';
        }
        // Parent components: Components that contain other components
        else if (components.length > 2 || maxDepth > 2) {
            hierarchy = 'parent';
        }
        // Nested components: Deeply nested components
        else if (maxDepth > 3) {
            hierarchy = 'nested';
        }
        // Child components: Simple components
        else {
            hierarchy = 'child';
        }

        // Analyze component relationships
        const componentRelationships: { parent: string, children: string[] }[] = [];
        if (components.length > 1) {
            // Simple relationship detection - first component is often parent
            componentRelationships.push({
                parent: components[0] || 'Unknown',
                children: components.slice(1)
            });
        }

        return { 
            components, 
            depth: maxDepth, 
            complexity, 
            hasNestedComponents,
            hierarchy,
            componentRelationships
        };
    }

    // ASCII TREE ART: Create elegant tree structures for component hierarchy
    function createASCIIComponentTree(content: string): { 
        asciiTree: string, 
        elementCount: number, 
        componentCount: number,
        hasText: boolean,
        hasProps: boolean
    } {
        const trimmed = content.trim();
        
        if (trimmed === 'null' || trimmed === 'undefined') {
            return { 
                asciiTree: '∅', 
                elementCount: 0, 
                componentCount: 0, 
                hasText: false, 
                hasProps: false 
            };
        }
        
        // Advanced JSX parser to build tree structure
        const jsxElements: Array<{name: string, isComponent: boolean, level: number, hasProps: boolean, children: number}> = [];
        let hasText = false;
        let hasProps = false;
        
        // Parse JSX with proper nesting
        const stack: Array<{name: string, isComponent: boolean, level: number, hasProps: boolean}> = [];
        let currentLevel = 0;
        
        // Find all JSX tags in order
        const tagRegex = /<\/?(\w+)([^>]*)>/g;
        let match;
        
        while ((match = tagRegex.exec(trimmed)) !== null) {
            const fullTag = match[0];
            const elementName = match[1];
            const attributes = match[2];
            const isClosing = fullTag.startsWith('</');
            const isSelfClosing = fullTag.endsWith('/>');
            const isComponent = elementName[0] === elementName[0].toUpperCase();
            
            if (!isClosing) {
                // Opening tag
                const element = {
                    name: elementName,
                    isComponent,
                    level: currentLevel,
                    hasProps: attributes.trim().length > 0,
                    children: 0
                };
                
                jsxElements.push(element);
                stack.push(element);
                
                if (attributes.trim()) {
                    hasProps = true;
                }
                
                if (!isSelfClosing) {
                    currentLevel++;
                }
            } else {
                // Closing tag
                if (stack.length > 0) {
                    const parent = stack[stack.length - 1];
                    if (parent.name === elementName) {
                        stack.pop();
                        currentLevel = Math.max(0, currentLevel - 1);
                    }
                }
            }
        }
        
        // Check for text content
        const textContent = trimmed.replace(/<[^>]*>/g, '').trim();
        if (textContent) {
            hasText = true;
        }
        
        // Create elegant ASCII tree
        let asciiTree = '';
        
        if (jsxElements.length === 0) {
            asciiTree = '└─ (empty)';
        } else if (jsxElements.length === 1) {
            const element = jsxElements[0];
            const icon = element.isComponent ? '⚛' : '▢';
            asciiTree = `└─ ${icon} ${element.name}`;
        } else {
            // Build hierarchical tree structure
            const processedElements = new Set<string>();
            
            for (let i = 0; i < jsxElements.length; i++) {
                const element = jsxElements[i];
                const elementKey = `${element.name}-${element.level}`;
                
                if (processedElements.has(elementKey)) {
                    continue;
                }
                processedElements.add(elementKey);
                
                const icon = element.isComponent ? '⚛' : '▢';
                const isLast = i === jsxElements.length - 1;
                
                if (element.level === 0) {
                    // Root element
                    asciiTree += `└─ ${icon} ${element.name}`;
                } else {
                    // Child elements with proper indentation
                    const indent = '  '.repeat(element.level - 1);
                    const connector = isLast ? '└─' : '├─';
                    asciiTree += `\n${indent}${connector} ${icon} ${element.name}`;
                }
            }
        }
        
        // Add indicators (minimal)
        if (hasText) asciiTree += ' 📝';
        if (hasProps) asciiTree += ' ⚙';
        
        return {
            asciiTree: asciiTree || '└─ (unknown)',
            elementCount: jsxElements.filter(e => !e.isComponent).length,
            componentCount: jsxElements.filter(e => e.isComponent).length,
            hasText,
            hasProps
        };
    }

    // JSX STRUCTURE TREE: Create tree showing JSX element structure like your example
    function createJSXStructureTree(jsxContent: string): string {
        const lines = jsxContent.split('\n');
        let tree = '';
        let indentLevel = 0;
        let currentElement = '';
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            
            if (line.startsWith('<') && !line.startsWith('</')) {
                // Opening tag
                const tagMatch = line.match(/<(\w+)/);
                if (tagMatch) {
                    const elementName = tagMatch[1];
                    const isComponent = elementName[0] === elementName[0].toUpperCase();
                    const icon = isComponent ? '⚛' : '▢';
                    currentElement = elementName;
                    
                    // Show opening tag
                    tree += `${'  '.repeat(indentLevel)}└─ ${icon} ${elementName}\n`;
                    indentLevel++;
                }
            } else if (line.startsWith('</')) {
                // Closing tag
                const closeTagMatch = line.match(/<\/(\w+)/);
                if (closeTagMatch) {
                    const elementName = closeTagMatch[1];
                    indentLevel = Math.max(0, indentLevel - 1);
                    // Show closing tag
                    tree += `${'  '.repeat(indentLevel)}└─ /${elementName}\n`;
                }
            } else if (line && !line.startsWith('<')) {
                // Text content - show as content lines
                const textContent = line.substring(0, 15) + (line.length > 15 ? '...' : '');
                tree += `${'  '.repeat(indentLevel)}├─ "${textContent}"\n`;
            }
        }
        
        return tree.trim();
    }

    // SIMPLE JSX ELEMENT TREE: For individual elements like <input>
    function createSimpleElementTree(elementName: string, isComponent: boolean): string {
        const icon = isComponent ? '⚛' : '▢';
        return `└─ ${icon} ${elementName}\n  ├─ opening tag\n  ├─ content area\n  └─ closing tag`;
    }

    // ENHANCED JSX STRUCTURE: Show the actual structure like your example
    function createEnhancedJSXTree(elementName: string, isComponent: boolean, depth: number = 0): string {
        const icon = isComponent ? '⚛' : '▢';
        const indent = '  '.repeat(depth);
        return `${indent}└─ ${icon} ${elementName}\n${indent}  ├─ <${elementName}>\n${indent}  ├─ content\n${indent}  └─ </${elementName}>`;
    }

    // NESTED COMPONENT TREE: Show nested structure with depth
    function createNestedComponentTree(elementName: string, isComponent: boolean, depth: number): string {
        const icon = isComponent ? '⚛' : '▢';
        const indent = '  '.repeat(depth);
        const connector = depth === 0 ? '└─' : '├─';
        return `${indent}${connector} ${icon} ${elementName} (depth: ${depth})`;
    }

    // SIMPLE JSX DETECTION: Direct line-by-line parsing
    function findJSXElementsInDocument(document: vscode.TextDocument, returnInfo: any): Array<{
        element: string,
        isComponent: boolean,
        position: vscode.Position,
        range: vscode.Range,
        treePreview: string
    }> {
        const jsxElements: Array<{
            element: string,
            isComponent: boolean,
            position: vscode.Position,
            range: vscode.Range,
            treePreview: string
        }> = [];

        const returnLine = returnInfo.line - 1; // Convert to 0-based
        
        // Look through the next 30 lines for JSX elements
        const maxLines = Math.min(returnLine + 100, document.lineCount);
        
        for (let lineIndex = returnLine; lineIndex < maxLines; lineIndex++) {
            const lineText = document.lineAt(lineIndex).text;
            
            // Skip if we hit a closing brace (end of function)
            if (lineText.trim() === '}' && lineIndex > returnLine) {
                break;
            }
            
            // Find JSX elements in this line
            const jsxRegex = /<(\w+)([^>]*?)(?:\s*\/>|>)/g;
            let match;
            
            while ((match = jsxRegex.exec(lineText)) !== null) {
                const elementName = match[1];
                const fullMatch = match[0];
                
                // Check if it's a component using custom config or capitalization
                const isComponent = elementConfig.components.includes(elementName) || 
                                  elementName[0] === elementName[0].toUpperCase();
                
                // Get exact position in document
                const elementStart = match.index;
                const elementEnd = match.index + fullMatch.length;
                
                const startPosition = new vscode.Position(lineIndex, elementStart);
                const endPosition = new vscode.Position(lineIndex, elementEnd);
                const range = new vscode.Range(startPosition, endPosition);
                
                // Create simple tree preview
                const treePreview = createSimpleElementTree(elementName, isComponent);
                
                jsxElements.push({
                    element: elementName,
                    isComponent,
                    position: startPosition,
                    range,
                    treePreview
                });
            }
        }
        
        return jsxElements;
    }

    // Function to analyze JSX content and create beautiful descriptions
    function analyzeJSXContent(content: string): { type: string; description: string; emoji: string } {
        const trimmed = content.trim();
        
        if (trimmed === 'null' || trimmed === 'undefined') {
            return { type: 'null', description: 'renders nothing', emoji: '∅' };
        }
        
        if (trimmed.startsWith('(')) {
            const inner = trimmed.slice(1, -1).trim();
            return analyzeJSXContent(inner);
        }
        
        if (trimmed.startsWith('<>') || trimmed.includes('React.Fragment')) {
            return { type: 'fragment', description: 'Fragment container', emoji: '📦' };
        }
        
        if (trimmed.startsWith('<')) {
            // Extract component/element name
            const match = trimmed.match(/<(\w+)/);
            if (match) {
                const elementName = match[1];
                const isComponent = elementName[0] === elementName[0].toUpperCase();
                
                if (isComponent) {
                    return { 
                        type: 'component', 
                        description: `<${elementName}> component`, 
                        emoji: '⚛️' 
                    };
                } else {
                    const elementEmojis: { [key: string]: string } = {
                        'div': '📦', 'span': '📝', 'p': '📄', 'h1': '📋', 'h2': '📋', 'h3': '📋',
                        'button': '🔘', 'input': '📝', 'form': '📋', 'img': '🖼️', 'a': '🔗',
                        'ul': '📋', 'ol': '📋', 'li': '•', 'nav': '🧭', 'header': '📋',
                        'footer': '📋', 'section': '📦', 'article': '📄', 'main': '📋'
                    };
                    
                    return { 
                        type: 'element', 
                        description: `<${elementName}> element`, 
                        emoji: elementEmojis[elementName] || '🏷️' 
                    };
                }
            }
        }
        
        return { type: 'simple', description: 'simple value', emoji: '🔄' };
    }

    // Function to update decorations with professional styling
    function updateDecorations(editor: vscode.TextEditor) {
        if (!editor) return;

        const document = editor.document;
        const fileName = document.fileName;

        // Only process TSX and JSX files
        if (!fileName.endsWith('.tsx') && !fileName.endsWith('.jsx')) {
            return;
        }

        const text = document.getText();
        const returns = returnDetector.detectReturns(text, fileName);

        const simpleReturns: vscode.DecorationOptions[] = [];
        const componentReturns: vscode.DecorationOptions[] = [];
        const fragmentReturns: vscode.DecorationOptions[] = [];
        const nullReturns: vscode.DecorationOptions[] = [];
        const componentTreeReturns: vscode.DecorationOptions[] = [];
        const clickableReturns: vscode.DecorationOptions[] = [];
        
        // ELEGANT HIERARCHICAL DECORATIONS
        const rootComponentReturns: vscode.DecorationOptions[] = [];
        const parentComponentReturns: vscode.DecorationOptions[] = [];
        const childComponentReturns: vscode.DecorationOptions[] = [];
        const nestedChildReturns: vscode.DecorationOptions[] = [];
        
        // VISUAL RETURN PREVIEW DECORATIONS
        const visualReturnPreviews: vscode.DecorationOptions[] = [];
        const componentHeavyReturns: vscode.DecorationOptions[] = [];
        const elementHeavyReturns: vscode.DecorationOptions[] = [];
        const simpleReturnPreviews: vscode.DecorationOptions[] = [];
        
        // INLINE JSX TREE DECORATIONS
        const inlineJSXTrees: vscode.DecorationOptions[] = [];
        const inlineComponentTrees: vscode.DecorationOptions[] = [];

        console.log(`Found ${returns.length} return statements in ${fileName}`);
        
        returns.forEach(returnInfo => {
            const line = returnInfo.line - 1; // Convert to 0-based indexing
            const lineText = document.lineAt(line).text;
            const returnIndex = lineText.indexOf('return');
            
            console.log(`Processing return at line ${line + 1}: ${lineText.trim()}`);
            
            if (returnIndex !== -1) {
                const startPos = new vscode.Position(line, returnIndex);
                const endPos = new vscode.Position(line, returnIndex + 6); // 'return' is 6 characters
                
                const analysis = analyzeJSXContent(returnInfo.content);
                const hierarchyAnalysis = analyzeComponentHierarchy(returnInfo.content, returnInfo.functionName);
                const asciiTree = createASCIIComponentTree(returnInfo.content);
                
                // ELEGANT HIERARCHICAL HOVER MESSAGE
                const hierarchyEmoji = {
                    'root': '🏆',
                    'parent': '👑', 
                    'child': '👶',
                    'nested': '🌱'
                };
                
                const hoverMessage = `**🎨 React Return Visualization**\n\n` +
                    `**Function:** \`${returnInfo.functionName || 'Anonymous'}\`\n` +
                    `**Renders:** ${analysis.emoji} ${analysis.description}\n` +
                    `**Type:** ${returnInfo.isJSX ? 'JSX Element' : 'JavaScript Value'}\n\n` +
                    `**👑 Component Hierarchy:**\n` +
                    `• Level: ${hierarchyEmoji[hierarchyAnalysis.hierarchy]} ${hierarchyAnalysis.hierarchy.toUpperCase()}\n` +
                    `• Components: ${hierarchyAnalysis.components.join(', ') || 'None'}\n` +
                    `• Nesting Depth: ${hierarchyAnalysis.depth}\n` +
                    `• Complexity: ${hierarchyAnalysis.complexity.toUpperCase()}\n` +
                    `• Nested Components: ${hierarchyAnalysis.hasNestedComponents ? 'Yes' : 'No'}\n\n` +
                    `**Content Preview:**\n\`\`\`jsx\n${returnInfo.content.substring(0, 200)}${returnInfo.content.length > 200 ? '\n...' : ''}\n\`\`\``;

                const decoration: vscode.DecorationOptions = {
                    range: new vscode.Range(startPos, endPos),
                    hoverMessage
                };

                // Advanced categorization with multiple visual layers
                const baseDecoration = {
                    ...decoration,
                    renderOptions: {
                        after: {
                            contentText: ` → ${analysis.description}`,
                        }
                    }
                };

                // Primary categorization
                switch (analysis.type) {
                    case 'component':
                        componentReturns.push(baseDecoration);
                        break;
                    case 'fragment':
                        fragmentReturns.push(baseDecoration);
                        break;
                    case 'null':
                        nullReturns.push(decoration);
                        break;
                    case 'element':
                        componentReturns.push(baseDecoration);
                        break;
                    default:
                        simpleReturns.push(baseDecoration);
                }

                // Advanced: Component Tree highlighting for complex returns
                if (hierarchyAnalysis.hasNestedComponents && hierarchyAnalysis.components.length > 1) {
                    componentTreeReturns.push({
                        ...decoration,
                        renderOptions: {
                            after: {
                                contentText: ` → ${hierarchyAnalysis.components.length} components (${hierarchyAnalysis.complexity})`,
                            }
                        }
                    });
                }

                // Advanced: Clickable navigation for components
                if (analysis.type === 'component' && hierarchyAnalysis.components.length > 0) {
                    clickableReturns.push({
                        ...decoration,
                        renderOptions: {
                            after: {
                                contentText: ` → Click to navigate to ${hierarchyAnalysis.components[0]}`,
                            }
                        }
                    });
                }

                // ELEGANT HIERARCHICAL CATEGORIZATION
                if (returnInfo.isJSX && analysis.type === 'component') {
                    switch (hierarchyAnalysis.hierarchy) {
                        case 'root':
                            rootComponentReturns.push({
                                ...decoration,
                                renderOptions: {
                                    after: {
                                        contentText: ` → ROOT COMPONENT (${hierarchyAnalysis.components.length} components)`,
                                    }
                                }
                            });
                            break;
                        case 'parent':
                            parentComponentReturns.push({
                                ...decoration,
                                renderOptions: {
                                    after: {
                                        contentText: ` → PARENT COMPONENT (${hierarchyAnalysis.components.length} children)`,
                                    }
                                }
                            });
                            break;
                        case 'child':
                            childComponentReturns.push({
                                ...decoration,
                                renderOptions: {
                                    after: {
                                        contentText: ` → child component (depth: ${hierarchyAnalysis.depth})`,
                                    }
                                }
                            });
                            break;
                        case 'nested':
                            nestedChildReturns.push({
                                ...decoration,
                                renderOptions: {
                                    after: {
                                        contentText: ` → nested (depth: ${hierarchyAnalysis.depth})`,
                                    }
                                }
                            });
                            break;
                    }
                }

                // ASCII TREE ART: Show elegant tree structure
                if (returnInfo.isJSX) {
                    const treeText = ` → ${asciiTree.asciiTree}`;
                    
                    if (asciiTree.componentCount > 0 && asciiTree.elementCount === 0) {
                        // Pure component return
                        componentHeavyReturns.push({
                            ...decoration,
                            renderOptions: {
                                after: {
                                    contentText: treeText,
                                }
                            }
                        });
                    } else if (asciiTree.elementCount > 0 && asciiTree.componentCount === 0) {
                        // Pure element return
                        elementHeavyReturns.push({
                            ...decoration,
                            renderOptions: {
                                after: {
                                    contentText: treeText,
                                }
                            }
                        });
                    } else if (asciiTree.componentCount > 0 || asciiTree.elementCount > 0) {
                        // Mixed return
                        visualReturnPreviews.push({
                            ...decoration,
                            renderOptions: {
                                after: {
                                    contentText: treeText,
                                }
                            }
                        });
                    } else {
                        // Simple return
                        simpleReturnPreviews.push({
                            ...decoration,
                            renderOptions: {
                                after: {
                                    contentText: treeText,
                                }
                            }
                        });
                    }
                } else {
                    // Non-JSX return
                    simpleReturnPreviews.push({
                        ...decoration,
                        renderOptions: {
                            after: {
                                contentText: ` → ${asciiTree.asciiTree}`,
                            }
                        }
                    });
                }

                // SIMPLE JSX TREE ART: Add trees right next to JSX elements
                if (returnInfo.isJSX) {
                    console.log(`Processing JSX return at line ${returnInfo.line}`);
                    
                    // Simple approach: scan the return line and next few lines for JSX elements
                    const returnLine = returnInfo.line - 1;
                    const maxLines = Math.min(returnLine + 100, document.lineCount);
                    
                    for (let lineIndex = returnLine; lineIndex < maxLines; lineIndex++) {
                        const lineText = document.lineAt(lineIndex).text;
                        
                        // Stop if we hit a closing brace
                        if (lineText.trim() === '}' && lineIndex > returnLine) {
                            break;
                        }
                        
                        // Find JSX elements in this line
                        const jsxRegex = /<(\w+)([^>]*?)(?:\s*\/>|>)/g;
                        let match;
                        
                        console.log(`Scanning line ${lineIndex + 1}: "${lineText}"`);
                        
                        // Check if this line contains Modal specifically
                        if (lineText.includes('Modal')) {
                            console.log(`🔍 Found Modal on line ${lineIndex + 1}: "${lineText}"`);
                        }
                        
                        while ((match = jsxRegex.exec(lineText)) !== null) {
                            const elementName = match[1];
                            
                            // Better component detection
                            const isInConfig = elementConfig.components.includes(elementName);
                            const isCapitalized = elementName[0] === elementName[0].toUpperCase();
                            const isComponent = isInConfig || isCapitalized;
                            
                            console.log(`Found JSX element: ${elementName}`);
                            console.log(`  - In config: ${isInConfig}`);
                            console.log(`  - Capitalized: ${isCapitalized}`);
                            console.log(`  - Is component: ${isComponent}`);
                            
                            // Special debugging for Modal
                            if (elementName === 'Modal') {
                                console.log(`🎯 MODAL DETECTED! Full match: "${match[0]}"`);
                            }
                            
                            // Create simple tree
                            const icon = isComponent ? '⚛' : '▢';
                            const treeText = ` → ${icon} ${elementName}`;
                            
                            // Get position
                            const elementStart = match.index;
                            const elementEnd = match.index + match[0].length;
                            
                            const startPosition = new vscode.Position(lineIndex, elementStart);
                            const endPosition = new vscode.Position(lineIndex, elementEnd);
                            const range = new vscode.Range(startPosition, endPosition);
                            
                            const inlineDecoration: vscode.DecorationOptions = {
                                range,
                                renderOptions: {
                                    after: {
                                        contentText: treeText,
                                    }
                                }
                            };

                            // Always add to component trees for now to test
                            inlineComponentTrees.push(inlineDecoration);
                            
                            console.log(`Added decoration for ${elementName}: ${treeText}`);
                        }
                    }
                }
            }
        });

        // Apply professional decorations with advanced features
        editor.setDecorations(simpleReturnDecorationType, simpleReturns);
        editor.setDecorations(componentReturnDecorationType, componentReturns);
        editor.setDecorations(fragmentReturnDecorationType, fragmentReturns);
        editor.setDecorations(nullReturnDecorationType, nullReturns);
        
        // Apply advanced decorations
        editor.setDecorations(componentTreeDecorationType, componentTreeReturns);
        editor.setDecorations(clickableDecorationType, clickableReturns);
        
        // Apply ELEGANT HIERARCHICAL decorations
        editor.setDecorations(rootComponentDecorationType, rootComponentReturns);
        editor.setDecorations(parentComponentDecorationType, parentComponentReturns);
        editor.setDecorations(childComponentDecorationType, childComponentReturns);
        editor.setDecorations(nestedChildDecorationType, nestedChildReturns);
        
        // Apply VISUAL RETURN PREVIEW decorations
        editor.setDecorations(visualReturnPreviewType, visualReturnPreviews);
        editor.setDecorations(componentHeavyReturnType, componentHeavyReturns);
        editor.setDecorations(elementHeavyReturnType, elementHeavyReturns);
        editor.setDecorations(simpleReturnPreviewType, simpleReturnPreviews);
        
        // Apply INLINE JSX TREE decorations
        editor.setDecorations(inlineJSXTreeType, inlineJSXTrees);
        editor.setDecorations(inlineComponentTreeType, inlineComponentTrees);
    }

    // Update decorations when editor changes
    const activeEditor = vscode.window.activeTextEditor;
    if (activeEditor) {
        updateDecorations(activeEditor);
    }

    // Listen for editor changes
    vscode.window.onDidChangeActiveTextEditor(editor => {
        if (editor) {
            updateDecorations(editor);
        }
    }, null, context.subscriptions);

    // Listen for document changes
    vscode.workspace.onDidChangeTextDocument(event => {
        const editor = vscode.window.activeTextEditor;
        if (editor && event.document === editor.document) {
            // Debounce to avoid too frequent updates
            setTimeout(() => updateDecorations(editor), 300);
        }
    }, null, context.subscriptions);

    // Optional: Add a command to toggle decorations
    const toggleCommand = vscode.commands.registerCommand('gulf-return-detector.toggle', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            // Clear all decorations
            editor.setDecorations(simpleReturnDecorationType, []);
            editor.setDecorations(componentReturnDecorationType, []);
            editor.setDecorations(fragmentReturnDecorationType, []);
            editor.setDecorations(nullReturnDecorationType, []);
            editor.setDecorations(componentTreeDecorationType, []);
            editor.setDecorations(clickableDecorationType, []);
            
            // Clear ELEGANT HIERARCHICAL decorations
            editor.setDecorations(rootComponentDecorationType, []);
            editor.setDecorations(parentComponentDecorationType, []);
            editor.setDecorations(childComponentDecorationType, []);
            editor.setDecorations(nestedChildDecorationType, []);
            
            // Clear VISUAL RETURN PREVIEW decorations
            editor.setDecorations(visualReturnPreviewType, []);
            editor.setDecorations(componentHeavyReturnType, []);
            editor.setDecorations(elementHeavyReturnType, []);
            editor.setDecorations(simpleReturnPreviewType, []);
            
            // Clear INLINE JSX TREE decorations
            editor.setDecorations(inlineJSXTreeType, []);
            editor.setDecorations(inlineComponentTreeType, []);
            
            // Re-apply after a short delay (toggle effect)
            setTimeout(() => updateDecorations(editor), 100);
        }
    });

    context.subscriptions.push(toggleCommand);
}

export function deactivate() {}
