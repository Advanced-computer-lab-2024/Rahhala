import mongoose from 'mongoose';
import Sale from '../models/sale.model.js';

// Record a Sale
export const recordSale = async ({ saleId, type, sellerId, buyerId, price, quantity = 1 }) => {
  try {
    const sale = new Sale({
      saleId,
      type,
      sellerId,
      buyerId,
      price,
      quantity,
    });

    await sale.save();
  } catch (error) {
    console.error('Error recording sale:', error);
  }
};

// Get Sales Report
export const getSalesReport = async (req, res) => {
  const sellerId = req.user.id; // Get the seller ID from the verified JWT payload

  try {
    const salesAggregation = await Sale.aggregate([
      {
        $match: { sellerId: new mongoose.Types.ObjectId(sellerId) }, // Filter by sellerId
      },
      {
        $group: {
          _id: '$type',
          count: {
            $sum: {
              $cond: [{ $eq: ['$type', 'Product'] }, '$quantity', 1], // Sum quantity for products, count for others
            },
          },
          totalRevenue: { $sum: '$price' }, // Calculate total revenue
        },
      },
    ]);

    const salesReport = {
      itineraries: { count: 0, totalRevenue: 0 },
      activities: { count: 0, totalRevenue: 0 },
      products: { count: 0, totalRevenue: 0 },
    };

    salesAggregation.forEach((sale) => {
      if (sale._id === 'Itinerary') {
        salesReport.itineraries.count = sale.count;
        salesReport.itineraries.totalRevenue = sale.totalRevenue;
      } else if (sale._id === 'Activity') {
        salesReport.activities.count = sale.count;
        salesReport.activities.totalRevenue = sale.totalRevenue;
      } else if (sale._id === 'Product') {
        salesReport.products.count = sale.count;
        salesReport.products.totalRevenue = sale.totalRevenue;
      }
    });

    res.status(200).json(salesReport);
  } catch (error) {
    console.error('Error getting sales report:', error);
    res.status(500).json({ error: 'Error getting sales report' });
  }
};

// Get Total Sales
export const getTotalSales = async (req, res) => {
  try {
    const salesAggregation = await Sale.aggregate([
      {
        $group: {
          _id: '$type',
          count: {
            $sum: {
              $cond: [{ $eq: ['$type', 'Product'] }, '$quantity', 1], // Sum quantity for products, count for others
            },
          },
          totalRevenue: { $sum: '$price' }, // Calculate total revenue
        },
      },
    ]);

    const totalSales = {
      itineraries: { count: 0, totalRevenue: 0 },
      activities: { count: 0, totalRevenue: 0 },
      products: { count: 0, totalRevenue: 0 },
    };

    salesAggregation.forEach((sale) => {
      if (sale._id === 'Itinerary') {
        totalSales.itineraries.count = sale.count;
        totalSales.itineraries.totalRevenue = sale.totalRevenue;
      } else if (sale._id === 'Activity') {
        totalSales.activities.count = sale.count;
        totalSales.activities.totalRevenue = sale.totalRevenue;
      } else if (sale._id === 'Product') {
        totalSales.products.count = sale.count;
        totalSales.products.totalRevenue = sale.totalRevenue;
      }
    });

    res.status(200).json(totalSales);
  } catch (error) {
    console.error('Error getting total sales:', error);
    res.status(500).json({ error: 'Error getting total sales' });
  }
};


export const getFilteredSalesReport = async (req, res) => {
  const sellerId = req.user.id; // Get the seller ID from the verified JWT payload
  const { type, startDate, endDate, month, year } = req.body; // Use body instead of query

  try {
    const matchConditions = { sellerId: new mongoose.Types.ObjectId(sellerId) };

    if (type) {
      matchConditions.type = type;
    }

    if (startDate && endDate) {
      matchConditions.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    } else if (month && year) {
      matchConditions.createdAt = {
        $gte: new Date(`${year}-${month}-01`),
        $lt: new Date(`${year}-${parseInt(month) + 1}-01`),
      };
    }

    const salesAggregation = await Sale.aggregate([
      {
        $match: matchConditions, // Filter by sellerId and other conditions
      },
      {
        $group: {
          _id: '$type',
          count: {
            $sum: {
              $cond: [{ $eq: ['$type', 'Product'] }, '$quantity', 1], // Sum quantity for products, count for others
            },
          },
          totalRevenue: { $sum: '$price' }, // Calculate total revenue
        },
      },
    ]);

    const salesReport = {
      itineraries: { count: 0, totalRevenue: 0 },
      activities: { count: 0, totalRevenue: 0 },
      products: { count: 0, totalRevenue: 0 },
    };

    salesAggregation.forEach((sale) => {
      if (sale._id === 'Itinerary') {
        salesReport.itineraries.count = sale.count;
        salesReport.itineraries.totalRevenue = sale.totalRevenue;
      } else if (sale._id === 'Activity') {
        salesReport.activities.count = sale.count;
        salesReport.activities.totalRevenue = sale.totalRevenue;
      } else if (sale._id === 'Product') {
        salesReport.products.count = sale.count;
        salesReport.products.totalRevenue = sale.totalRevenue;
      }
    });

    res.status(200).json(salesReport);
  } catch (error) {
    console.error('Error getting filtered sales report:', error);
    res.status(500).json({ error: 'Error getting filtered sales report' });
  }
};