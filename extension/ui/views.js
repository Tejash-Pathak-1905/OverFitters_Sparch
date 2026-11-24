import { translate } from "../core/braille.js";

export const byId = (id) => document.getElementById(id);

export function renderMap(regions, explore, jump) {
  byId("map").replaceChildren(...regions.map((region, index) => {
    const button = document.createElement("button");
    const left = Math.min(94, region.x);
    const top = Math.min(92, region.y);
    button.style.cssText = `left:${left}%;top:${top}%;width:${Math.min(100 - left, region.w)}%;height:${Math.min(100 - top, region.h)}%`;
    button.textContent = `${translate(region.key)} ${region.label}`;
    button.setAttribute("aria-label", region.label);
    button.onfocus = button.onpointerenter = () => explore(region);
    button.onclick = (event) => event.detail === 0 ? jump(region) : explore(region);
    button.ondblclick = () => jump(region);
    button.onkeydown = (event) => {
      const direction = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key];
      if (!direction) return;
      event.preventDefault();
      byId("map").children[(index + direction + regions.length) % regions.length].focus();
    };
    return button;
  }));
}

export function renderActions(actions) {
  const hadFocus = byId("actions").contains(document.activeElement);
  byId("actions").replaceChildren(...actions.map(([label, action]) => {
    const button = document.createElement("button");
    const braille = document.createElement("span");
    braille.textContent = translate(label);
    braille.setAttribute("aria-hidden", "true");
    button.append(braille, label);
    button.onclick = action;
    return button;
  }));
  if (hadFocus) byId("actions").firstElementChild?.focus();
}

export function renderFlights(flights, price) {
  const table = document.createElement("table");
  const header = table.createTHead().insertRow();
  for (const label of ["Rank", "Airline", "Departure", "Total"]) {
    const cell = document.createElement("th");
    cell.scope = "col";
    cell.textContent = label;
    header.append(cell);
  }
  const body = table.createTBody();
  flights.forEach((flight, index) => {
    const row = body.insertRow();
    for (const value of [index + 1, flight.airline, flight.time, price(flight)]) {
      row.insertCell().textContent = value;
    }
  });
  byId("output").replaceChildren(table);
}
