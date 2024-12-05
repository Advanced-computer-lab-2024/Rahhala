import express from 'express';
import { getFilteredSalesReport, getSalesReport,
    getTotalSales
 } from '../controllers/sale.controller.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/totalSales', getTotalSales);
router.get('/salesReport', verifyToken, getSalesReport);
router.get('/filterSalesReport', verifyToken, getFilteredSalesReport);

export default router;