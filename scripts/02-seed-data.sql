BEGIN;

-- 1) Clear existing data (respect FKs and cascade from courses->notes)
DELETE FROM notes;
DELETE FROM daily_entries;
DELETE FROM courses;

-- Target timeline reference: seeding dates span roughly two months before 2025-08-20

-- 2) Insert target courses and capture IDs
WITH new_courses AS (
  INSERT INTO courses (instructor, title, links, topics, created_at, updated_at)
  VALUES
    ('Sarah Daniels', 'Ultimate React & Next.js',
      ARRAY['https://nextjs.org/docs', 'https://react.dev/learn'],
      ARRAY['React', 'Next.js', 'Routing', 'Data Fetching'],
      TIMESTAMPTZ '2025-06-20 09:00:00+00', TIMESTAMPTZ '2025-06-20 09:00:00+00'),
    ('Aamir Patel', 'Complete MongoDB',
      ARRAY['https://www.mongodb.com/docs', 'https://www.mongodb.com/developer'],
      ARRAY['Documents', 'Indexes', 'Aggregation', 'Schema Design'],
      TIMESTAMPTZ '2025-06-21 09:00:00+00', TIMESTAMPTZ '2025-06-21 09:00:00+00'),
    ('Nora Kim', 'Node.js Bootcamp',
      ARRAY['https://nodejs.org/en/docs', 'https://expressjs.com'],
      ARRAY['HTTP', 'Express', 'Middleware', 'Streams'],
      TIMESTAMPTZ '2025-06-22 09:00:00+00', TIMESTAMPTZ '2025-06-22 09:00:00+00'),
    ('Leo Martins', 'TypeScript Fundamentals',
      ARRAY['https://www.typescriptlang.org/docs', 'https://www.typescriptlang.org/tsconfig'],
      ARRAY['Types', 'Generics', 'Narrowing', 'Modules'],
      TIMESTAMPTZ '2025-06-23 09:00:00+00', TIMESTAMPTZ '2025-06-23 09:00:00+00')
  RETURNING id, title
),

