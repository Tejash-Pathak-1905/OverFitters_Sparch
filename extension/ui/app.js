import { fixture, flights } from "../core/fixture.js";
import { fit } from "../core/braille.js";
import { plan } from "../core/planner.js";
import { Checkout } from "../core/checkout.js";
import { canCapture, jumpTo, readActivePage } from "../core/browser.js";
import { listen, silence, speak } from "../core/speech.js";
import { loadShortcut, saveShortcut } from "../core/storage.js";
import { byId, renderActions, renderFlights, renderMap } from "./views.js";

const checkout = new Checkout();
const price = (flight) => "₹" + flight.price.toLocaleString("en-IN");
const fact = (flight) => `INR ${flight.price} · ${flight.airline} ${flight.time}`;
let page = fixture;
let ranked = [];
let selected = 0;
let lines = fit("");
let position = 0;
let revision = 0;
let memory = "";
let shortcut;

function announce(message) {
  byId("status").textContent = message;
  const entry = document.createElement("li");
  entry.textContent = message;
  byId("activity").prepend(entry);
  if (byId("activity").children.length > 8) byId("activity").lastElementChild.remove();
  if (byId("speech").checked) speak(message);
}

function showLine() {
  byId("line").textContent = lines[position].text;
  byId("braille").textContent = lines[position].cells;
  byId("position").textContent = `32 cells · ${position + 1}/${lines.length}`;
  byId("more").disabled = lines.length < 2;
}

function write(text) {
  lines = fit(text.replaceAll(" · ", " / "));
  position = 0;
  showLine();
}

function explore(region) {
  byId("region").textContent = `${region.label}. ${region.detail}`;
  if (!checkout.pending) write(`${region.label} / ${region.detail}`);
}

async function jump(region) {
  if (checkout.pending) return;
  const targetPage = page;
  announce(`Jumping to ${region.label}.`);
  explore(region);
  if (targetPage === fixture) {
    if (region.key === "R") await run("compare");
    return;
  }
  try {
    await jumpTo(targetPage, region);
  } catch {
    announce("The page changed or is unavailable. Read the active tab again.");
  }
}

function showPage(next) {
  revision++;
  checkout.cancel();
  page = next;
  ranked = [];
  selected = 0;
  memory = "";
  byId("source").textContent = next.title;
  byId("output").replaceChildren();
  byId("region").textContent = "";
  renderMap(next.regions, explore, jump);
  write(next.title);
  actions();
}

function select(index) {
  selected = (index + ranked.length) % ranked.length;
  const flight = ranked[selected];
  write(fact(flight));
  announce(`Option ${selected + 1}. ${flight.airline}, departure ${flight.time}.`);
}

function stage(index) {
  const flight = ranked[index];
  if (!flight) return announce("Compare the flights first, then choose option one, two or three.");
  announce(`Step 1 of 2. Selecting ${flight.airline}.`);
  checkout.request(flight);
  write(fact(flight));
  byId("output").textContent = `Bengaluru to Delhi · ${flight.airline} · ${flight.time} · ${price(flight)} total · Simulated checkout`;
  announce("Step 2 of 2. Review the airline, departure and exact total. Confirm or cancel.");
  actions();
}

function finish(confirmed) {
  if (!checkout.pending) return;
  if (confirmed) {
    const receipt = checkout.confirm();
    memory = `Demo booking confirmed for ${receipt.airline}.`;
    write("Demo confirmed / " + fact(receipt));
    byId("output").textContent = `${memory} ${price(receipt)} simulated total.`;
  } else {
    checkout.cancel();
    memory = "Demo checkout canceled.";
    write(memory);
    renderFlights(ranked, price);
  }
  announce(memory);
  actions();
}

