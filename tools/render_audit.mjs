#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { marked } from 'marked';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const srcDir = path.join(root, 'src');
const auditDir = path.join(root, 'audit');
fs.mkdirSync(auditDir, { recursive: true });

function prepareMarkdown(markdown) {
  return markdown
    .replace(/^---\s*\n[\s\S]*?\n---\s*\n/, '')
    .replace(/\{(?:\.[\w-]+|#[\w-]+)(?:\s+(?:\.[\w-]+|#[\w-]+))*\}\s*$/gm, '');
}

function protectMath(markdown) {
  const displayMath = [];
  const inlineMath = [];
  let protectedMarkdown = markdown.replace(/\$\$([\s\S]*?)\$\$/g, (_match, tex) => {
    const token = `LLMIODISPLAYMATH${displayMath.length}TOKEN`;
    displayMath.push({ token, tex: tex.trim() });
    return `\n\n${token}\n\n`;
  });
  protectedMarkdown = protectedMarkdown.replace(/(^|[^\\])\$([^\n$]+?)\$/g, (_match, prefix, tex) => {
    const token = `LLMIOINLINEMATH${inlineMath.length}TOKEN`;
    inlineMath.push({ token, tex: tex.trim() });
    return `${prefix}${token}`;
  });
  return { markdown: protectedMarkdown, displayMath, inlineMath };
}

function restoreMath(html, protectedMath) {
  let restored = html;
  for (const { token, tex } of protectedMath.displayMath) {
    const mathHtml = `<div class="math-display">\\[${tex}\\]</div>`;
    restored = restored.replace(new RegExp(`<p>\\s*${token}\\s*</p>`, 'g'), mathHtml).split(token).join(mathHtml);
  }
  for (const { token, tex } of protectedMath.inlineMath) {
    restored = restored.split(token).join(`<span class="math-inline">\\(${tex}\\)</span>`);
  }
  return restored;
}

const files = fs.readdirSync(srcDir)
  .filter(name => /^chapter-\d+\.md$/.test(name))
  .sort((a, b) => Number(a.match(/\d+/)[0]) - Number(b.match(/\d+/)[0]));

const rows = [];
for (const file of files) {
  const original = fs.readFileSync(path.join(srcDir, file), 'utf8');
  const sourceParenInline = (original.match(/\\\(/g) || []).length;
  const sourceBracketDisplay = (original.match(/\\\[/g) || []).length;
  const prepared = prepareMarkdown(original);
  const protectedMath = protectMath(prepared);
  const rendered = marked.parse(protectedMath.markdown, {
    gfm: true,
    breaks: false
  });
  const html = restoreMath(rendered, protectedMath);
  const findings = [];

  const literalStrong = (html.match(/\*\*/g) || []).length;
  const literalHeadings = (html.match(/(^|\n)#{1,6}\s+/g) || []).length;
  const literalListMarkers = (html.match(/(^|\n)\s*[-*+]\s+/g) || []).length;
  const literalMath = (html.match(/\$\$/g) || []).length;
  const leftoverTokens = (html.match(/LLMIO(?:DISPLAY|INLINE)MATH\d+TOKEN/g) || []).length;

  if (literalStrong) findings.push(`${literalStrong} literal strong-emphasis marker(s) remain in rendered HTML`);
  if (literalHeadings) findings.push(`${literalHeadings} literal Markdown heading marker(s) remain in rendered HTML`);
  if (literalListMarkers) findings.push(`${literalListMarkers} literal Markdown list marker(s) remain in rendered HTML`);
  if (literalMath) findings.push(`${literalMath} literal display-math delimiter(s) remain in rendered HTML`);
  if (leftoverTokens) findings.push(`${leftoverTokens} protected-math token(s) remain in rendered HTML`);

  const rawCalloutMarkdown = [...html.matchAll(/<div class="(?:big-idea|translation|warning|exercise)">([\s\S]*?)<\/div>/g)]
    .filter(match => /\*\*|(^|\n)#{1,6}\s|(^|\n)\s*[-*+]\s|\$\$/.test(match[1])).length;
  if (rawCalloutMarkdown) findings.push(`${rawCalloutMarkdown} rendered callout(s) still contain literal Markdown`);

  const renderedParenInline = (html.match(/\\\(/g) || []).length;
  const renderedBracketDisplay = (html.match(/\\\[/g) || []).length;
  const restoredDollarInline = protectedMath.inlineMath.length;
  const restoredDollarDisplay = protectedMath.displayMath.length;
  if (sourceParenInline > renderedParenInline) {
    findings.push(`${sourceParenInline - renderedParenInline} source \\(…\\) delimiter(s) are lost before MathJax can process them`);
  }
  if (sourceBracketDisplay > renderedBracketDisplay + restoredDollarDisplay) {
    findings.push(`${sourceBracketDisplay - renderedBracketDisplay} source \\[…\\] delimiter(s) are lost before MathJax can process them`);
  }
  if (sourceParenInline || sourceBracketDisplay) {
    findings.push(`source uses ${sourceParenInline} \\(…\\) inline and ${sourceBracketDisplay} \\[…\\] display delimiters; current protection covers only dollar delimiters (${restoredDollarInline} inline, ${restoredDollarDisplay} display)`);
  }

  const h1Count = (html.match(/<h1\b/g) || []).length;
  if (h1Count === 0) findings.push('no H1 is rendered');
  if (h1Count > 1) findings.push(`${h1Count} H1 elements are rendered, creating competing document titles or TOC entries`);
  if (!/^\s*<h1[^>]*>Chapter\s+\d+/i.test(html)) findings.push('rendered body does not begin with a chapter-title H1');

  fs.writeFileSync(path.join(auditDir, file.replace('.md', '.rendered.html')), html);
  rows.push({ file, findings });
}

let report = '# Render-pipeline audit\n\n';
report += 'This pass runs the current reader preprocessing logic and Marked against every chapter.\n\n';
for (const { file, findings } of rows) {
  report += `## ${file}\n`;
  if (findings.length) {
    for (const finding of findings) report += `- **Review:** ${finding}.\n`;
  } else {
    report += '- No obvious literal-Markdown residue detected.\n';
  }
  report += '\n';
}
fs.writeFileSync(path.join(auditDir, 'render-audit.md'), report);
console.log(`Rendered and audited ${files.length} chapters`);
