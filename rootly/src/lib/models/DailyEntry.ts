// src/lib/models/DailyEntry.ts
import mongoose, { Document, Schema } from 'mongoose';
import type { DailyEntry, Topic } from '@/types';

export interface DailyEntryDocument extends DailyEntry, Document {}

const topicEnum: Topic[] = [
  'hooks',
  'reconciliation',
  'rendering',
  'state',
  'routing',
  'performance',
  'other'
];

const DailyEntrySchema = new Schema<DailyEntryDocument>({
  date: {
    type: String,
    required: [true, 'Date is required'],
    unique: true,
    validate: {
      validator: function(v: string) {
        return !isNaN(Date.parse(v));
      },
      message: 'Invalid date format'
    }
  },
  studiedMinutes: {
    type: Number,
    required: [true, 'Study time is required'],
    min: [0, 'Study time cannot be negative'],
    max: [1440, 'Study time cannot exceed 24 hours']
  },
  summary: {
    type: String,
    required: [true, 'Summary is required'],
    minlength: [3, 'Summary must be at least 3 characters']
  },
  topicsTouched: {
    type: [String],
    enum: topicEnum,
    default: []
  },
  mood: {
    type: String,
    enum: ['energized', 'ok', 'tired'],
    required: false
  }
}, {
  timestamps: true
});

export default mongoose.models.DailyEntry || mongoose.model<DailyEntryDocument>('DailyEntry', DailyEntrySchema);
