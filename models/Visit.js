//models/Visit.js
import mongoose from 'mongoose';

const VisitSchema = new mongoose.Schema({
  visitorName: { type: String, required: true },
  visitorTitle: { type: String, required: true },
  visitorOrganization: { type: String, required: true },
  visitPurpose: { type: String, required: true },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  isHidden: { type: Boolean, default: false },
  statusHistory: [{
    status: { type: String, enum: ['pending', 'accepted', 'rejected'] },
    timestamp: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

// Middleware to update statusHistory
VisitSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    this.statusHistory.push({
      status: this.status,
      timestamp: new Date()
    });
  }
  next();
});

export default mongoose.models.Visit || mongoose.model('Visit', VisitSchema);