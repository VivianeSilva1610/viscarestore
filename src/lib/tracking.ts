const ALPHANUMERIC = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

export function generateTrackingCode(date: Date = new Date()): string {
  const datePart = date.toISOString().slice(0, 10).replace(/-/g, "");
  let randomPart = "";
  for (let i = 0; i < 5; i++) {
    randomPart += ALPHANUMERIC[Math.floor(Math.random() * ALPHANUMERIC.length)];
  }
  return `VSCA-${datePart}-${randomPart}`;
}

export interface StatusHistoryEntry {
  status: string;
  timestamp: string;
}

export const TRACKING_STAGES = {
  preparando: "Preparando entrega",
  em_transito: "Percurso em andamento",
  concluido: "Concluído",
  reembolsado: "Reembolsado",
  cancelado: "Cancelado",
} as const;

export type TrackingStatus = keyof typeof TRACKING_STAGES;
