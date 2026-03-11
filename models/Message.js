import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, default: '' },
  message: { type: String, required: true },
  content: { type: String }, // 兼容某些后台叫 content 的情况
  isRead: { type: Boolean, default: false },
  status: { type: Number, default: 0 }
}, { timestamps: true, strict: false });

export default mongoose.models.Message || mongoose.model('Message', MessageSchema);
