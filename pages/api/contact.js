import dbConnect from '../../lib/mongodb';
import Message from '../../models/Message';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });
  
  try {
    await dbConnect();
    // 自动兼容 message 和 content 字段
    const data = { ...req.body, content: req.body.message };
    const newMessage = await Message.create(data);
    res.status(200).json({ success: true, data: newMessage });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}
