// models/Organization.js
import mongoose from 'mongoose';

const OrganizationSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.models.Organization || mongoose.model('Organization', OrganizationSchema);