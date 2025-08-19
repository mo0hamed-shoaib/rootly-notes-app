// server/routes/courses.ts
import express, { Request, Response } from 'express';
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
router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const courses = await Course.find().sort({ startedAt: -1 });

  res.json({
    data: courses,
    message: 'Courses fetched successfully',
    error: null,
  });
}));

// GET /api/courses/:id - Get single course
router.get('/:id', validateParams(courseIdSchema), asyncHandler(async (req: Request, res: Response) => {
  const course = await Course.findById(req.params.id);
  
  if (!course) {
    throw createError('Course not found', 404);
  }

  res.json({
    data: course,
    message: 'Course fetched successfully',
    error: null,
  });
}));

// GET /api/courses/:id/notes - Get all notes for a course
router.get('/:id/notes', validateParams(courseIdSchema), asyncHandler(async (req: Request, res: Response) => {
  const course = await Course.findById(req.params.id);
  
  if (!course) {
    throw createError('Course not found', 404);
  }

  const notes = await Note.find({ courseId: req.params.id }).sort({ updatedAt: -1 });

  res.json({
    data: notes,
    message: 'Course notes fetched successfully',
    error: null,
  });
}));

// GET /api/courses/:id/stats - Get course statistics
router.get('/:id/stats', validateParams(courseIdSchema), asyncHandler(async (req: Request, res: Response) => {
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
    data: {
      totalNotes,
      answeredNotes,
      focusNotes,
      avgUnderstanding,
      completionRate: totalNotes > 0 ? Math.round((answeredNotes / totalNotes) * 100) : 0,
      topicStats,
    },
    message: 'Course stats fetched successfully',
    error: null,
  });
}));

// POST /api/courses - Create new course
router.post('/', validateBody(courseSchema), asyncHandler(async (req: Request, res: Response) => {
  const course = new Course(req.body);
  await course.save();

  res.status(201).json({
    data: course,
    message: 'Course created successfully',
    error: null,
  });
}));

// PATCH /api/courses/:id - Update course
router.patch('/:id', validateParams(courseIdSchema), validateBody(updateCourseSchema), asyncHandler(async (req: Request, res: Response) => {
  const course = await Course.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!course) {
    throw createError('Course not found', 404);
  }

  res.json({
    data: course,
    message: 'Course updated successfully',
    error: null,
  });
}));

// DELETE /api/courses/:id - Delete course
router.delete('/:id', validateParams(courseIdSchema), asyncHandler(async (req: Request, res: Response) => {
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
    data: null,
    message: 'Course deleted successfully',
    error: null,
  });
}));

export default router;
