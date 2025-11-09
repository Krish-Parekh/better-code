import type { MDXComponents } from "mdx/types";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    wrapper: ({ children }: { children: React.ReactNode }) => (
      <div className="prose prose-lg max-w-none">{children}</div>
    ),
    h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h1 className="text-3xl font-bold mb-4" {...props} />
    ),
    h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h2 className="text-2xl font-bold mb-3 mt-4" {...props} />
    ),
    h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h3 className="text-xl font-bold mb-2 mt-3" {...props} />
    ),
    h4: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h4 className="text-lg font-bold mb-2 mt-3" {...props} />
    ),
    h5: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h5 className="text-base font-bold mb-2 mt-2" {...props} />
    ),
    h6: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h6 className="text-sm font-bold mb-2 mt-2" {...props} />
    ),
    p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
      <p className="text-base mb-3 leading-relaxed" {...props} />
    ),
    ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
      <ul className="list-disc list-inside mb-3 space-y-1" {...props} />
    ),
    ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
      <ol className="list-decimal list-inside mb-3 space-y-1" {...props} />
    ),
    li: (props: React.HTMLAttributes<HTMLLIElement>) => (
      <li className="text-base" {...props} />
    ),
    code: (props: React.HTMLAttributes<HTMLElement>) => (
      <code
        className="bg-gray-100 border px-2 py-1 rounded text-sm font-mono"
        {...props}
      />
    ),
    pre: (props: React.HTMLAttributes<HTMLPreElement>) => (
      <div className="relative group mb-4">
        <pre
          className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm font-mono leading-relaxed"
          {...props}
        />
      </div>
    ),
    blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => (
      <blockquote
        className="border-l-4 border-gray-300 pl-4 py-2 mb-3 italic text-gray-700"
        {...props}
      />
    ),
    a: (props: React.HTMLAttributes<HTMLAnchorElement>) => (
      <a className="text-blue-600 hover:text-blue-800 underline" {...props} />
    ),
    ...components,
  };
}
