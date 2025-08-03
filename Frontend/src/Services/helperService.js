// export const BASE_URL = `http://localhost:8091`;
export const BASE_URL = `http://44.203.50.200:8091`;

export const ADMIN_ORDER_PAGE_SIZE = 5;
export const USER_PAGE_SIZE = 4;
export const ORDER_STATUS = ["PENDING", "DISPATCHED", "ON-WAY", "DELIVERED"];
export const formattedDate = (date) =>
  new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