-- 3) Base notes for "Ultimate React & Next.js" (10 fundamentals, phrased as questions)
react_notes AS (
  SELECT (SELECT id FROM new_courses WHERE title = 'Ultimate React & Next.js') AS course_id, *
  FROM (VALUES
    ($$What is the difference between useState and useRef?$$,
     $$useState triggers a re-render when the state changes and is ideal for UI state. useRef stores a mutable value that persists across renders without causing a re-render; it’s ideal for DOM refs and instance variables.$$,
     NULL, NULL, 4, false, TIMESTAMPTZ '2025-06-24 10:00:00+00'),
    ($$How do you create a page in the Next.js App Router?$$,
     $$Place a page.tsx file under a route folder (e.g., app/about/page.tsx). The folder path defines the route.$$,
     $$export default function AboutPage() {\n  return <main>About</main>;\n}$$, 'tsx', 5, false, TIMESTAMPTZ '2025-06-25 12:00:00+00'),
    ($$What is a dynamic route in the App Router?$$,
     $$Use bracketed folders like app/courses/[id]/page.tsx. Next.js matches the segment and passes params to the page component.$$,
     $$import { notFound } from 'next/navigation';\n\nexport default function CoursePage({ params }: { params: { id: string }}) {\n  if (!params.id) return notFound();\n  return <main>Course {params.id}</main>;\n}$$, 'tsx', 4, false, TIMESTAMPTZ '2025-06-27 09:30:00+00'),
    ($$What is useEffect cleanup?$$,
     $$Return a function from useEffect to clean subscriptions/timers. React calls it before the effect re-runs or during unmount.$$,
     $$useEffect(() => {\n  const id = setInterval(() => console.log('tick'), 1000);\n  return () => clearInterval(id);\n}, []);$$, 'tsx', 3, true, TIMESTAMPTZ '2025-06-29 08:40:00+00'),
    ($$When should a component be a Client Component?$$,
     $$Use a Client Component when you need browser-only APIs (local state, effects, event handlers). Otherwise, prefer Server Components for performance.$$,
     NULL, NULL, 3, false, TIMESTAMPTZ '2025-07-01 11:10:00+00'),
    ($$How do you navigate between pages with Link?$$,
     $$Use the Link component to avoid full page reloads and keep client-side transitions.$$,
     $$import Link from 'next/link';\n\n<Link href="/courses">Courses</Link>$$, 'tsx', 5, false, TIMESTAMPTZ '2025-07-04 16:00:00+00'),
    ($$What is memoization with useMemo?$$,
     $$useMemo caches expensive computations between renders. Only use it for actual cost or stable references.$$,
     $$const total = useMemo(() => items.reduce((s, n) => s + n, 0), [items]);$$, 'tsx', 2, true, TIMESTAMPTZ '2025-07-08 10:50:00+00'),
    ($$How do you fetch data on the client in React?$$,
     $$Use useEffect plus fetch (or a data library). In the App Router, prefer Server Components for data when possible.$$,
     $$useEffect(() => {\n  fetch('/api/data').then(r => r.json()).then(setData);\n}, []);$$, 'tsx', 3, false, TIMESTAMPTZ '2025-07-12 13:20:00+00'),
    ($$How do you build a simple controlled form?$$,
     $$Bind input value to state and update onChange. Controlled inputs keep the UI in sync with state.$$,
     $$const [name, setName] = useState('');\n<form onSubmit={e => { e.preventDefault(); alert(name); }}>\n  <input value={name} onChange={e => setName(e.target.value)} />\n  <button>Save</button>\n</form>$$, 'tsx', 4, false, TIMESTAMPTZ '2025-07-18 09:05:00+00'),
    ($$What is the difference between layout.tsx and page.tsx?$$,
     $$layout.tsx wraps route segments to provide shared UI (e.g., nav). page.tsx renders the actual page content for that route.$$,
     NULL, NULL, 5, false, TIMESTAMPTZ '2025-07-24 15:30:00+00')
  ) AS t(question, answer, code_snippet, code_language, understanding_level, flag, created_at)
),

-- 4) Base notes for "Complete MongoDB"
mongo_notes AS (
  SELECT (SELECT id FROM new_courses WHERE title = 'Complete MongoDB') AS course_id, *
  FROM (VALUES
    ($$What is a MongoDB document?$$,
     $$A document is a JSON-like object stored in a collection. It’s the fundamental unit of data in MongoDB.$$,
     NULL, NULL, 4, false, TIMESTAMPTZ '2025-06-26 10:00:00+00'),
    ($$How do you create a unique index on a field?$$,
     $$Use createIndex with the unique option to enforce uniqueness and improve lookups.$$,
     $$db.users.createIndex({ email: 1 }, { unique: true });$$, 'javascript', 5, false, TIMESTAMPTZ '2025-06-28 12:30:00+00'),
    ($$What is the difference between find and findOne?$$,
     $$find returns a cursor (potentially many docs). findOne returns a single document or null.$$,
     NULL, NULL, 3, false, TIMESTAMPTZ '2025-07-02 09:15:00+00'),
    ($$How do you update fields with $set?$$,
     $$Use $set to modify specific fields without replacing the entire document.$$,
     $$db.users.updateOne({ _id: userId }, { $set: { name: 'Ada Lovelace' } });$$, 'javascript', 4, false, TIMESTAMPTZ '2025-07-05 14:00:00+00'),
    ($$How do you count documents by status with an aggregation?$$,
     $$Use $group to aggregate counts for reporting.$$,
     $$[\n  { "$group": { _id: "$status", count: { "$sum": 1 } } },\n  { "$sort": { count: -1 } }\n]$$, 'json', 3, true, TIMESTAMPTZ '2025-07-09 11:40:00+00'),
    ($$When should you embed vs reference data?$$,
     $$Embed for small, tightly-coupled data that you read together. Reference for large or many-to-many relationships.$$,
     NULL, NULL, 4, false, TIMESTAMPTZ '2025-07-13 10:10:00+00'),
    ($$What is a TTL index and when to use it?$$,
     $$A TTL index automatically deletes documents after a specified time, useful for expiring sessions/logs.$$,
     $$db.sessions.createIndex({ createdAt: 1 }, { expireAfterSeconds: 3600 });$$, 'javascript', 2, false, TIMESTAMPTZ '2025-07-17 09:00:00+00'),
    ($$How do you perform an upsert?$$,
     $$Use updateOne with upsert: true to insert if no match is found.$$,
     $$db.settings.updateOne(\n  { key: 'theme' },\n  { $set: { value: 'dark' } },\n  { upsert: true }\n);$$, 'javascript', 3, false, TIMESTAMPTZ '2025-07-20 17:30:00+00'),
    ($$How do you filter using the $in operator?$$,
     $$Use $in to match any value in the provided array.$$,
     $$db.products.find({ category: { $in: ['books', 'games'] } });$$, 'javascript', 5, false, TIMESTAMPTZ '2025-07-25 12:00:00+00'),
    ($$What are the basics of MongoDB transactions?$$,
     $$In a replica set/cluster, use sessions and transactions to atomically modify multiple documents across collections.$$,
     NULL, NULL, 3, true, TIMESTAMPTZ '2025-07-30 13:25:00+00')
  ) AS t(question, answer, code_snippet, code_language, understanding_level, flag, created_at)
),

