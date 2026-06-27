export function getEstimatedDeliveryDate(deliveryDays: number, fromDate: Date = new Date()): Date {
  const date = new Date(fromDate);
  date.setDate(date.getDate() + 1);

  let remainingBusinessDays = deliveryDays;
  while (remainingBusinessDays > 0) {
    const dayOfWeek = date.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      remainingBusinessDays -= 1;
    }
    if (remainingBusinessDays > 0) {
      date.setDate(date.getDate() + 1);
    }
  }

  return date;
}

export function formatDeliveryDate(date: Date, language: "pt" | "it" = "pt"): string {
  const locale = language === "it" ? "it-IT" : "pt-BR";
  return date.toLocaleDateString(locale, { day: "numeric", month: "long" });
}
