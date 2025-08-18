// server/routes/dailyEntries.ts
import express from 'express';
import { z } from 'zod';
import DailyEntry from '../../src/lib/models/DailyEntry';
import { dailySchema } from '../../src/lib/zod/daily';
import { asyncHandler, createError } from '../middleware/errorHandler';
import { validateBody, validateParams, validateQuery } from '../middleware/validation';

const router = express.Router();

// Validation schemas
const entryIdSchema = z.object({
  id: z.string().min(1, 'Entry ID is required'),
});

const dateRangeSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).optional(),
});

const updateDailyEntrySchema = dailySchema.partial();

// GET /api/daily-entries - Get daily entries with optional date range
router.get('/', validateQuery(dateRangeSchema), asyncHandler(async (req, res) => {
  const { startDate, endDate, limit = 30 } = req.query as any;

  let query: any = {};

  if (startDate || endDate) {
    query.date = {};
    if (startDate) query.date.$gte = startDate;
    if (endDate) query.date.$lte = endDate;
  }

  const entries = await DailyEntry.find(query)
    .sort({ date: -1 })
    .limit(limit);

  res.json({
    success: true,
    data: entries,
  });
}));

// GET /api/daily-entries/:id - Get single daily entry
router.get('/:id', validateParams(entryIdSchema), asyncHandler(async (req, res) => {
  const entry = await DailyEntry.findById(req.params.id);
  
  if (!entry) {
    throw createError('Daily entry not found', 404);
  }

  res.json({
    success: true,
    data: entry,
  });
}));

// GET /api/daily-entries/date/:date - Get entry by specific date
router.get('/date/:date', asyncHandler(async (req, res) => {
  const { date } = req.params;
  
  // Validate date format
  if (isNaN(Date.parse(date))) {
    throw createError('Invalid date format', 400);
  }

  const entry = await DailyEntry.findOne({ date });

  res.json({
    success: true,
    data: entry,
  });
}));

// POST /api/daily-entries - Create new daily entry
router.post('/', validateBody(dailySchema), asyncHandler(async (req, res) => {
  // Check if entry for this date already exists
  const existingEntry = await DailyEntry.findOne({ date: req.body.date });
  if (existingEntry) {
    throw createError('Daily entry for this date already exists', 400);
  }

  const entry = new DailyEntry(req.body);
  await entry.save();

  res.status(201).json({
    success: true,
    data: entry,
    message: 'Daily entry created successfully',
  });
}));

// PATCH /api/daily-entries/:id - Update daily entry
router.patch('/:id', validateParams(entryIdSchema), validateBody(updateDailyEntrySchema), asyncHandler(async (req, res) => {
  const entry = await DailyEntry.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!entry) {
    throw createError('Daily entry not found', 404);
  }

  res.json({
    success: true,
    data: entry,
    message: 'Daily entry updated successfully',
  });
}));

// PATCH /api/daily-entries/date/:date - Update or create entry by date
router.patch('/date/:date', validateBody(updateDailyEntrySchema), asyncHandler(async (req, res) => {
  const { date } = req.params;
  
  // Validate date format
  if (isNaN(Date.parse(date))) {
    throw createError('Invalid date format', 400);
  }

  const entry = await DailyEntry.findOneAndUpdate(
    { date },
    { ...req.body, date },
    { new: true, upsert: true, runValidators: true }
  );

  res.json({
    success: true,
    data: entry,
    message: 'Daily entry updated successfully',
  });
}));

// DELETE /api/daily-entries/:id - Delete daily entry
router.delete('/:id', validateParams(entryIdSchema), asyncHandler(async (req, res) => {
  const entry = await DailyEntry.findByIdAndDelete(req.params.id);

  if (!entry) {
    throw createError('Daily entry not found', 404);
  }

  res.json({
    success: true,
    message: 'Daily entry deleted successfully',
  });
}));

// GET /api/daily-entries/stats/summary - Get study statistics
router.get('/stats/summary', asyncHandler(async (req, res) => {
  const totalEntries = await DailyEntry.countDocuments();
  
  // Calculate total study time
  const totalMinutesResult = await DailyEntry.aggregate([
    { $group: { _id: null, totalMinutes: { $sum: '$studiedMinutes' } } }
  ]);
  const totalStudyMinutes = totalMinutesResult.length > 0 ? totalMinutesResult[0].totalMinutes : 0;

  // Calculate current streak (consecutive days with study time > 0)
  const recentEntries = await DailyEntry.find({ studiedMinutes: { $gt: 0 } })
    .sort({ date: -1 })
    .limit(30);

  let currentStreak = 0;
  const today = new Date().toISOString().split('T')[0];
  let checkDate = new Date(today);

  for (let i = 0; i < recentEntries.length; i++) {
    const entryDate = checkDate.toISOString().split('T')[0];
    const hasEntry = recentEntries.some(entry => entry.date === entryDate);
    
    if (hasEntry) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  // Get average study time per day
  const avgStudyTime = totalEntries > 0 ? Math.round(totalStudyMinutes / totalEntries) : 0;

  // Most studied topics
  const topicStats = await DailyEntry.aggregate([
    { $unwind: '$topicsTouched' },
    { $group: { _id: '$topicsTouched', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 5 }
  ]);

  // Mood distribution
  const moodStats = await DailyEntry.aggregate([
    { $match: { mood: { $exists: true } } },
    { $group: { _id: '$mood', count: { $sum: 1 } } }
  ]);

  res.json({
    success: true,
    data: {
      totalEntries,
      totalStudyMinutes,
      totalStudyHours: Math.round(totalStudyMinutes / 60 * 10) / 10,
      currentStreak,
      avgStudyTime,
      topicStats,
      moodStats,
    },
  });
}));

// GET /api/daily-entries/stats/last-week - Get last 7 days for charts
router.get('/stats/last-week', asyncHandler(async (req, res) => {
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split('T')[0];
  }).reverse();

  const entries = await DailyEntry.find({
    date: { $in: last7Days }
  });

  const chartData = last7Days.map(date => {
    const entry = entries.find(e => e.date === date);
    return {
      date,
      minutes: entry?.studiedMinutes || 0,
      mood: entry?.mood || null,
    };
  });

  res.json({
    success: true,
    data: chartData,
  });
}));

export default router;
