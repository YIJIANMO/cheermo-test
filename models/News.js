import mongoose from 'mongoose';

const NewsSchema = new mongoose.Schema({
  title: String,
  slug: { type: String, unique: true },
  content: String,
  image: String,
  date: { type: Date, default: Date.now },
  language: String,
  category: String,
  excerpt: String,
  author: String,
  views: { type: Number, default: 0 }
});

export default mongoose.models.News || mongoose.model('News', NewsSchema);
