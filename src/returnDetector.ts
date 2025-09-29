import { parse } from '@babel/parser';
import traverse, { NodePath } from '@babel/traverse';
import * as t from '@babel/types';

export interface ReturnInfo {
    line: number;
    content: string;
    functionName?: string;
    isJSX: boolean;
}

export class ReturnDetector {
    detectReturns(code: string, fileName: string): ReturnInfo[] {
        const returns: ReturnInfo[] = [];
        
        try {
            // Parse the code using Babel parser
            const ast = parse(code, {
                sourceType: 'module',
                plugins: [
                    'jsx',
                    'typescript',
                    'decorators-legacy',
                    'classProperties',
                    'objectRestSpread',
                    'asyncGenerators',
                    'functionBind',
                    'exportDefaultFrom',
                    'exportNamespaceFrom',
                    'dynamicImport',
                    'nullishCoalescingOperator',
                    'optionalChaining'
                ]
            });

            // Traverse the AST to find return statements
            traverse(ast, {
                ReturnStatement: (path: NodePath<t.ReturnStatement>) => {
                    const returnStatement = path.node;
                    const line = returnStatement.loc?.start.line || 0;
                    
                    // Get function context
                    let functionName: string | undefined;
                    let parent = path.getFunctionParent();
                    
                    if (parent) {
                        if (t.isFunctionDeclaration(parent.node) && parent.node.id) {
                            functionName = parent.node.id.name;
                        } else if (t.isArrowFunctionExpression(parent.node)) {
                            // Try to get variable name for arrow functions
                            const varParent = parent.findParent((p: NodePath) => t.isVariableDeclarator(p.node));
                            if (varParent && t.isVariableDeclarator(varParent.node) && t.isIdentifier(varParent.node.id)) {
                                functionName = varParent.node.id.name;
                            }
                        } else if (t.isFunctionExpression(parent.node) && parent.node.id) {
                            functionName = parent.node.id.name;
                        }
                    }

                    // Extract return content
                    let content = '';
                    let isJSX = false;
                    
                    if (returnStatement.argument) {
                        // Get the source code for the return argument
                        const start = returnStatement.argument.start;
                        const end = returnStatement.argument.end;
                        
                        if (start !== null && end !== null) {
                            content = code.slice(start, end);
                        }
                        
                        // Check if return contains JSX
                        isJSX = this.containsJSX(returnStatement.argument);
                    }

                    returns.push({
                        line,
                        content: content || '(empty)',
                        functionName,
                        isJSX
                    });
                }
            });

        } catch (error) {
            console.error('Error parsing code:', error);
            // Fallback to regex-based detection
            return this.fallbackDetection(code);
        }

        return returns;
    }

    private containsJSX(node: t.Node): boolean {
        let hasJSX = false;
        
        traverse(node, {
            JSXElement: () => {
                hasJSX = true;
            },
            JSXFragment: () => {
                hasJSX = true;
            }
        }, undefined);
        
        return hasJSX;
    }

    private fallbackDetection(code: string): ReturnInfo[] {
        const returns: ReturnInfo[] = [];
        const lines = code.split('\n');
        
        lines.forEach((line, index) => {
            const trimmed = line.trim();
            if (trimmed.startsWith('return ') || trimmed === 'return' || trimmed.startsWith('return(')) {
                let content = trimmed.substring(6).trim(); // Remove 'return'
                
                // Try to capture multi-line returns
                if (content.endsWith('(')) {
                    let lineIndex = index + 1;
                    let parenCount = 1;
                    let multiLineContent = content;
                    
                    while (lineIndex < lines.length && parenCount > 0) {
                        const nextLine = lines[lineIndex];
                        multiLineContent += '\n' + nextLine;
                        
                        for (const char of nextLine) {
                            if (char === '(') parenCount++;
                            if (char === ')') parenCount--;
                        }
                        lineIndex++;
                    }
                    content = multiLineContent;
                }
                
                const isJSX = content.includes('<') && content.includes('>');
                
                returns.push({
                    line: index + 1,
                    content: content || '(empty)',
                    isJSX
                });
            }
        });
        
        return returns;
    }
}
