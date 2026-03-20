// Utility function to remove Vietnamese diacritics for search
export const removeVietnameseDiacritics = (str: string): string => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();
};

// Search function that matches without requiring exact diacritics
export const searchMatch = (searchQuery: string, ...fields: (string | undefined)[]): boolean => {
  const normalizedQuery = removeVietnameseDiacritics(searchQuery.trim());
  
  if (!normalizedQuery) return true;
  
  return fields.some((field) => {
    if (!field) return false;
    const normalizedField = removeVietnameseDiacritics(field);
    return normalizedField.includes(normalizedQuery);
  });
};
