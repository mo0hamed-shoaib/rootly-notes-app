// src/lib/models/Course.ts
import mongoose, { Document, Schema } from 'mongoose';
import type { Course, Topic } from '@/types';

export interface CourseDocument extends Course, Document {}

const topicEnum: Topic[] = [
  'hooks',
  'reconciliation',
  'rendering', 
  'state',
  'routing',
  'performance',
  'other'
];

const CourseSchema = new Schema<CourseDocument>({
  instructor: {
    type: String,
    required: [true, 'Instructor is required'],
    minlength: [2, 'Instructor name must be at least 2 characters'],
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    minlength: [2, 'Title must be at least 2 characters'],
  },
  links: {
    course: {
      type: String,
      validate: {
        validator: function(v: string) {
          if (!v || v === '') return true;
          try {
            new URL(v);
            return true;
          } catch {
            return false;
          }
        },
        message: 'Course link must be a valid URL'
      }
    },
    repo: {
      type: String,
      validate: {
        validator: function(v: string) {
          if (!v || v === '') return true;
          try {
            new URL(v);
            return true;
          } catch {
            return false;
          }
        },
        message: 'Repo link must be a valid URL'
      }
    },
    docs: {
      type: String,
      validate: {
        validator: function(v: string) {
          if (!v || v === '') return true;
          try {
            new URL(v);
            return true;
          } catch {
            return false;
          }
        },
        message: 'Docs link must be a valid URL'
      }
    }
  },
  version: {
    type: String,
  },
  startedAt: {
    type: String,
    required: [true, 'Start date is required'],
    validate: {
      validator: function(v: string) {
        return !isNaN(Date.parse(v));
      },
      message: 'Invalid date format'
    }
  },
  tags: {
    type: [String],
    enum: topicEnum,
    validate: {
      validator: function(v: Topic[]) {
        return v && v.length > 0;
      },
      message: 'At least one topic is required'
    }
  }
}, {
  timestamps: true
});

export default mongoose.models.Course || mongoose.model<CourseDocument>('Course', CourseSchema);
