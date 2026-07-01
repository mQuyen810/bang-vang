export const getCurrentPeriod = () => {
  const now = new Date();

  return `${String(now.getMonth()).padStart(2, "0")}-${now.getFullYear()}`;
};
