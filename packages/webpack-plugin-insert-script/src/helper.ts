export function getScriptHtml(scripts: Array<string>) {
  return scripts.map((script) => {
    const html = `<script src="${script}"></script>`;
    return html;
  }).join('');
}
