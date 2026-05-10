import api from "./axiosConfig";

// ================= SUMMARY =================

export const getSummary = async () => {
  const response = await api.get("/admin/dashboard/summary");
  return response.data;
};

// ================= WEEKLY SALES =================

export const getWeeklySales = async () => {
  const response = await api.get("/admin/dashboard/weekly-sales");
  return response.data;
};

// ================= CATEGORY SALES =================

export const getCategorySales = async () => {
  const response = await api.get("/admin/dashboard/category-sales");
  return response.data;
};

// ================= LOW STOCK =================

export const getLowStock = async () => {
  const response = await api.get("/admin/dashboard/low-stock");
  return response.data;
};

// ================= ACTIVE ORDERS =================

export const getActiveOrders = async () => {
  const response = await api.get("/admin/dashboard/active-orders");
  return response.data;
};
