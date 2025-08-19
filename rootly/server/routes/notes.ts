// server/routes/notes.ts
import express, { Request, Response } from 'express';
import { z } from 'zod';
import Note from '../../src/lib/models/Note';
import { noteSchema } from '../../src/lib/zod/note';
import { asyncHandler, createError } from '../middleware/errorHandler';
import { validateBody, validateParams, validateQuery } from '../middleware/validation';

const router = express.Router();

// Validation schemas
const noteIdSchema = z.object({
  id: z.string().min(1, 'Note ID is required'),
});

const querySchema = z.object({
  courseId: z.string().optional(),
  status: z.enum(['draft', 'active', 'answered']).optional(),
  topics: z.string().optional(), // comma-separated
  search: z.string().optional(),
  sort: z.enum(['recent', 'oldest', 'understanding-low', 'understanding-high']).optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).optional(),
  offset: z.string().regex(/^\d+$/).transform(Number).optional(),
});

const updateNoteSchema = noteSchema.partial().omit({ createdAt: true });

// GET /api/notes - Get all notes with filtering and sorting
router.get('/', validateQuery(querySchema), asyncHandler(async (req: Request, res: Response) => {
  const { courseId, status, topics, search, sort = 'recent', limit = 50, offset = 0 } = req.query as unknown as {
    courseId?: string;
    status?: 'draft' | 'active' | 'answered';
    topics?: string;
    search?: string;
    sort?: 'recent' | 'oldest' | 'understanding-low' | 'understanding-high';
    limit?: number;
    offset?: number;
  };

  const query: Record<string, unknown> = {};

  // Apply filters
  if (courseId) query.courseId = courseId;
  if (status) query.status = status;
  if (topics) {
    const topicArray = topics.split(',').map((t: string) => t.trim());
    query.topics = { $in: topicArray };
  }
  if (search) {
    query.question = { $regex: search, $options: 'i' };
  }

  // Apply sorting
  let sortOption: Record<string, 1 | -1> = {};
  switch (sort) {
    case 'recent':
      sortOption = { updatedAt: -1 };
      break;
    case 'oldest':
      sortOption = { updatedAt: 1 };
      break;
    case 'understanding-low':
      sortOption = { understanding: 1 };
      break;
    case 'understanding-high':
      sortOption = { understanding: -1 };
      break;
    default:
      sortOption = { updatedAt: -1 };
  }

  const notes = await Note.find(query)
    .sort(sortOption)
    .limit(limit)
    .skip(offset);

  const total = await Note.countDocuments(query);

  res.json({
    data: notes,
    message: 'Notes fetched successfully',
    error: null,
    pagination: {
      total,
      limit,
      offset,
      hasMore: offset + limit < total,
    },
  });
}));

// GET /api/notes/:id - Get single note
router.get('/:id', validateParams(noteIdSchema), asyncHandler(async (req: Request, res: Response) => {
  const note = await Note.findById(req.params.id);
  
  if (!note) {
    throw createError('Note not found', 404);
  }

  res.json({
    data: note,
    message: 'Note fetched successfully',
    error: null,
  });
}));

// POST /api/notes - Create new note
router.post('/', validateBody(noteSchema), asyncHandler(async (req: Request, res: Response) => {
  const noteData = {
    ...req.body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const note = new Note(noteData);
  await note.save();

  res.status(201).json({
    data: note,
    message: 'Note created successfully',
    error: null,
  });
}));

// PATCH /api/notes/:id - Update note
router.patch('/:id', validateParams(noteIdSchema), validateBody(updateNoteSchema), asyncHandler(async (req: Request, res: Response) => {
  const updateData = {
    ...req.body,
    updatedAt: new Date().toISOString(),
  };

  const note = await Note.findByIdAndUpdate(
    req.params.id,
    updateData,
    { new: true, runValidators: true }
  );

  if (!note) {
    throw createError('Note not found', 404);
  }

  res.json({
    data: note,
    message: 'Note updated successfully',
    error: null,
  });
}));

// DELETE /api/notes/:id - Delete note
router.delete('/:id', validateParams(noteIdSchema), asyncHandler(async (req: Request, res: Response) => {
  const note = await Note.findByIdAndDelete(req.params.id);

  if (!note) {
    throw createError('Note not found', 404);
  }

  res.json({
    data: null,
    message: 'Note deleted successfully',
    error: null,
  });
}));

// GET /api/notes/stats/summary - Get notes statistics
router.get('/stats/summary', asyncHandler(async (req: Request, res: Response) => {
  const totalNotes = await Note.countDocuments();
  const answeredNotes = await Note.countDocuments({ status: 'answered' });
  const focusNotes = await Note.countDocuments({ 'flags.focus': true });
  const blackBoxNotes = await Note.countDocuments({ 'flags.blackBox': true });

  // Average understanding
  const avgResult = await Note.aggregate([
    { $group: { _id: null, avgUnderstanding: { $avg: '$understanding' } } }
  ]);
  const avgUnderstanding = avgResult.length > 0 ? Math.round(avgResult[0].avgUnderstanding) : 0;

  // Topic distribution
  const topicStats = await Note.aggregate([
    { $unwind: '$topics' },
    { $group: { _id: '$topics', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);

  res.json({
    data: {
      totalNotes,
      answeredNotes,
      focusNotes,
      blackBoxNotes,
      avgUnderstanding,
      answerRate: totalNotes > 0 ? Math.round((answeredNotes / totalNotes) * 100) : 0,
      topicStats,
    },
    message: 'Notes stats fetched successfully',
    error: null,
  });
}));

export default router;
