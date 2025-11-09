"use client";
import Editor from "@monaco-editor/react";

const pythonCode = `def twoSum(nums, target):
    # Write your solution here
    pass

# DO NOT MODIFY BELOW THIS LINE
if __name__ == "__main__":
    import sys
    nums = list(map(int, sys.stdin.readline().strip().split()))
    target = int(sys.stdin.readline().strip())
    result = twoSum(nums, target)
    if result:
        print(' '.join(map(str, result)))
`;

export default function CodeEditor() {

  return (
    <Editor
      options={{
        fontSize: 14,
        padding: { top: 16, bottom: 16 },
      }}
      height="100%"
      width="100%"
      theme="vs-dark"
      language="python"
      value={pythonCode}
    />
  );
}
