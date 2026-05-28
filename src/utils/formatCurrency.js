/** Menu prices in `food_list` are stored in INR (whole rupees). */
const inrFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export function formatInr(amount) {
  return inrFormatter.format(Math.round(Number(amount)));
}

/** Flat delivery fee in INR */
export const DELIVERY_FEE_INR = 40;