-- 5) Base notes for "Node.js Bootcamp"
node_notes AS (
  SELECT (SELECT id FROM new_courses WHERE title = 'Node.js Bootcamp') AS course_id, *
  FROM (VALUES
    ($$What is the event loop?$$,
     $$The event loop processes queued callbacks and enables non-blocking I/O in Node.js.$$,
     NULL, NULL, 4, false, TIMESTAMPTZ '2025-06-27 10:00:00+00'),
    ($$How do you create a minimal Express server?$$,
     $$Use express(), define routes, and listen on a port.$$,
     $$const express = require('express');\nconst app = express();\napp.get('/', (req, res) => res.send('OK'));\napp.listen(3000);$$, 'javascript', 5, false, TIMESTAMPTZ '2025-06-30 09:30:00+00'),
    ($$What is middleware in Express?$$,
     $$Middleware are functions that have access to req/res and next; used for auth, logging, validation, etc.$$,
     NULL, NULL, 3, false, TIMESTAMPTZ '2025-07-03 16:20:00+00'),
    ($$How do you read route params in Express?$$,
     $$Use colon-prefixed segments to capture params in the path.$$,
     $$app.get('/users/:id', (req, res) => res.json({ id: req.params.id }));$$, 'javascript', 4, false, TIMESTAMPTZ '2025-07-06 13:00:00+00'),
    ($$How do you handle errors with async/await in Express?$$,
     $$Wrap async code with try/catch or use an async error handler to avoid unhandled rejections.$$,
     $$app.get('/data', async (req, res, next) => {\n  try { const data = await svc.load(); res.json(data); }\n  catch (err) { next(err); }\n});$$, 'javascript', 2, true, TIMESTAMPTZ '2025-07-10 10:45:00+00'),
    ($$How do you load environment variables with dotenv?$$,
     $$Read configuration from .env in development and access via process.env.$$,
     $$require('dotenv').config();\nconst dbUrl = process.env.DATABASE_URL;$$, 'javascript', 3, false, TIMESTAMPTZ '2025-07-14 08:50:00+00'),
    ($$What is an error-handling middleware in Express?$$,
     $$Define a final error handler with four args (err, req, res, next).$$,
     $$app.use((err, req, res, next) => {\n  res.status(500).json({ error: 'Internal error' });\n});$$, 'javascript', 3, false, TIMESTAMPTZ '2025-07-18 15:10:00+00'),
    ($$What is nodemon?$$,
     $$A dev tool that restarts Node when files change, improving iteration speed.$$,
     NULL, NULL, 4, false, TIMESTAMPTZ '2025-07-22 11:20:00+00'),
    ($$How do you add request logging with morgan?$$,
     $$Use morgan middleware for concise HTTP logs during development.$$,
     $$const morgan = require('morgan');\napp.use(morgan('dev'));$$, 'javascript', 5, false, TIMESTAMPTZ '2025-07-26 09:05:00+00'),
    ($$How do you serve static files with Express?$$,
     $$Use express.static to serve public assets.$$,
     $$app.use('/public', express.static('public'));$$, 'javascript', 3, false, TIMESTAMPTZ '2025-07-29 17:35:00+00')
  ) AS t(question, answer, code_snippet, code_language, understanding_level, flag, created_at)
),

