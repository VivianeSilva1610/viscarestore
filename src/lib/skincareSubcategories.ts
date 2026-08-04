export const SKINCARE_SUBCATEGORIES = [
  { value: "rosto", label_pt: "Rosto", label_it: "Viso" },
  { value: "corpo", label_pt: "Corpo", label_it: "Corpo" },
  { value: "maos", label_pt: "Mãos", label_it: "Mani" },
] as const;

export function isSkincareCategory(category?: string) {
  return (category || "").trim().toLowerCase() === "skincare";
}
