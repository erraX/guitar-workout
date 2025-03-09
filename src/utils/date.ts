import { format } from "date-fns";

export const getCurrentYear = () => {
  return Number(format(new Date(), "yyyy"));
};
