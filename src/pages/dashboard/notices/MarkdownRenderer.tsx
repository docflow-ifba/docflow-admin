import { marked } from 'marked';

marked.use({
  async: false,
  breaks: false,
  extensions: null,
  gfm: true,
  hooks: null,
  pedantic: false,
  silent: false,
  tokenizer: null,
  walkTokens: null,
});

export default function MarkdownRenderer({ markdown }: { markdown: string }) {
  const html = marked(markdown);

  return <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />;
}
