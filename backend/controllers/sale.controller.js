import Sale from '../models/sale.model.js';

// Record a Sale
export const recordSale = async ({saleId, type, sellerId, buyerId}) => {
    console.log("entered recordSale");
    console.log("saleId is ", saleId);
  
  try {
    const sale = new Sale({
      saleId,
      type,
      sellerId,
      buyerId,
    });

    await sale.save();
  } catch (error) {
    console.error('Error recording sale:', error);
  }
};