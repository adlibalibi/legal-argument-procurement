import mongoose from 'mongoose';

const relationshipSchema = new mongoose.Schema({
  source: { type: mongoose.Schema.Types.ObjectId, ref: 'Proposition', required: true },
  target: { type: mongoose.Schema.Types.ObjectId, ref: 'Proposition', required: true },
  type: { type: String, enum: ['supports', 'contradicts'], required: true },
  similarity: { type: Number, default: 0 }
});

export default mongoose.model('Relationship', relationshipSchema);
