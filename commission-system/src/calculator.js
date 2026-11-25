export const LIMITS = {
  locks: { min: 1, max: 70 },
  stocks: { min: 1, max: 80 },
  barrels: { min: 1, max: 90 }
};

export function validateInput({ name, employeeId, locks, stocks, barrels }) {
  const errors = [];
  if (!String(name ?? "").trim()) errors.push("กรุณากรอกชื่อพนักงาน");
  if (!String(employeeId ?? "").trim()) errors.push("กรุณากรอกรหัสพนักงาน");

  for (const field of ["locks", "stocks", "barrels"]) {
    const value = Number(field === "locks" ? locks : field === "stocks" ? stocks : barrels);
    const { min, max } = LIMITS[field];
    if (!Number.isInteger(value) || value < min || value > max) {
      errors.push(`${field} ต้องเป็นจำนวนเต็ม ${min}-${max}`);
    }
  }
  return errors;
}

export function calculateCommission(sales) {
  if (sales <= 1000) return sales * 0.10;
  if (sales <= 1800) return 100 + (sales - 1000) * 0.15;
  return 220 + (sales - 1800) * 0.20;
}

export function calculateSales({ locks, stocks, barrels }) {
  return 45 * Number(locks) + 30 * Number(stocks) + 25 * Number(barrels);
}

export function calculate({ name, employeeId, locks, stocks, barrels }) {
  const errors = validateInput({ name, employeeId, locks, stocks, barrels });
  if (errors.length) {
    const error = new Error(errors.join(" | "));
    error.status = 400;
    throw error;
  }

  const sales = calculateSales({ locks, stocks, barrels });
  const commission = calculateCommission(sales);
  const income = sales + commission;

  return {
    name: String(name).trim(),
    employeeId: String(employeeId).trim(),
    locks: Number(locks),
    stocks: Number(stocks),
    barrels: Number(barrels),
    sales,
    commission,
    income
  };
}