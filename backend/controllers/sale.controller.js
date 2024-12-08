import mongoose from 'mongoose';
import Sale from '../models/sale.model.js';
import touristModel from "../models/tourist.model.js";
import itineraryModel from "../models/itinerary.model.js";
import activityModel from "../models/activity.model.js";

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
  console.log("entered getSalesReport")
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
    console.log(salesReport)

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


export const getFilteredSalesReport = async (req, res) => { //type is Activity or Itinerary or Product capital first letter
  console.log("entered getFilteredSalesReport")
  const sellerId = req.user.id; // Get the seller ID from the verified JWT payload
  const { type, startDate, endDate, month, year } = req.body; // Use body instead of query
  console.log("req.body",req.body)

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

// Get Total Tourists for User's Itineraries and Activities
export const getTotalTouristsForUser = async (req, res) => {
  const userId = req.user.id; // Get the user ID from the verified JWT payload

  try {
    // Find all itineraries and activities created by the user
    const itineraries = await itineraryModel.find({ userId: new mongoose.Types.ObjectId(userId) }).select('_id availableDates name');
    const activities = await activityModel.find({ userId: new mongoose.Types.ObjectId(userId) }).select('_id date name');

    const itineraryIds = itineraries.map(itinerary => itinerary._id);
    const activityIds = activities.map(activity => activity._id);

    const currentDate = new Date();

    console.log("itineraryIds before filter", itineraryIds)
    console.log("activityIds before filter", activityIds)

    // Filter itineraries and activities to include only those with dates that have passed
    const pastItineraryIds = itineraries
      .filter(itinerary => itinerary.availableDates.some(date => new Date(date) < currentDate))
      .map(itinerary => itinerary._id);

    const pastActivityIds = activities
      .filter(activity => new Date(activity.date) < currentDate)
      .map(activity => activity._id);

    console.log("itineraryIds after filter", pastItineraryIds)
    console.log("activityIds after filter", pastActivityIds)

    // Count tourists who booked these itineraries and activities
    const totalTourists = await touristModel.aggregate([
      {
        $match: {
          $or: [
            { bookedItineraries: { $in: pastItineraryIds } },
            { bookedActivities: { $in: pastActivityIds } }
          ]
        }
      },
      {
        $unwind: {
          path: "$bookedItineraries",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $unwind: {
          path: "$bookedActivities",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: 'itineraries',
          localField: 'bookedItineraries',
          foreignField: '_id',
          as: 'itineraryDetails'
        }
      },
      {
        $lookup: {
          from: 'activities',
          localField: 'bookedActivities',
          foreignField: '_id',
          as: 'activityDetails'
        }
      },
      {
        $addFields: {
          itineraryDetails: { $arrayElemAt: ["$itineraryDetails", 0] },
          activityDetails: { $arrayElemAt: ["$activityDetails", 0] }
        }
      },
      {
        $match: {
          $or: [
            { "itineraryDetails._id": { $in: pastItineraryIds } },
            { "activityDetails._id": { $in: pastActivityIds } }
          ]
        }
      },
      {
        $group: {
          _id: {
            $cond: {
              if: { $in: ["$bookedItineraries", pastItineraryIds] },
              then: "$itineraryDetails.name",
              else: "$activityDetails.name"
            }
          },
          count: { $sum: 1 }
        }
      }
    ]);

    const result = totalTourists.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});

    res.status(200).json(result);
  } catch (error) {
    console.error('Error getting total tourists:', error);
    res.status(500).json({ error: 'Error getting total tourists' });
  }
};

