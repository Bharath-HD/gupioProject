const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const mongoose = require('mongoose');

// GET /api/orders
router.get('/', async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 }).populate('items.productId');
  res.json(orders);
});

// GET /api/orders/:id
router.get('/:id', async (req, res) => {
  const order = await Order.findById(req.params.id).populate('items.productId');
  if(!order) return res.status(404).json({message:'Order not found'});
  res.json(order);
});

// POST /api/orders  (transactional: reduce stock)
router.post('/', async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try{
    const { items } = req.body; // items: [{ productId, qty }]
    if(!items || !items.length) throw new Error('No items provided');

    // Fetch products and check stock
    const productIds = items.map(i => i.productId);
    const products = await Product.find({ _id: { $in: productIds } }).session(session);

    let total = 0;
    // map for quick access
    const prodMap = {};
    products.forEach(p => prodMap[p._id.toString()] = p);

    for(const it of items){
      const p = prodMap[it.productId];
      if(!p) throw new Error(`Product ${it.productId} not found`);
      if(p.stock < it.qty) throw new Error(`Insufficient stock for ${p.name}`);
      total += p.price * it.qty;
      p.stock -= it.qty;
      await p.save({ session });
    }

    const order = new Order({ items, totalAmount: total });
    await order.save({ session });

    await session.commitTransaction();
    session.endSession();

    const populated = await order.populate('items.productId').execPopulate();
    res.status(201).json(populated);
  }catch(err){
    await session.abortTransaction();
    session.endSession();
    res.status(400).json({message: err.message});
  }
});

module.exports = router;
