import mongoose from 'mongoose';

const SubmissionSchema = new mongoose.Schema({
  circleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Circle', required: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  country: { type: String, required: true },
  educationLevel: { type: String, required: true },
  fieldOfStudy: { type: String, required: true },
  interestedSubjects: [{ type: String }],
  agreedToCodeOfConduct: { type: Boolean, required: true },
  notified: { type: Boolean, default: false }, // if Telegram invite sent
}, { timestamps: true });

export default mongoose.models.Submission || mongoose.model('Submission', SubmissionSchema);
