import test from "node:test";
import assert from "node:assert/strict";
import { fit, translate } from "../extension/core/braille.js";
import { Checkout } from "../extension/core/checkout.js";

test("braille pagination includes numeric indicators in its capacity", () => {
  assert.equal(translate("4230"), "⠼⠙⠃⠉⠚");
  const text = "INR 4580 / Air India Express 11:05";
  const lines = fit(text);
  assert.ok(lines.length > 1);
  assert.ok(lines.every((line) => line.cells.length <= 32));
  assert.equal(lines.map((line) => line.text).join(" "), text);
});

test("checkout snapshots the quoted total and consumes approval once", () => {
  const checkout = new Checkout();
  const flight = { airline: "Sample", price: 4580 };
  assert.equal(checkout.confirm(), null);
  checkout.request(flight);
  flight.price = 6000;
  assert.equal(checkout.confirm().price, 4580);
  assert.equal(checkout.confirm(), null);
  checkout.request(flight);
  checkout.cancel();
  assert.equal(checkout.confirm(), null);
});
