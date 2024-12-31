import Editor from '@monaco-editor/react';
import { FileItem } from '../types';

interface CodeEditorProps {
  file: FileItem | null;
}
const cleanCodeResponse = (response: string): string => {
  return response
    .replace(/^```[a-z]*\s*\n([\s\S]*?)\n```$/gm, "$1") // Handles code blocks at the start/end of the string
    .replace(/```[a-z]*\s*\n([\s\S]*?)\n```/g, "$1") // Handles code blocks within text
    .trim(); // Removes leading/trailing whitespace
};

export function CodeEditor({ file }: CodeEditorProps) {
  if (!file) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400">
        Select a file to view its contents
      </div>
    );
  }

  return (
    <Editor
      height="100%"
      defaultLanguage="typescript"
      theme="vs-dark"
      value={cleanCodeResponse(file.content ||'')}
      options={{
        readOnly: false,
        minimap: { enabled: false },
        fontSize: 14,
        wordWrap: 'on',
        scrollBeyondLastLine: false,
      }}
    />
  );
}