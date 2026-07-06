export const getCurrentPeriod = () => {
  const now = new Date();

  return `${String(now.getMonth() + 1).padStart(2, "0")}-${now.getFullYear()}`;
};
