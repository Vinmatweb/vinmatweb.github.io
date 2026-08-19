"use client";

import { useState } from "react";

export function CopyPrompt({
  children,
  label = "Kopírovat větu",
  copiedLabel = "Zkopírováno",
}: {
  children: string;
  label?: string;
  copiedLabel?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(children);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="copy-prompt">
      <blockquote>„{children}“</blockquote>
      <button type="button" onClick={copy} className="button button--ghost button--small">
        {copied ? copiedLabel : label}
      </button>
    </div>
  );
}