// Get Total Tourists for User's Itineraries and Activities within a Date Range
export const getTotalTouristsForUserByDateRange = async (req, res) => {
  const userId = req.user.id; // Get the user ID from the verified JWT payload
  const { startDate, endDate } = req.body; // Get the start and end dates from the query parameters

  try {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const currentDate = new Date();

    console.log("start", start)
    console.log("end", end)
    console.log("currentDate", currentDate)


    // Find all itineraries and activities created by the user within the date range
    const itineraries = await itineraryModel.find({
      userId: new mongoose.Types.ObjectId(userId),
      availableDates: { $elemMatch: { $gte: start, $lte: end } }
    }).select('_id availableDates name');

    const activities = await activityModel.find({
      userId: new mongoose.Types.ObjectId(userId),
      date: { $gte: start, $lte: end }
    }).select('_id date name');

    console.log("itineraries before filter", itineraries)
    console.log("activities before filter", activities)
    
    // Filter itineraries and activities to include only those with dates that have passed
    const pastItineraryIds = itineraries
      .filter(itinerary => itinerary.availableDates.some(date => new Date(date) < currentDate))
      .map(itinerary => itinerary._id);

    const pastActivityIds = activities
      .filter(activity => new Date(activity.date) < currentDate)
      .map(activity => activity._id);

    console.log("itineraries after filter", pastItineraryIds)
    console.log("activities after filter", pastActivityIds)

    // Count tourists who booked these itineraries and activities
    const totalTourists = await touristModel.aggregate([
      {
        $match: {
          $or: [
            { bookedItineraries: { $in: pastItineraryIds } },
            { bookedActivities: { $in: pastActivityIds } }
          ]
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({ totalTourists: totalTourists.length > 0 ? totalTourists[0].total : 0 });
  } catch (error) {
    console.error('Error getting total tourists:', error);
    res.status(500).json({ message: 'Error getting total tourists' });
  }
};

// Get Total Tourists for User's Itineraries and Activities
export const filterTotalTouristsForUser = async (req, res) => {
  const userId = req.user.id; // Get the user ID from the verified JWT payload
  const { startDate, endDate } = req.body; // Get the start and end dates from the query parameters
  console.log("body is ",req.body)
  try {
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    console.log("start", start)
    console.log("end", end) 

    // Find all itineraries and activities created by the user
    const itineraries = await itineraryModel.find({ userId: new mongoose.Types.ObjectId(userId) }).select('_id availableDates name');
    const activities = await activityModel.find({ userId: new mongoose.Types.ObjectId(userId) }).select('_id date name');

    const itineraryIds = itineraries.map(itinerary => itinerary._id);
    const activityIds = activities.map(activity => activity._id);

    const currentDate = new Date();

    console.log("itineraryIds before filter", itineraryIds)
    console.log("activityIds before filter", activityIds)
    console.log("start", start)
    console.log("end", end)

    // Filter itineraries and activities to include only those with dates that have passed and are within the date range
    const pastItineraryIds = itineraries
      .filter(itinerary => itinerary.availableDates.some(date => {
        const itineraryDate = new Date(date);
        console.log("passed itineraryDate", itineraryDate)
        return itineraryDate < currentDate && itineraryDate >= start && itineraryDate <= end;
      }))
      .map(itinerary => itinerary._id);

    const pastActivityIds = activities
      .filter(activity => {
        const activityDate = new Date(activity.date);
        console.log("passed activityDate", activityDate)
        return activityDate < currentDate && activityDate >= start && activityDate <= end;
      })
      .map(activity => activity._id);

    console.log("itineraryIds after filter", pastItineraryIds)
    console.log("activityIds after filter", pastActivityIds)

    // Count tourists who booked these itineraries and activities
    const totalTourists = await touristModel.aggregate([
      {
        $match: {
          $or: [
            { bookedItineraries: { $in: pastItineraryIds } },
            { bookedActivities: { $in: pastActivityIds } }
          ]
        }
      },
      {
        $unwind: {
          path: "$bookedItineraries",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $unwind: {
          path: "$bookedActivities",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: 'itineraries',
          localField: 'bookedItineraries',
          foreignField: '_id',
          as: 'itineraryDetails'
        }
      },
      {
        $lookup: {
          from: 'activities',
          localField: 'bookedActivities',
          foreignField: '_id',
          as: 'activityDetails'
        }
      },
      {
        $addFields: {
          itineraryDetails: { $arrayElemAt: ["$itineraryDetails", 0] },
          activityDetails: { $arrayElemAt: ["$activityDetails", 0] }
        }
      },
      {
        $match: {
          $or: [
            { "itineraryDetails._id": { $in: pastItineraryIds } },
            { "activityDetails._id": { $in: pastActivityIds } }
          ]
        }
      },
      {
        $group: {
          _id: {
            $cond: {
              if: { $in: ["$bookedItineraries", pastItineraryIds] },
              then: "$itineraryDetails.name",
              else: "$activityDetails.name"
            }
          },
          count: { $sum: 1 }
        }
      }
    ]);

    const result = totalTourists.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});

    res.status(200).json(result);
  } catch (error) {
    console.error('Error getting total tourists:', error);
    res.status(500).json({ error: 'Error getting total tourists' });
  }
};
