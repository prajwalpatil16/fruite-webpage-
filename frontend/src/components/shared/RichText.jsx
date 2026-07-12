import React from 'react';

/** Lightweight markdown-ish renderer for CMS bodies (paragraphs, bold, lists, numbered lists). */
export function RichText({ content, className = '' }) {
  if (!content) return null;

  const blocks = content.trim().split(/\n\n+/);

  return (
    <div className={`max-w-prose space-y-4 text-base leading-[1.7] text-gray-700 sm:text-[1.05rem] sm:leading-relaxed ${className}`}>
      {blocks.map((block, i) => {
        const lines = block.split('\n').map((l) => l.trim()).filter(Boolean);
        if (!lines.length) return null;

        const isUl = lines.every((l) => /^[-*]\s+/.test(l));
        const isOl = lines.every((l) => /^\d+\.\s+/.test(l));

        if (isUl) {
          return (
            <ul key={i} className="list-disc pl-5 space-y-2">
              {lines.map((l, j) => (
                <li key={j}>{inlineFormat(l.replace(/^[-*]\s+/, ''))}</li>
              ))}
            </ul>
          );
        }
        if (isOl) {
          return (
            <ol key={i} className="list-decimal pl-5 space-y-2">
              {lines.map((l, j) => (
                <li key={j}>{inlineFormat(l.replace(/^\d+\.\s+/, ''))}</li>
              ))}
            </ol>
          );
        }

        return (
          <p key={i}>
            {lines.map((l, j) => (
              <React.Fragment key={j}>
                {j > 0 && <br />}
                {inlineFormat(l)}
              </React.Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}

function inlineFormat(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-bold text-gray-900">{part.slice(2, -2)}</strong>;
    }
    return <React.Fragment key={i}>{part}</React.Fragment>;
  });
}
