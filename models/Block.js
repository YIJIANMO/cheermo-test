import mongoose from 'mongoose';
const BlockSchema = new mongoose.Schema({
  key: { type: String, unique: true },
  globalData: mongoose.Schema.Types.Mixed,
  langData: mongoose.Schema.Types.Mixed
}, { timestamps: true, collection: 'blocks' }); // 强制指定集合名为 blocks
export default mongoose.models.Block || mongoose.model('Block', BlockSchema);
