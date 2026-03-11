import mongoose from 'mongoose';
const SettingsSchema = new mongoose.Schema({
  language: String,
  siteName: String,
  logoUrl: String,
  faviconUrl: String,
  email: String,
  phone: String,
  address: String,
  copyright: String,
  seoTitle: String,
  seoDesc: String,
  facebook: String,
  instagram: String,
  youtube: String,
  linkedin: String,
  whatsapp: String
}, { timestamps: true, collection: 'settings' }); // 强制指定集合名为 settings
export default mongoose.models.Settings || mongoose.model('Settings', SettingsSchema);
