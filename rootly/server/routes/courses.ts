// server/routes/courses.ts
import express from 'express';
import { z } from 'zod';
import Course from '../../src/lib/models/Course';
import Note from '../../src/lib/models/Note';
import { courseSchema } from '../../src/lib/zod/course';
import { asyncHandler, createError } from '../middleware/errorHandler';
import { validateBody, validateParams } from '../middleware/validation';

const router = express.Router();

// Validation schemas
const courseIdSchema = z.object({
  id: z.string().min(1, 'Course ID is required'),
});

const updateCourseSchema = courseSchema.partial();

// GET /api/courses - Get all courses
router.get('/', asyncHandler(async (req, res) => {
  const courses = await Course.find().sort({ startedAt: -1 });

  res.json({
    success: true,
    data: courses,
  });
}));

// GET /api/courses/:id - Get single course
router.get('/:id', validateParams(courseIdSchema), asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  
  if (!course) {
    throw createError('Course not found', 404);
  }

  res.json({
    success: true,
    data: course,
  });
}));

// GET /api/courses/:id/notes - Get all notes for a course
router.get('/:id/notes', validateParams(courseIdSchema), asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  
  if (!course) {
    throw createError('Course not found', 404);
  }

  const notes = await Note.find({ courseId: req.params.id }).sort({ updatedAt: -1 });

  res.json({
    success: true,
    data: notes,
  });
}));

// GET /api/courses/:id/stats - Get course statistics
router.get('/:id/stats', validateParams(courseIdSchema), asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  
  if (!course) {
    throw createError('Course not found', 404);
  }

  const totalNotes = await Note.countDocuments({ courseId: req.params.id });
  const answeredNotes = await Note.countDocuments({ courseId: req.params.id, status: 'answered' });
  const focusNotes = await Note.countDocuments({ courseId: req.params.id, 'flags.focus': true });
  
  // Average understanding for this course
  const avgResult = await Note.aggregate([
    { $match: { courseId: req.params.id } },
    { $group: { _id: null, avgUnderstanding: { $avg: '$understanding' } } }
  ]);
  const avgUnderstanding = avgResult.length > 0 ? Math.round(avgResult[0].avgUnderstanding) : 0;

  // Topic distribution for this course
  const topicStats = await Note.aggregate([
    { $match: { courseId: req.params.id } },
    { $unwind: '$topics' },
    { $group: { _id: '$topics', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);

  res.json({
    success: true,
    data: {
      totalNotes,
      answeredNotes,
      focusNotes,
      avgUnderstanding,
      completionRate: totalNotes > 0 ? Math.round((answeredNotes / totalNotes) * 100) : 0,
      topicStats,
    },
  });
}));

// POST /api/courses - Create new course
router.post('/', validateBody(courseSchema), asyncHandler(async (req, res) => {
  const course = new Course(req.body);
  await course.save();

  res.status(201).json({
    success: true,
    data: course,
    message: 'Course created successfully',
  });
}));

// PATCH /api/courses/:id - Update course
router.patch('/:id', validateParams(courseIdSchema), validateBody(updateCourseSchema), asyncHandler(async (req, res) => {
  const course = await Course.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!course) {
    throw createError('Course not found', 404);
  }

  res.json({
    success: true,
    data: course,
    message: 'Course updated successfully',
  });
}));

// DELETE /api/courses/:id - Delete course
router.delete('/:id', validateParams(courseIdSchema), asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    throw createError('Course not found', 404);
  }

  // Check if course has associated notes
  const noteCount = await Note.countDocuments({ courseId: req.params.id });
  if (noteCount > 0) {
    throw createError('Cannot delete course with associated notes. Delete notes first.', 400);
  }

  await Course.findByIdAndDelete(req.params.id);

  res.json({
    success: true,
    message: 'Course deleted successfully',
  });
}));

export default router;
