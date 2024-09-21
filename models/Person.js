// models/Person.js
import mongoose from 'mongoose';

const PersonSchema = new mongoose.Schema({
  name: { type: String, required: true },
  title: { type: String, required: true },
  organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.models.Person || mongoose.model('Person', PersonSchema);