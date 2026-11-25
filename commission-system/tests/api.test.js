import test from "node:test";
import assert from "node:assert/strict";
import { app, history } from "../src/server.js";

let server;
let base;

test.before(async () => {
  history.length = 0;
  server = app.listen(0);
  const { port } = server.address();
  base = `http://127.0.0.1:${port}`;
});

test.after(() => server.close());

test("POST /api/calculate returns 201", async () => {
  const response = await fetch(`${base}/api/calculate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "API Test", employeeId: "API001", locks: 1, stocks: 1, barrels: 1
    })
  });
  assert.equal(response.status, 201);
  const body = await response.json();
  assert.equal(body.sales, 100);
  assert.equal(body.commission, 10);
  assert.equal(body.income, 110);
});

test("POST /api/calculate rejects invalid input", async () => {
  const response = await fetch(`${base}/api/calculate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "", employeeId: "", locks: 0, stocks: 81, barrels: 91
    })
  });
  assert.equal(response.status, 400);
});

test("GET /api/history supports 5/10/20", async () => {
  const response = await fetch(`${base}/api/history?limit=5`);
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.ok(Array.isArray(body));
});

test("GET /api/history rejects invalid limit", async () => {
  const response = await fetch(`${base}/api/history?limit=7`);
  assert.equal(response.status, 400);
});