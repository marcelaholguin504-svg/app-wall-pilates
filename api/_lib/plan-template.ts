// Duerme Ya — plantilla de correo para el Plan de 14 noches: convierte el
// markdown muy simple usado en plan-emails.ts (**negrita**, *cursiva*,
// líneas que empiecen con "- " como lista) a HTML cálido y legible en
// celular, y a texto plano como alternativa. No es un parser de markdown
// completo a propósito: solo soporta lo que realmente usan esos 14 correos.

function escapeHtml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function inlineMarkdownToHtml(line: string): string {
  const escaped = escapeHtml(line);
  // La negrita usa doble asterisco: hay que resolverla antes de la cursiva
  // para que "**x**" no se lea como dos cursivas pegadas.
  const withBold = escaped.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  return withBold.replace(/\*(.+?)\*/g, "<em>$1</em>");
}

function inlineMarkdownToPlainText(line: string): string {
  return line.replace(/\*\*(.+?)\*\*/g, "$1").replace(/\*(.+?)\*/g, "$1");
}

interface Block {
  type: "paragraph" | "list";
  lines: string[];
}

function parseBlocks(body: string): Block[] {
  const blocks: Block[] = [];
  const paragraphs = body.split(/\n\n+/);
  for (const paragraph of paragraphs) {
    const lines = paragraph.split("\n").filter((l) => l.trim().length > 0);
    if (lines.length === 0) continue;
    if (lines.every((l) => l.trim().startsWith("- "))) {
      blocks.push({ type: "list", lines: lines.map((l) => l.trim().slice(2)) });
    } else {
      blocks.push({ type: "paragraph", lines });
    }
  }
  return blocks;
}

export function bodyToHtml(body: string): string {
  const blocks = parseBlocks(body);
  return blocks
    .map((block) => {
      if (block.type === "list") {
        const items = block.lines.map((line) => `<li>${inlineMarkdownToHtml(line)}</li>`).join("");
        return `<ul style="margin:0 0 16px;padding-left:20px;">${items}</ul>`;
      }
      return `<p style="margin:0 0 16px;">${block.lines.map(inlineMarkdownToHtml).join("<br>")}</p>`;
    })
    .join("\n");
}

export function bodyToPlainText(body: string): string {
  const blocks = parseBlocks(body);
  return blocks
    .map((block) => {
      if (block.type === "list") {
        return block.lines.map((line) => `- ${inlineMarkdownToPlainText(line)}`).join("\n");
      }
      return block.lines.map(inlineMarkdownToPlainText).join("\n");
    })
    .join("\n\n");
}

export function buildPlanEmailHtml(subject: string, body: string, unsubscribeUrl: string): string {
  return `<!doctype html>
<html lang="es">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin:0;padding:0;background-color:#fdf6f0;">
  <div style="max-width:480px;margin:0 auto;padding:24px 20px;font-family:-apple-system,Helvetica,Arial,sans-serif;color:#3a2e2a;font-size:16px;line-height:1.5;">
    <p style="margin:0 0 20px;font-weight:700;font-size:18px;">${escapeHtml(subject)}</p>
    ${bodyToHtml(body)}
    <hr style="border:none;border-top:1px solid #e8dcd3;margin:24px 0;">
    <p style="margin:0;font-size:13px;color:#8a7b73;">
      <a href="${unsubscribeUrl}" style="color:#8a7b73;text-decoration:underline;">Ya no quiero recibir estos correos</a>
    </p>
  </div>
</body>
</html>`;
}

export function buildPlanEmailPlainText(subject: string, body: string, unsubscribeUrl: string): string {
  return [subject, "", bodyToPlainText(body), "", "---", "Ya no quiero recibir estos correos:", unsubscribeUrl].join(
    "\n"
  );
}
