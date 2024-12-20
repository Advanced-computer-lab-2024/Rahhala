import express from 'express';
import { getFilteredSalesReport, getSalesReport,
    getTotalSales,
    getTotalTouristsForUser,
    filterTotalTouristsForUser
 } from '../controllers/sale.controller.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/totalSales', getTotalSales);
router.get('/salesReport', verifyToken, getSalesReport);
router.get('/totalTourists', verifyToken, getTotalTouristsForUser);
router.post('/filterSalesReport', verifyToken, getFilteredSalesReport);
router.post('/filterTotalTourists', verifyToken, filterTotalTouristsForUser);


export default router;