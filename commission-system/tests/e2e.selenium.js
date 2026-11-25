import { Builder, By, until } from "selenium-webdriver";
import assert from "node:assert/strict";

const driver = await new Builder().forBrowser(process.env.BROWSER || "chrome").build();
try {
  const base = process.env.BASE_URL || "http://localhost:3000";
  await driver.get(base);
  await driver.findElement(By.id("name")).sendKeys("Selenium User");
  await driver.findElement(By.id("employeeId")).sendKeys("SEL001");
  await driver.findElement(By.id("locks")).sendKeys("10");
  await driver.findElement(By.id("stocks")).sendKeys("20");
  await driver.findElement(By.id("barrels")).sendKeys("30");
  await driver.findElement(By.css("button[type='submit']")).click();
  await driver.wait(until.elementIsVisible(await driver.findElement(By.id("result"))), 5000);
  const income = await driver.findElement(By.id("income")).getText();
  assert.equal(income, "$2920.00");
  console.log("E2E Selenium test passed");
} finally {
  await driver.quit();
}