const latin = "abcdefghijklmnopqrstuvwxyz";
const cells = "⠁⠃⠉⠙⠑⠋⠛⠓⠊⠚⠅⠇⠍⠝⠕⠏⠟⠗⠎⠞⠥⠧⠺⠭⠽⠵";
const punctuation = { " ": "⠀", ":": "⠒", ",": "⠂", ".": "⠲", "-": "⠤", "?": "⠦", "/": "⠌" };

export function translate(text) {
  let numeric = false;
  return Array.from(text.toLowerCase(), (character) => {
    if (/^\d$/.test(character)) {
      const digit = cells[(Number(character) + 9) % 10];
      const prefix = numeric ? "" : "⠼";
      numeric = true;
      return prefix + digit;
    }
    const prefix = numeric && /^[a-j]$/.test(character) ? "⠰" : "";
    numeric = false;
    return prefix + (cells[latin.indexOf(character)] ?? punctuation[character] ?? "⠦");
  }).join("");
}

export function fit(text, width = 32) {
  const lines = [];
  let line = "";
  for (const word of text.trim().split(/\s+/).filter(Boolean)) {
    const candidate = line ? line + " " + word : word;
    if (translate(candidate).length <= width) {
      line = candidate;
      continue;
    }
    if (line) lines.push({ text: line, cells: translate(line) });
    line = "";
    for (const character of word) {
      if (translate(line + character).length > width && line) {
        lines.push({ text: line, cells: translate(line) });
        line = "";
      }
      line += character;
    }
  }
  if (line) lines.push({ text: line, cells: translate(line) });
  return lines.length ? lines : [{ text: "", cells: "" }];
}
