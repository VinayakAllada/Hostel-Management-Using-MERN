import api from "./axios";

/* ================================
   STUDENT
================================ */

// get invoices visible to the logged-in student
export const getMyInvoices = () =>
  api.get("/invoices/my");

/* ================================
   ADMIN
================================ */

// get all invoices (guest hostel / admin)
export const getAllInvoices = () =>
  api.get("/invoices/admin");

// create/broadcast an invoice
export const createInvoice = (data) =>
  api.post("/invoices", data);

// mark invoice paid
export const markInvoicePaid = (id) =>
  api.patch(`/invoices/${id}/pay`);
