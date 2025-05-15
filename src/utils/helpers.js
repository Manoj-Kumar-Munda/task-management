export const isExpired = (date) => {
  return new Date() > new Date(date);
};
