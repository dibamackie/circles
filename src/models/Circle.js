import mongoose from 'mongoose';

const CircleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  status: { 
    type: String, 
    enum: ['draft', 'active', 'closed'],
    default: 'draft'
  },
  capacity: { type: Number, default: 0 }, // 0 means unlimited
  telegramLink: { type: String, default: '' },
}, { timestamps: true });

export default mongoose.models.Circle || mongoose.model('Circle', CircleSchema);
