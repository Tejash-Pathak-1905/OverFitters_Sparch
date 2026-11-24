export async function plan(command, flights) {
  try {
    const response = await fetch("http://127.0.0.1:8000/api/plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ command, flights }),
      signal: AbortSignal.timeout(1800),
    });
    if (response.ok) return await response.json();
  } catch {
    // The bundled demo also runs without the planner service.
  }
  const ordinal = command.toLowerCase().match(/\b(first|second|third|[123])\b/)?.[0];
  if (/\b(buy|book|checkout)\b/i.test(command)) {
    const order = { first: 0, second: 1, third: 2, 1: 0, 2: 1, 3: 2 };
    return { intent: "checkout", index: order[ordinal] };
  }
  if (/\b(compare|cheapest|sort)\b/i.test(command)) {
    const order = flights.map((_, index) => index).sort((a, b) => flights[a].price - flights[b].price);
    return { intent: "compare", order: order.slice(0, 3) };
  }
  if (/\b(where|resume|recap)\b/i.test(command)) return { intent: "recap" };
  if (/\b(read|summarize|summary)\b/i.test(command)) return { intent: "summary" };
  return { intent: "unknown" };
}