-- 6) Base notes for "TypeScript Fundamentals"
ts_notes AS (
  SELECT (SELECT id FROM new_courses WHERE title = 'TypeScript Fundamentals') AS course_id, *
  FROM (VALUES
    ($$What are basic types in TypeScript?$$,
     $$number, string, boolean, null, undefined, symbol, bigint, arrays, tuples, and object types.$$,
     NULL, NULL, 5, false, TIMESTAMPTZ '2025-06-28 11:00:00+00'),
    ($$What is the difference between interfaces and type aliases?$$,
     $$Both describe shapes. Interfaces are extendable/mergeable; type aliases are more flexible for unions/intersections.$$,
     NULL, NULL, 3, false, TIMESTAMPTZ '2025-07-01 10:40:00+00'),
    ($$What is a simple example of a generic function in TypeScript?$$,
     $$Generics preserve type information across inputs/outputs for reusable code.$$,
     $$function wrap<T>(value: T) { return { value }; }$$, 'typescript', 4, false, TIMESTAMPTZ '2025-07-04 12:15:00+00'),
    ($$What are the basics of type narrowing in TypeScript?$$,
     $$Use typeof, instanceof, in, and custom predicates to safely narrow unions.$$,
     $$function len(x: string | string[]) {\n  return typeof x === 'string' ? x.length : x.length;\n}$$, 'typescript', 3, false, TIMESTAMPTZ '2025-07-07 09:00:00+00'),
    ($$Literal types vs enums: what should I use?$$,
     $$Literal unions are tree-shakeable and ergonomic; enums add runtime objects (unless const enums) and can be heavier.$$,
     NULL, NULL, 2, true, TIMESTAMPTZ '2025-07-11 14:25:00+00'),
    ($$What are some common TypeScript utility types?$$,
     $$Use Partial, Required, Readonly, Pick, Omit to transform types.$$,
     $$type User = { id: string; name: string; email?: string };\ntype UserPatch = Partial<User>;$$, 'typescript', 4, false, TIMESTAMPTZ '2025-07-15 10:05:00+00'),
    ($$What are function overloads in TypeScript?$$,
     $$Overloads describe multiple call signatures for a function that behaves differently based on args.$$,
     $$function parse(x: string): number;\nfunction parse(x: number): string;\nfunction parse(x: string | number): string | number { return x as any; }$$, 'typescript', 3, false, TIMESTAMPTZ '2025-07-19 16:35:00+00'),
    ($$unknown vs any: which should I use?$$,
     $$unknown is safer; you must narrow before use. any disables type checking.$$,
     NULL, NULL, 5, false, TIMESTAMPTZ '2025-07-23 11:50:00+00'),
    ($$How do you annotate async functions in TypeScript?$$,
     $$Use Promise<T> return type and typed parameters.$$,
     $$async function loadUser(id: string): Promise<User> { /* ... */ return { id, name: 'A' }; }$$, 'typescript', 4, false, TIMESTAMPTZ '2025-07-27 09:45:00+00'),
    ($$How do you use ES modules in TypeScript?$$,
     $$Use import/export syntax; configure moduleResolution in tsconfig if needed.$$,
     $$import { readFile } from 'node:fs/promises';\nexport const read = (p: string) => readFile(p, 'utf8');$$, 'typescript', 3, false, TIMESTAMPTZ '2025-07-31 13:05:00+00')
  ) AS t(question, answer, code_snippet, code_language, understanding_level, flag, created_at)
)

