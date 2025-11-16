import Editor from "@monaco-editor/react";
import { useEffect, useState } from "react";

interface CodeEditorProps {
  templates: {
    python: string
    javascript: string
    java: string
  }
}

export default function CodeEditor({ templates }: CodeEditorProps) {
  const [code, setCode] = useState<string | null>(null);

  useEffect(() => {
    setCode(templates.python);
  }, [templates]);

  return (
    <div className="h-full w-full flex flex-col gap-2">
      <Editor
        options={{
          fontSize: 14,
          padding: { top: 16, bottom: 16 },
        }}
        height="100%"
        width="100%"
        theme="vs-dark"
        language={code ? code.split("\n")[0].split(" ")[1].toLowerCase() : "python"}
        value={code || undefined}
        onChange={(value) => setCode(value || "")}
      />
    </div>
  )
}