function actions() {
  const nextLine = () => {
    position = (position + 1) % lines.length;
    showLine();
  };
  byId("more").onclick = nextLine;
  const pause = () => { silence(); byId("speech").checked = false; };
  const help = () => announce("Type or speak a command. Use the map to explore and the six buttons to act.");
  const myButton = () => shortcut ? run(shortcut) : announce("Say or type: make a button that compares the cheapest flights.");
  if (checkout.pending) {
    renderActions([["Confirm", () => finish(true)], ["Cancel", () => finish(false)], ["Next line", nextLine],
      ["Review", () => write(fact(checkout.pending))], ["Pause voice", pause], ["Help", help]]);
  } else if (ranked.length) {
    renderActions([["Next", () => select(selected + 1)], ["Previous", () => select(selected - 1)],
      ["Book", () => stage(selected)], ["Compare", () => run("compare")], ["My button", myButton], ["Help", help]]);
  } else {
    renderActions([["Summary", () => run("summary")], ["Compare", () => run("compare")], ["Recap", () => run("recap")],
      ["Pause voice", pause], ["My button", myButton], ["Help", help]]);
  }
}

async function run(input) {
  const command = input.trim().slice(0, 250);
  if (!command) return;
  if (checkout.pending) return announce("Choose Confirm or Cancel in the checkout controls.");
  const request = ++revision;
  if (/^make a button\b/i.test(command)) {
    if (!/\b(compare|cheapest|read|summary|recap)\b/i.test(command) || /\b(buy|book|checkout)\b/i.test(command)) {
      return announce("Choose a shortcut for Compare, Summary or Recap.");
    }
    const saved = /\b(compare|cheapest)\b/i.test(command) ? "compare" : /\brecap\b/i.test(command) ? "recap" : "summary";
    try {
      await saveShortcut(saved);
      shortcut = saved;
      announce(`My Button saved: ${saved}.`);
    } catch {
      announce("Shortcut storage is unavailable.");
    }
    return;
  }
  const result = await plan(command, page === fixture ? flights : []);
  if (request !== revision || checkout.pending) return;
  switch (result.intent) {
    case "compare":
      if (page !== fixture) return announce("Open the Travel demo to compare sample flights.");
      ranked = result.order.map((index) => flights[index]).filter(Boolean);
      if (!ranked.length) return announce("No demo flights available.");
      renderFlights(ranked, price);
      select(0);
      memory = `Compared ${ranked.length} flights. Cheapest: ${ranked[0].airline} at ${price(ranked[0])}.`;
      announce(`Ranked ${ranked.length} flights by total price.`);
      actions();
      break;
    case "checkout":
      if (page !== fixture) return announce("Checkout is available in the Travel demo.");
      stage(result.index ?? selected);
      break;
    case "summary":
      write(`${page.title} / ${page.regions.length} regions / ${page.regions.map(({ label }) => label).join(" / ")}`);
      announce(`${page.title}. ${page.regions.length} regions mapped.`);
      break;
    case "recap":
      write(memory || "No task recorded on this page.");
      announce(memory || "No task recorded on this page.");
      break;
    default:
      announce("Try Summary, Compare the three cheapest, or Book the second one.");
  }
}

byId("prompt").onsubmit = (event) => {
  event.preventDefault();
  void run(byId("command").value);
};
byId("listen").onclick = () => {
  const button = byId("listen");
  button.disabled = true;
  listen((command) => {
    button.disabled = false;
    byId("command").value = command;
    void run(command);
  }, (message) => {
    button.disabled = false;
    if (message) announce(message);
  });
};
byId("speech").onchange = () => {
  if (!byId("speech").checked) silence();
};
byId("demo").onclick = () => {
  if (checkout.pending) return announce("Confirm or cancel the pending checkout first.");
  showPage(fixture);
  announce("Travel demo loaded.");
};
byId("capture").hidden = !canCapture;
byId("capture").onclick = async () => {
  if (checkout.pending) return announce("Confirm or cancel the pending checkout first.");
  const request = ++revision;
  try {
    const next = await readActivePage();
    if (request !== revision || checkout.pending) return;
    showPage(next);
    announce(`Mapped ${next.regions.length} regions on ${next.title}.`);
  } catch {
    if (request === revision) announce("Sparsh could not read this tab. Select a regular web page and reopen Sparsh from its toolbar icon.");
  }
};
loadShortcut().then((value) => { shortcut = value; }).catch(() => {});
showPage(fixture);
