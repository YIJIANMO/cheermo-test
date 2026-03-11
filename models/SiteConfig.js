import mongoose from 'mongoose';
const SiteConfigSchema = new mongoose.Schema({
  moduleName: { type: String, required: true },
  language: { type: String, default: '1' },
  data: { type: mongoose.Schema.Types.Mixed, default: {} }
}, { timestamps: true });
SiteConfigSchema.index({ moduleName: 1, language: 1 }, { unique: true });
export default mongoose.models.SiteConfig || mongoose.model('SiteConfig', SiteConfigSchema);
