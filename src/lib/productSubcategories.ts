export const SKINCARE_SUBCATEGORIES = [
  { value: "rosto", label_pt: "Rosto", label_it: "Viso" },
  { value: "corpo", label_pt: "Corpo", label_it: "Corpo" },
  { value: "maos", label_pt: "Mãos", label_it: "Mani" },
] as const;

export const PERFUME_SUBCATEGORIES = [
  { value: "feminino", label_pt: "Feminino", label_it: "Femminile" },
  { value: "masculino", label_pt: "Masculino", label_it: "Maschile" },
  { value: "unissex", label_pt: "Unissex", label_it: "Unisex" },
] as const;

export function isSkincareCategory(category?: string) {
  return (category || "").trim().toLowerCase() === "skincare";
}

export function isPerfumeCategory(category?: string) {
  const c = (category || "").trim().toLowerCase();
  return c === "perfumes" || c === "alta-perfumaria";
}

export function getSubcategoryOptions(category?: string) {
  if (isSkincareCategory(category)) return SKINCARE_SUBCATEGORIES;
  if (isPerfumeCategory(category)) return PERFUME_SUBCATEGORIES;
  return null;
}
