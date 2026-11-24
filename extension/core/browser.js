function capture() {
  const landmarks = "header, nav, main, aside, footer, [role=banner], [role=navigation], [role=main], [role=complementary], [role=contentinfo]";
  const nodes = Array.from(document.querySelectorAll(landmarks))
    .filter((node) => node.getClientRects().length && node.getBoundingClientRect().height > 0)
    .slice(0, 12);
  if (!nodes.length) nodes.push(document.body);
  const width = Math.max(document.documentElement.scrollWidth, innerWidth);
  const height = Math.max(document.documentElement.scrollHeight, innerHeight);
  const regions = nodes.map((node, index) => {
    const rect = node.getBoundingClientRect();
    const label = node.getAttribute("aria-label") || node.querySelector("h1,h2,h3")?.innerText
      || node.getAttribute("role") || node.tagName.toLowerCase();
    return {
      key: String.fromCharCode(65 + index), label: label.trim().slice(0, 80),
      detail: (node.innerText || "").replace(/\s+/g, " ").trim().slice(0, 240) || "No visible text.",
      x: Math.max(0, (rect.left + scrollX) / width * 100),
      y: Math.max(0, (rect.top + scrollY) / height * 100),
      w: Math.max(6, rect.width / width * 100),
      h: Math.max(8, rect.height / height * 100),
    };
  });
  return { title: document.title, regions, url: location.href };
}

export const canCapture = Boolean(globalThis.chrome?.scripting);

export async function readActivePage() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) throw new Error("No active tab");
  const [execution] = await chrome.scripting.executeScript({ target: { tabId: tab.id }, func: capture });
  return { ...execution.result, tabId: tab.id, documentId: execution.documentId };
}

export async function jumpTo(page, region) {
  await chrome.scripting.executeScript({
    target: { tabId: page.tabId, documentIds: [page.documentId] },
    args: [region.x, region.y, page.url],
    func: (x, y, url) => {
      if (location.href !== url) throw new Error("Page changed");
      scrollTo(document.documentElement.scrollWidth * x / 100,
        document.documentElement.scrollHeight * y / 100);
    },
  });
}
