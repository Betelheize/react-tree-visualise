# 🚀 React Return Visualizer

**The Ultimate Professional React Code Visualization Extension**

A next-generation Cursor/VS Code extension that transforms your React development experience with intelligent, beautiful visualizations of return statements in TSX and JSX files.

## ✨ **Advanced Features**

### 🎨 **Multi-Layer Visual System**
- **🔄 Indigo** - Simple returns (variables, expressions)
- **⚛️ Emerald** - React components (`<Button>`, `<MyComponent>`)  
- **📦 Amber** - Fragments and containers (`<>`, `<div>`)
- **∅ Gray** - Null returns (renders nothing)
- **🌳 Green** - Complex component trees (multiple nested components)
- **🔗 Purple** - Clickable navigation (jump to component definitions)

### 🧠 **AI-Powered Analysis**
- **Component Tree Analysis** - Shows nesting depth and complexity
- **Smart Component Detection** - Distinguishes between HTML elements and React components
- **Complexity Scoring** - LOW/MEDIUM/HIGH complexity indicators
- **Nested Component Detection** - Identifies complex component hierarchies

### 💫 **Professional Hover Cards**
- **Rich Information Display** - Function context, component analysis, content preview
- **Syntax Highlighting** - Beautiful JSX preview with proper formatting
- **Component Breakdown** - Lists all components used in the return
- **Performance Insights** - Complexity and nesting depth analysis

## Usage

### Manual Analysis
1. Open any `.tsx` or `.jsx` file
2. Right-click in the editor
3. Select "Analyze Return Statements" from the context menu
4. View results in the output panel

### Automatic Detection
- The extension automatically runs when you open or edit TSX/JSX files
- Check the status bar (bottom right) to see the return count
- Click the status bar item to run full analysis

## What It Detects

The extension finds and analyzes:
- Simple return statements: `return <div>Hello</div>`
- Multi-line returns with parentheses
- Conditional returns: `return null`
- Returns in different function types (arrow functions, regular functions, class methods)
- Both JSX and non-JSX returns

## Example Output

```
Found 3 return statement(s) in sample.tsx:

Return #1:
  Line: 5
  Function: HelloWorld
  Content: (
        <div>
            <h1>Hello World!</h1>
            <p>This is a test component</p>
        </div>
    )
---
Return #2:
  Line: 15
  Function: ConditionalComponent
  Content: null
---
Return #3:
  Line: 19
  Function: ConditionalComponent
  Content: (
        <div className="content">
            <span>Content is shown</span>
        </div>
    )
---
```

## Development

### Setup
```bash
npm install
npm run compile
```

### Testing
1. Press `F5` to open a new Extension Development Host window
2. Open the `test-files/sample.tsx` file
3. Test the extension functionality

### Building
```bash
npm run compile
```

## Requirements

- VS Code or Cursor ^1.74.0
- Node.js for development

## Extension Settings

This extension contributes the following commands:
- `gulf-return-detector.analyzeReturns`: Analyze Return Statements

## Known Issues

- Complex nested returns might not be perfectly formatted in output
- Some edge cases with unusual JSX syntax might fall back to regex detection

## Release Notes

### 0.0.1
- Initial release
- Basic return statement detection
- AST-based parsing with Babel
- Status bar integration
- Context menu command
