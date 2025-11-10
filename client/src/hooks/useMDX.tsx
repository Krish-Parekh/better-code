import React from "react";
import type { MDXComponents } from "mdx/types";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    wrapper: ({ children }: { children: React.ReactNode }) => (
      <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-semibold prose-p:text-foreground prose-strong:text-foreground prose-code:text-foreground">
        {children}
      </div>
    ),
    h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h1
        className="text-2xl font-bold mb-4 mt-6 text-foreground first:mt-0"
        {...props}
      />
    ),
    h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h2
        className="text-xl font-semibold mb-3 mt-6 text-foreground border-b border-border pb-2"
        {...props}
      />
    ),
    h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h3
        className="text-lg font-semibold mb-2 mt-5 text-foreground"
        {...props}
      />
    ),
    h4: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h4
        className="text-base font-semibold mb-2 mt-4 text-foreground"
        {...props}
      />
    ),
    h5: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h5
        className="text-sm font-semibold mb-2 mt-3 text-foreground"
        {...props}
      />
    ),
    h6: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h6
        className="text-sm font-semibold mb-2 mt-3 text-muted-foreground"
        {...props}
      />
    ),
    p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
      <p className="text-base mb-4 leading-7 text-foreground" {...props} />
    ),
    ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
      <ul
        className="list-disc list-outside mb-4 ml-6 space-y-2 text-foreground marker:text-muted-foreground"
        {...props}
      />
    ),
    ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
      <ol
        className="list-decimal list-outside mb-4 ml-6 space-y-2 text-foreground marker:text-muted-foreground"
        {...props}
      />
    ),
    li: (props: React.HTMLAttributes<HTMLLIElement>) => (
      <li className="text-base leading-7 text-foreground pl-2" {...props} />
    ),
    code: ({
      className,
      children,
      ...props
    }: React.HTMLAttributes<HTMLElement> & { className?: string }) => {
      // Check if this is a code block (has language class) or inline code
      const isCodeBlock = className?.startsWith("language-");

      if (isCodeBlock && className) {
        // Code block - remove language- prefix for display, keep for syntax highlighting
        const language = className.replace("language-", "");
        return (
          <code
            className={`block text-sm font-mono text-card-foreground ${className}`}
            data-language={language}
            {...props}
          >
            {children}
          </code>
        );
      }

      // Inline code
      return (
        <code
          className="bg-muted text-foreground px-1.5 py-0.5 rounded text-sm font-mono border border-border"
          {...props}
        >
          {children}
        </code>
      );
    },
    pre: ({
      children,
      className,
      ...props
    }: React.HTMLAttributes<HTMLPreElement>) => {
      // Extract language from code element if present
      let language = "";
      if (React.isValidElement(children)) {
        const codeProps = children.props as { className?: string };
        const codeClassName = codeProps?.className;
        if (codeClassName?.startsWith("language-")) {
          language = codeClassName.replace("language-", "");
        }
      }

      return (
        <div className="relative mb-6 rounded-lg overflow-hidden border border-border bg-card group">
          {language && (
            <div className="absolute top-0 right-0 px-3 py-1 text-xs font-medium text-muted-foreground bg-muted/50 border-b border-l border-border rounded-bl">
              {language}
            </div>
          )}
          <pre
            className={`bg-card text-card-foreground p-4 overflow-x-auto text-sm font-mono leading-relaxed ${language ? "pt-8" : ""} ${className || ""}`}
            {...props}
          >
            {children}
          </pre>
        </div>
      );
    },
    blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => (
      <blockquote
        className="border-l-4 border-primary pl-4 py-2 mb-4 italic text-muted-foreground bg-muted/30 rounded-r"
        {...props}
      />
    ),
    a: (props: React.HTMLAttributes<HTMLAnchorElement>) => (
      <a
        className="text-primary hover:text-primary/80 underline underline-offset-4 transition-colors"
        {...props}
      />
    ),
    table: (props: React.HTMLAttributes<HTMLTableElement>) => (
      <div className="my-6 w-full overflow-x-auto">
        <table
          className="w-full border-collapse border border-border rounded-lg"
          {...props}
        />
      </div>
    ),
    thead: (props: React.HTMLAttributes<HTMLTableSectionElement>) => (
      <thead className="bg-muted" {...props} />
    ),
    tbody: (props: React.HTMLAttributes<HTMLTableSectionElement>) => (
      <tbody className="divide-y divide-border" {...props} />
    ),
    tr: (props: React.HTMLAttributes<HTMLTableRowElement>) => (
      <tr
        className="border-b border-border hover:bg-muted/50 transition-colors"
        {...props}
      />
    ),
    th: (props: React.HTMLAttributes<HTMLTableCellElement>) => (
      <th
        className="px-4 py-3 text-left font-semibold text-foreground border-r border-border last:border-r-0"
        {...props}
      />
    ),
    td: (props: React.HTMLAttributes<HTMLTableCellElement>) => (
      <td
        className="px-4 py-3 text-foreground border-r border-border last:border-r-0"
        {...props}
      />
    ),
    hr: (props: React.HTMLAttributes<HTMLHRElement>) => (
      <hr className="my-6 border-t border-border" {...props} />
    ),
    strong: (props: React.HTMLAttributes<HTMLElement>) => (
      <strong className="font-semibold text-foreground" {...props} />
    ),
    em: (props: React.HTMLAttributes<HTMLElement>) => (
      <em className="italic text-foreground" {...props} />
    ),
    ...components,
  };
}
