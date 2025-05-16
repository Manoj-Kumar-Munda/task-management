import crypto from "crypto";
export const isExpired = (date) => {
  return new Date() > new Date(date);
};

export const generateRandomToken = () => {
  return crypto.randomBytes(32).toString("hex");
};
