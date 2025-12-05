"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { useTheme } from "next-themes";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  oneDark,
  oneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";

interface CodeSnippetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  code: string;
  language?: string | null;
}

export function CodeSnippetDialog({
  open,
  onOpenChange,
  code,
  language,
}: CodeSnippetDialogProps) {
  const { resolvedTheme } = useTheme();
  const lang = (language ?? "plaintext").toLowerCase();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success("Copied code to clipboard");
    } catch (e) {
      toast.error("Failed to copy code");
    }
  };

  const handleOpenWindow = () => {
    const newWindow = window.open();
    if (newWindow) {
      newWindow.document.write(`<pre>${escapeHtml(code)}</pre>`);
      newWindow.document.close();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Code Snippet</DialogTitle>
          <DialogDescription>
            Read-only snippet attached to this note.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-2">
          {lang && (
            <Badge variant="outline" className="capitalize">
              {displayLabel(lang)}
            </Badge>
          )}
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={handleCopy}>
              <Copy className="h-4 w-4 mr-1" /> Copy
            </Button>
            <Button size="sm" variant="outline" onClick={handleOpenWindow}>
              <ExternalLink className="h-4 w-4 mr-1" /> New window
            </Button>
          </div>
        </div>
        <div className="max-h-[60vh] overflow-auto rounded-md border bg-muted/30">
          <SyntaxHighlighter
            language={lang}
            style={resolvedTheme === "dark" ? oneDark : oneLight}
            customStyle={{
              margin: 0,
              background: "transparent",
              padding: 16,
              fontSize: "1.2rem",
              lineHeight: 1.6,
              whiteSpace: "pre-wrap",
              wordBreak: "normal",
              overflowWrap: "anywhere",
              letterSpacing: "normal",
            }}
            codeTagProps={{
              style: {
                whiteSpace: "pre-wrap",
                wordBreak: "normal",
                overflowWrap: "anywhere",
                fontSize: "inherit",
                letterSpacing: "normal",
              },
            }}
            lineProps={{
              style: {
                whiteSpace: "pre-wrap",
                wordBreak: "normal",
                overflowWrap: "anywhere",
                fontSize: "inherit",
                letterSpacing: "normal",
              },
            }}
            lineNumberStyle={{ fontSize: "1.2rem" }}
            showLineNumbers
          >
            {code}
          </SyntaxHighlighter>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function escapeHtml(input: string) {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
    .replace(/\n/g, "<br/>");
}

function displayLabel(lang: string) {
  switch (lang) {
    case "javascript":
      return "JavaScript";
    case "typescript":
      return "TypeScript";
    case "jsx":
      return "React (JSX)";
    case "tsx":
      return "React (TSX)";
    case "python":
      return "Python";
    case "java":
      return "Java";
    case "csharp":
      return "C#";
    case "go":
      return "Go";
    case "ruby":
      return "Ruby";
    case "php":
      return "PHP";
    case "sql":
      return "SQL";
    case "bash":
      return "Shell (Bash)";
    case "json":
      return "JSON";
    case "yaml":
      return "YAML";
    case "html":
      return "HTML";
    case "css":
      return "CSS";
    case "markdown":
      return "Markdown";
    default:
      return "Plain text";
  }
}