-- 7) Insert base notes for all courses
INSERT INTO notes
  (course_id, question, answer, code_snippet, code_language, understanding_level, flag, created_at, updated_at)
SELECT course_id, question, answer, code_snippet, code_language, understanding_level, flag, created_at, created_at
FROM react_notes
UNION ALL
SELECT course_id, question, answer, code_snippet, code_language, understanding_level, flag, created_at, created_at
FROM mongo_notes
UNION ALL
SELECT course_id, question, answer, code_snippet, code_language, understanding_level, flag, created_at, created_at
FROM node_notes
UNION ALL
SELECT course_id, question, answer, code_snippet, code_language, understanding_level, flag, created_at, created_at
FROM ts_notes;

-- 8) Insert 1–4 additional question-form notes per course (random per run)
-- Ultimate React & Next.js (extra candidates)
WITH react_id AS (
  SELECT id AS course_id FROM courses WHERE title = 'Ultimate React & Next.js'
), react_candidates AS (
  SELECT (SELECT course_id FROM react_id) AS course_id, *
  FROM (VALUES
    ($$How do you fetch data in a Server Component?$$,
     $$Use async Server Components and call fetch directly; data is fetched on the server by default.$$,
     $$export default async function Page() {\n  const res = await fetch('https://api.example.com/posts', { cache: 'no-store' });\n  const posts = await res.json();\n  return <ul>{posts.map((p: any) => <li key={p.id}>{p.title}</li>)}</ul>;\n}$$, 'tsx', 4, false, TIMESTAMPTZ '2025-08-01 10:00:00+00'),
    ($$When should you use useCallback?$$,
     $$When passing stable functions to memoized children to avoid unnecessary re-renders; don’t overuse.$$,
     NULL, NULL, 3, false, TIMESTAMPTZ '2025-08-07 11:00:00+00'),
    ($$How do you define page metadata in the App Router?$$,
     $$Export a metadata object or a generateMetadata function from page/layout files.$$,
     $$export const metadata = { title: 'Courses' };$$, 'tsx', 4, false, TIMESTAMPTZ '2025-08-11 12:00:00+00'),
    ($$How do you optimize images in Next.js?$$,
     $$Use next/image for automatic optimization, sizing, and lazy loading.$$,
     $$import Image from 'next/image';\n<Image src="/banner.png" alt="banner" width={800} height={320} />$$, 'tsx', 5, false, TIMESTAMPTZ '2025-08-15 13:00:00+00'),
    ($$How do you create a loading UI for a route segment?$$,
     $$Add a loading.tsx in the route segment to show a fallback during data fetch.$$,
     NULL, NULL, 3, false, TIMESTAMPTZ '2025-08-18 14:00:00+00')
  ) AS t(question, answer, code_snippet, code_language, understanding_level, flag, created_at)
)
INSERT INTO notes (course_id, question, answer, code_snippet, code_language, understanding_level, flag, created_at, updated_at)
SELECT course_id, question, answer, code_snippet, code_language, understanding_level, flag, created_at, created_at
FROM react_candidates
ORDER BY random()
LIMIT (1 + floor(random() * 4))::int;

