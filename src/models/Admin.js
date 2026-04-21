import mongoose from 'mongoose';

const AdminSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    match: [/@theflybottle\.org$/, 'Email must end with @theflybottle.org']
  },
  password: { type: String, required: true },
  position: { type: String },
  department: { type: String },
}, { timestamps: true });

export default mongoose.models.Admin || mongoose.model('Admin', AdminSchema);
