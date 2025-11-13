import React from "react";
import type { MDXComponents } from "mdx/types";
import { cn } from "@/lib/utils";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    wrapper: ({ children }: { children: React.ReactNode }) => (
      <div className="mdx-content max-w-none pb-8 mb-8">{children}</div>
    ),
    h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h1
        className="text-3xl font-bold mb-6 mt-8 text-foreground first:mt-0 tracking-tight"
        {...props}
      />
    ),
    h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h2
        className="text-2xl font-semibold mb-4 mt-8 text-foreground border-b border-border pb-3 first:mt-0 tracking-tight"
        {...props}
      />
    ),
    h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h3
        className="text-xl font-semibold mb-3 mt-6 text-foreground tracking-tight"
        {...props}
      />
    ),
    h4: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h4
        className="text-lg font-semibold mb-2 mt-5 text-foreground tracking-tight"
        {...props}
      />
    ),
    h5: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h5
        className="text-base font-semibold mb-2 mt-4 text-foreground tracking-tight"
        {...props}
      />
    ),
    h6: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h6
        className="text-sm font-semibold mb-2 mt-4 text-muted-foreground tracking-tight"
        {...props}
      />
    ),
    p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
      <p className="text-base mb-5 leading-7 text-foreground" {...props} />
    ),
    ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
      <ul
        className="list-disc list-outside mb-5 ml-6 space-y-2 text-foreground marker:text-primary"
        {...props}
      />
    ),
    ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
      <ol
        className="list-decimal list-outside mb-5 ml-6 space-y-2 text-foreground marker:text-primary marker:font-semibold"
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
      const isCodeBlock = className?.startsWith("language-");
      const content = typeof children === "string" ? children : "";
      const hasNewlines = content.includes("\n");

      if (isCodeBlock || (hasNewlines && !className)) {
        return (
          <code className={className || ""} {...props}>
            {children}
          </code>
        );
      }

      return (
        <code
          className="bg-muted text-foreground px-2 py-0.5 rounded-md text-sm font-mono border border-border/50 font-medium"
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

      // Check if children is a code element
      if (React.isValidElement(children)) {
        const codeProps = children.props as { className?: string };
        const codeClassName = codeProps?.className;
        if (codeClassName?.startsWith("language-")) {
          language = codeClassName.replace("language-", "");
        }
      }

      // Also check React children array in case of multiple children
      const childrenArray = React.Children.toArray(children);
      const codeChild = childrenArray.find(
        (child) => React.isValidElement(child) && child.type === "code",
      ) as React.ReactElement<{ className?: string }> | undefined;

      if (codeChild && !language) {
        const codeClassName = codeChild.props?.className;
        if (codeClassName?.startsWith("language-")) {
          language = codeClassName.replace("language-", "");
        }
      }

      return (
        <div className="relative mb-6 rounded-lg overflow-hidden border border-border bg-card shadow-sm group">
          {language && (
            <div className="absolute top-0 right-0 px-3 py-1.5 text-xs font-medium text-muted-foreground bg-muted/80 border-b border-l border-border rounded-bl-lg backdrop-blur-sm z-10">
              {language}
            </div>
          )}
          <pre
            className={cn(
              "bg-card text-card-foreground p-5 overflow-x-auto text-sm font-mono leading-relaxed whitespace-pre",
              language && "pt-10",
              className,
            )}
            {...props}
          >
            {children}
          </pre>
        </div>
      );
    },
    blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => (
      <blockquote
        className="border-l-4 border-primary/60 pl-5 py-3 mb-5 italic text-muted-foreground bg-muted/40 rounded-r-lg my-6"
        {...props}
      />
    ),
    a: (props: React.HTMLAttributes<HTMLAnchorElement>) => (
      <a
        className="text-primary hover:text-primary/80 underline underline-offset-4 transition-colors font-medium"
        {...props}
      />
    ),
    table: (props: React.HTMLAttributes<HTMLTableElement>) => (
      <div className="my-8 w-full overflow-x-auto">
        <table
          className="w-full border-collapse border border-border rounded-lg bg-card shadow-sm overflow-hidden"
          {...props}
        />
      </div>
    ),
    thead: (props: React.HTMLAttributes<HTMLTableSectionElement>) => (
      <thead className="bg-muted/50" {...props} />
    ),
    tbody: (props: React.HTMLAttributes<HTMLTableSectionElement>) => (
      <tbody className="bg-card" {...props} />
    ),
    tr: (props: React.HTMLAttributes<HTMLTableRowElement>) => (
      <tr
        className="border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors duration-150"
        {...props}
      />
    ),
    th: (props: React.HTMLAttributes<HTMLTableCellElement>) => (
      <th
        className="px-6 py-4 text-left text-sm font-semibold text-foreground align-middle border-r border-border last:border-r-0"
        {...props}
      />
    ),
    td: (props: React.HTMLAttributes<HTMLTableCellElement>) => (
      <td
        className="px-6 py-4 text-sm text-foreground align-middle border-r border-border last:border-r-0"
        {...props}
      />
    ),
    hr: (props: React.HTMLAttributes<HTMLHRElement>) => (
      <hr className="my-8 border-t border-border/50" {...props} />
    ),
    strong: (props: React.HTMLAttributes<HTMLElement>) => (
      <strong className="font-semibold text-foreground" {...props} />
    ),
    em: (props: React.HTMLAttributes<HTMLElement>) => (
      <em className="italic text-foreground" {...props} />
    ),
    img: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
      <img
        className="rounded-lg border border-border my-6 shadow-sm max-w-full h-auto"
        {...props}
      />
    ),
    ...components,
  };
}