-- Complete MongoDB (extra candidates)
WITH mongo_id AS (
  SELECT id AS course_id FROM courses WHERE title = 'Complete MongoDB'
), mongo_candidates AS (
  SELECT (SELECT course_id FROM mongo_id) AS course_id, *
  FROM (VALUES
    ($$How do you return only specific fields from a query?$$,
     $$Use a projection to include/exclude fields.$$,
     $$db.users.find({ active: true }, { email: 1, name: 1, _id: 0 });$$, 'javascript', 4, false, TIMESTAMPTZ '2025-08-01 10:30:00+00'),
    ($$When should you create a compound index?$$,
     $$When queries filter/sort on multiple fields; order fields by equality first, then range, then sort.$$,
     NULL, NULL, 3, false, TIMESTAMPTZ '2025-08-06 10:30:00+00'),
    ($$How do you perform a simple $lookup?$$,
     $$Use $lookup to join data from another collection by matching local and foreign fields.$$,
     $$[{ \"$lookup\": { from: \"orders\", localField: \"_id\", foreignField: \"userId\", as: \"orders\" }}]$$, 'json', 2, true, TIMESTAMPTZ '2025-08-10 10:30:00+00'),
    ($$How do you search with a regex filter?$$,
     $$Use $regex for simple pattern matching (be mindful of performance).$$,
     $$db.posts.find({ title: { $regex: /mongo/i } });$$, 'javascript', 3, false, TIMESTAMPTZ '2025-08-14 10:30:00+00'),
    ($$How do you paginate results?$$,
     $$Use limit and skip for simple pagination or range-based pagination for scale.$$,
     $$db.items.find({}).skip(20).limit(10);$$, 'javascript', 4, false, TIMESTAMPTZ '2025-08-18 10:30:00+00')
  ) AS t(question, answer, code_snippet, code_language, understanding_level, flag, created_at)
)
INSERT INTO notes (course_id, question, answer, code_snippet, code_language, understanding_level, flag, created_at, updated_at)
SELECT course_id, question, answer, code_snippet, code_language, understanding_level, flag, created_at, created_at
FROM mongo_candidates
ORDER BY random()
LIMIT (1 + floor(random() * 4))::int;

-- Node.js Bootcamp (extra candidates)
WITH node_id AS (
  SELECT id AS course_id FROM courses WHERE title = 'Node.js Bootcamp'
), node_candidates AS (
  SELECT (SELECT course_id FROM node_id) AS course_id, *
  FROM (VALUES
    ($$How do you parse JSON request bodies in Express?$$,
     $$Use express.json() middleware to parse JSON payloads.$$,
     $$const express = require('express');\nconst app = express();\napp.use(express.json());$$, 'javascript', 4, false, TIMESTAMPTZ '2025-08-02 09:45:00+00'),
    ($$How do you organize routes with an Express Router?$$,
     $$Create a Router instance, mount handlers, and use app.use for a base path.$$,
     $$const users = require('express').Router();\nusers.get('/', (req,res)=>res.json([]));\napp.use('/users', users);$$, 'javascript', 3, false, TIMESTAMPTZ '2025-08-06 09:45:00+00'),
    ($$How do you wrap async route handlers to bubble errors?$$,
     $$Create a small wrapper that catches rejections and calls next(err).$$,
     $$const wrap = fn => (req,res,next) => Promise.resolve(fn(req,res,next)).catch(next);$$, 'javascript', 3, false, TIMESTAMPTZ '2025-08-11 09:45:00+00'),
    ($$How do you read the port from an environment variable?$$,
     $$Use process.env and provide a sensible default.$$,
     $$const PORT = process.env.PORT || 3000;\napp.listen(PORT);$$, 'javascript', 4, false, TIMESTAMPTZ '2025-08-15 09:45:00+00'),
    ($$How do you return a JSON response?$$,
     $$Use res.json to serialize objects as JSON.$$,
     $$app.get('/health', (req,res)=>res.json({ ok: true }));$$, 'javascript', 5, false, TIMESTAMPTZ '2025-08-18 09:45:00+00')
  ) AS t(question, answer, code_snippet, code_language, understanding_level, flag, created_at)
)
INSERT INTO notes (course_id, question, answer, code_snippet, code_language, understanding_level, flag, created_at, updated_at)
SELECT course_id, question, answer, code_snippet, code_language, understanding_level, flag, created_at, created_at
FROM node_candidates
ORDER BY random()
LIMIT (1 + floor(random() * 4))::int;

-- TypeScript Fundamentals (extra candidates)
WITH ts_id AS (
  SELECT id AS course_id FROM courses WHERE title = 'TypeScript Fundamentals'
), ts_candidates AS (
  SELECT (SELECT course_id FROM ts_id) AS course_id, *
  FROM (VALUES
    ($$What is a union type in TypeScript?$$,
     $$A union allows a value to be one of several types (e.g., string | number).$$,
     NULL, NULL, 4, false, TIMESTAMPTZ '2025-08-01 08:20:00+00'),
    ($$How do you use keyof to index types?$$,
     $$keyof produces a union of property names which can be used for typed indexing.$$,
     $$type User = { id: string; name: string };\ntype Keys = keyof User; // 'id' | 'name'$$, 'typescript', 4, false, TIMESTAMPTZ '2025-08-05 08:20:00+00'),
    ($$How do custom type guards work?$$,
     $$A function returning x is Type narrows the parameter when true.$$,
     $$function isStr(x: unknown): x is string { return typeof x === 'string'; }$$, 'typescript', 3, false, TIMESTAMPTZ '2025-08-10 08:20:00+00'),
    ($$What is the Record<K, V> utility type?$$,
     $$Record builds a type with keys of K and values of V.$$,
     $$type Flags = Record<'a'|'b', boolean>;$$, 'typescript', 4, false, TIMESTAMPTZ '2025-08-14 08:20:00+00'),
    ($$What does the never type represent?$$,
     $$A type that has no values; used for impossible code paths or exhaustive checks.$$,
     NULL, NULL, 3, false, TIMESTAMPTZ '2025-08-18 08:20:00+00')
  ) AS t(question, answer, code_snippet, code_language, understanding_level, flag, created_at)
)
INSERT INTO notes (course_id, question, answer, code_snippet, code_language, understanding_level, flag, created_at, updated_at)
SELECT course_id, question, answer, code_snippet, code_language, understanding_level, flag, created_at, created_at
FROM ts_candidates
ORDER BY random()
LIMIT (1 + floor(random() * 4))::int;

-- 9) Insert daily entries (unique dates, realistic spread)
INSERT INTO daily_entries (date, study_time, mood, notes, created_at, updated_at) VALUES
('2025-06-22', 75, 3, 'Skimmed Next.js routing; basic pages working.', TIMESTAMPTZ '2025-06-22 20:00:00+00', TIMESTAMPTZ '2025-06-22 20:00:00+00'),
('2025-06-24', 90, 4, 'React fundamentals refresher; controlled inputs.', TIMESTAMPTZ '2025-06-24 20:30:00+00', TIMESTAMPTZ '2025-06-24 20:30:00+00'),
('2025-06-26', 60, 3, 'Mongo docs overview; documents and CRUD.', TIMESTAMPTZ '2025-06-26 21:00:00+00', TIMESTAMPTZ '2025-06-26 21:00:00+00'),
('2025-06-28', 110, 4, 'Indexes in Mongo + unique constraints.', TIMESTAMPTZ '2025-06-28 19:45:00+00', TIMESTAMPTZ '2025-06-28 19:45:00+00'),
('2025-06-30', 95, 5, 'Built minimal Express API; hello world works.', TIMESTAMPTZ '2025-06-30 20:15:00+00', TIMESTAMPTZ '2025-06-30 20:15:00+00'),
('2025-07-02', 70, 3, 'Aggregation basics in Mongo; group and sort.', TIMESTAMPTZ '2025-07-02 19:20:00+00', TIMESTAMPTZ '2025-07-02 19:20:00+00'),
('2025-07-04', 120, 4, 'Next.js Link and layouts; smoother navigation.', TIMESTAMPTZ '2025-07-04 20:40:00+00', TIMESTAMPTZ '2025-07-04 20:40:00+00'),
('2025-07-06', 80, 3, 'Express params and basic routing patterns.', TIMESTAMPTZ '2025-07-06 19:35:00+00', TIMESTAMPTZ '2025-07-06 19:35:00+00'),
('2025-07-08', 60, 2, 'Tried useMemo; overused it—needs restraint.', TIMESTAMPTZ '2025-07-08 21:10:00+00', TIMESTAMPTZ '2025-07-08 21:10:00+00'),
('2025-07-10', 100, 3, 'Async/await + error handling in Node.', TIMESTAMPTZ '2025-07-10 20:10:00+00', TIMESTAMPTZ '2025-07-10 20:10:00+00'),
('2025-07-12', 130, 5, 'Client fetching vs server components in Next.', TIMESTAMPTZ '2025-07-12 18:50:00+00', TIMESTAMPTZ '2025-07-12 18:50:00+00'),
('2025-07-14', 85, 4, 'dotenv + config patterns in Node.', TIMESTAMPTZ '2025-07-14 19:25:00+00', TIMESTAMPTZ '2025-07-14 19:25:00+00'),
('2025-07-16', 45, 3, 'Skimmed Mongo schema design tips.', TIMESTAMPTZ '2025-07-16 21:05:00+00', TIMESTAMPTZ '2025-07-16 21:05:00+00'),
('2025-07-18', 100, 4, 'Error-handling middleware; response shapes.', TIMESTAMPTZ '2025-07-18 20:45:00+00', TIMESTAMPTZ '2025-07-18 20:45:00+00'),
('2025-07-20', 75, 3, 'Upserts in Mongo; config doc pattern.', TIMESTAMPTZ '2025-07-20 19:15:00+00', TIMESTAMPTZ '2025-07-20 19:15:00+00'),
('2025-07-22', 90, 4, 'Nodemon + dev workflow tuning.', TIMESTAMPTZ '2025-07-22 20:30:00+00', TIMESTAMPTZ '2025-07-22 20:30:00+00'),
('2025-07-24', 110, 5, 'Layouts vs pages clarified in App Router.', TIMESTAMPTZ '2025-07-24 18:40:00+00', TIMESTAMPTZ '2025-07-24 18:40:00+00'),
('2025-07-26', 95, 4, 'Morgan logs; cleaned request traces.', TIMESTAMPTZ '2025-07-26 19:35:00+00', TIMESTAMPTZ '2025-07-26 19:35:00+00'),
('2025-07-28', 55, 2, 'Light review: TS utility types.', TIMESTAMPTZ '2025-07-28 21:15:00+00', TIMESTAMPTZ '2025-07-28 21:15:00+00'),
('2025-07-31', 120, 4, 'TS modules + Node ESM quirks.', TIMESTAMPTZ '2025-07-31 19:55:00+00', TIMESTAMPTZ '2025-07-31 19:55:00+00'),
('2025-08-02', 80, 3, 'Mongo transactions overview (theory).', TIMESTAMPTZ '2025-08-02 20:05:00+00', TIMESTAMPTZ '2025-08-02 20:05:00+00'),
('2025-08-05', 135, 5, 'Built small Next page flow end-to-end.', TIMESTAMPTZ '2025-08-05 18:35:00+00', TIMESTAMPTZ '2025-08-05 18:35:00+00'),
('2025-08-09', 65, 3, 'Quick refactor: TS narrowing.', TIMESTAMPTZ '2025-08-09 20:20:00+00', TIMESTAMPTZ '2025-08-09 20:20:00+00'),
('2025-08-12', 95, 4, 'Express static files + public assets.', TIMESTAMPTZ '2025-08-12 19:30:00+00', TIMESTAMPTZ '2025-08-12 19:30:00+00'),
('2025-08-16', 70, 3, 'Mongo $in filters and simple reports.', TIMESTAMPTZ '2025-08-16 21:00:00+00', TIMESTAMPTZ '2025-08-16 21:00:00+00'),
('2025-08-19', 150, 5, 'Full review across all courses; feeling ready.', TIMESTAMPTZ '2025-08-19 18:50:00+00', TIMESTAMPTZ '2025-08-19 18:50:00+00');

COMMIT;
