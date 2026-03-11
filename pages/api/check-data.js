import dbConnect from '../../lib/mongodb';
import mongoose from 'mongoose';

export default async function handler(req, res) {
  try {
    await dbConnect();
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);

    // 重点排查商品数据
    const products = await mongoose.connection.db.collection('products').find({}).toArray();
    const rawBlocks = await mongoose.connection.db.collection('blocks').find({}).toArray();

    res.status(200).json({
      database: mongoose.connection.name,
      allCollections: collectionNames,
      productCount: products.length,
      sampleProduct: products[0] || "No products found in 'products' collection",
      availableBlockKeys: rawBlocks.map(b => b.key)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
