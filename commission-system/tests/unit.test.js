import test from "node:test";
import assert from "node:assert/strict";
import { calculateSales, calculateCommission, calculate, validateInput } from "../src/calculator.js";

test("Sales formula is correct", () => {
  assert.equal(calculateSales({ locks: 10, stocks: 20, barrels: 30 }), 1800);
});

test("Commission <= 1000 is 10%", () => assert.equal(calculateCommission(1000), 100));
test("Commission 1800 is 220", () => assert.equal(calculateCommission(1800), 220));
test("Commission above 1800 uses 20% excess", () => assert.equal(calculateCommission(2000), 260));

test("Boundary values are accepted", () => {
  assert.deepEqual(validateInput({
    name: "Test", employeeId: "E1", locks: 1, stocks: 1, barrels: 1
  }), []);
  assert.deepEqual(validateInput({
    name: "Test", employeeId: "E1", locks: 70, stocks: 80, barrels: 90
  }), []);
});

test("Invalid ranges are rejected", () => {
  assert.ok(validateInput({
    name: "Test", employeeId: "E1", locks: 0, stocks: 81, barrels: 91
  }).length >= 3);
});

test("Full calculation returns sales, commission and income", () => {
  const r = calculate({ name: "A", employeeId: "E1", locks: 10, stocks: 20, barrels: 30 });
  assert.equal(r.sales, 1800);
  assert.equal(r.commission, 220);
  assert.equal(r.income, 2020);
});