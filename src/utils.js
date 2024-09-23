export const makeNewValue = (val, newVal) => {
  if (!val || !newVal) {
    return newVal;
  }
  if (typeof val === "object" && !Array.isArray(val)) {
    return { ...val, ...newVal };
  }
  return newVal;
};
