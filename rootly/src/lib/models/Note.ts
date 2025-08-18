// src/lib/models/Note.ts
import mongoose, { Document, Schema } from 'mongoose';
import type { Note, Topic } from '@/types';

export interface NoteDocument extends Note, Document {}

const topicEnum: Topic[] = [
  'hooks',
  'reconciliation',
  'rendering',
  'state',
  'routing',
  'performance',
  'other'
];

const NoteSchema = new Schema<NoteDocument>({
  courseId: {
    type: String,
    required: [true, 'Course ID is required'],
    ref: 'Course'
  },
  question: {
    type: String,
    required: [true, 'Question is required'],
    minlength: [5, 'Question must be at least 5 characters'],
  },
  topics: {
    type: [String],
    enum: topicEnum,
    validate: {
      validator: function(v: Topic[]) {
        return v && v.length > 0;
      },
      message: 'At least one topic is required'
    }
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'answered'],
    default: 'active'
  },
  understanding: {
    type: Number,
    required: [true, 'Understanding level is required'],
    min: [0, 'Understanding must be at least 0'],
    max: [100, 'Understanding must be at most 100']
  },
  flags: {
    focus: {
      type: Boolean,
      default: false
    },
    blackBox: {
      type: Boolean,
      default: false
    },
    mastered: {
      type: Boolean,
      default: false
    }
  },
  createdAt: {
    type: String,
    default: () => new Date().toISOString()
  },
  updatedAt: {
    type: String,
    default: () => new Date().toISOString()
  }
}, {
  timestamps: false // We're managing timestamps manually
});

// Update the updatedAt field before saving
NoteSchema.pre('save', function(next) {
  this.updatedAt = new Date().toISOString();
  next();
});

export default mongoose.models.Note || mongoose.model<NoteDocument>('Note', NoteSchema);
