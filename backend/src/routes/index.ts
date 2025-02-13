import express from 'express';
import {
  addCustomer,
  deleteCustomer,
  getAllCustomers,
  getCustomerDetails,
  searchCustomerByName,
  filterCustomerByLevel,
  updateCustomer,
} from '../controllers/customerController';
import { createTransaction } from '../controllers/transactionController';

const router = express.Router();

router.post('/customers', addCustomer); // Menambahkan pelanggan baru
router.get('/customers/search', searchCustomerByName); // Mencari pelanggan berdasarkan nama
router.get('/customers/filter', filterCustomerByLevel); // Menyaring pelanggan berdasarkan level
router.get('/customers', getAllCustomers); // Mendapatkan semua pelanggan dengan paginasi
router.get('/customers/:id', getCustomerDetails); // Mendapatkan detail pelanggan berdasarkan ID
router.delete('/customers/:id', deleteCustomer); // Menghapus pelanggan (soft delete)
router.put('/customers/:id', updateCustomer); // Memperbarui data pelanggan

// Transaction Routes
router.post('/transactions', createTransaction); // Membuat transaksi baru

export default router;