import mongoose from 'mongoose';
const ProductSchema = new mongoose.Schema({
  slug: { type: String, unique: true },
  category: String,
  language: String,
  globalData: {
    thumbnail: String,
    images: [String],
    video: String,
    hot: Boolean,
    order: Number,
    // 核心参数库
    specs: {
      thickness: String,
      heatRejection: String,
      uvRejection: String,
      vlt: String,
      warranty: String
    }
  },
  langData: {
    title: String,
    subtitle: String,
    description: String,
    features: [{ title: String, desc: String }],
    seoTitle: String,
    seoDesc: String
  }
}, { timestamps: true, collection: 'products' });
export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
