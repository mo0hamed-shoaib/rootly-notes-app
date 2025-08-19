// server/index.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from '../src/lib/mongodb';
import notesRouter from './routes/notes';
import coursesRouter from './routes/courses';
import dailyEntriesRouter from './routes/dailyEntries';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// API Routes
app.use('/api/notes', notesRouter);
app.use('/api/courses', coursesRouter);
app.use('/api/daily-entries', dailyEntriesRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ data: { status: 'OK', timestamp: new Date().toISOString() }, message: 'Healthy', error: null });
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ data: null, message: 'Route not found', error: { code: '404' } });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 API endpoints available at http://localhost:${PORT}/api`);
});
