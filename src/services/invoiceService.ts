import apiClient from './apiClient';

export interface InvoiceItem {
  id?: string;
  description: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface Invoice {
  id: string;
  client_id: string;
  invoice_number: string;
  issue_date: string;
  due_date: string;
  subtotal: number;
  tax: number;
  discount: number;
  total_amount: number;
  status: "draft" | "sent" | "paid" | "partially_paid" | "overdue" | "cancelled";
  notes?: string;
  items: InvoiceItem[];
}

export const getAllInvoices = async () => {
  const response = await apiClient.get('/invoices');
  return response.data;
};

export const createInvoice = async (invoiceData: Partial<Invoice>) => {
  const response = await apiClient.post('/invoices', invoiceData);
  return response.data;
};

export const updateInvoice = async (id: string, invoiceData: Partial<Invoice>) => {
  const response = await apiClient.put(`/invoices/${id}`, invoiceData);
  return response.data;
};

export const deleteInvoice = async (id: string) => {
  const response = await apiClient.delete(`/invoices/${id}`);
  return response.data;
};

export const downloadPDF = async (id: string) => {
  const response = await apiClient.get(`/invoices/${id}/pdf`);
  return response.data;
};

export const sendEmail = async (id: string) => {
  const response = await apiClient.post(`/invoices/${id}/send`);
  return response.data;
};
