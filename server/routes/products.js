const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// GET /api/products
router.get('/', async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });
  res.json(products);
});

// POST /api/products
router.post('/', async (req, res) => {
  try{
    const { name, price, stock, category } = req.body;
    if(!name || price == null) return res.status(400).json({message:'name and price required'});
    const p = new Product({ name, price, stock: stock || 0, category });
    await p.save();
    res.status(201).json(p);
  }catch(err){ res.status(500).json({message:err.message}); }
});

module.exports = router;
