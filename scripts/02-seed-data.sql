-- Insert sample courses
INSERT INTO courses (instructor, title, links, topics) VALUES
('Dr. Sarah Johnson', 'Advanced React Patterns', 
 ARRAY['https://reactpatterns.com', 'https://github.com/react-patterns'], 
 ARRAY['Hooks', 'Context', 'Performance', 'Testing']),
('Prof. Michael Chen', 'Database Design Fundamentals', 
 ARRAY['https://dbdesign.com'], 
 ARRAY['Normalization', 'Indexing', 'Relationships', 'Optimization']),
('Lisa Rodriguez', 'TypeScript Mastery', 
 ARRAY['https://typescript.org/docs'], 
 ARRAY['Types', 'Generics', 'Decorators', 'Advanced Patterns']);

-- Insert sample notes (using the course IDs from above)
INSERT INTO notes (course_id, question, answer, understanding_level, flag)
SELECT 
  c.id,
  'What are the key benefits of using React Hooks?',
  'Hooks allow functional components to use state and lifecycle methods, promote code reuse through custom hooks, and make components more readable and testable.',
  4,
  false
FROM courses c WHERE c.title = 'Advanced React Patterns';

INSERT INTO notes (course_id, question, answer, understanding_level, flag)
SELECT 
  c.id,
  'What is database normalization and why is it important?',
  'Database normalization is the process of organizing data to reduce redundancy and improve data integrity. It helps eliminate data anomalies and ensures consistent data storage.',
  3,
  true
FROM courses c WHERE c.title = 'Database Design Fundamentals';

INSERT INTO notes (course_id, question, answer, understanding_level, flag)
SELECT 
  c.id,
  'How do TypeScript generics improve code reusability?',
  'Generics allow you to create reusable components that work with multiple types while maintaining type safety. They enable writing flexible, type-safe code without sacrificing performance.',
  5,
  false
FROM courses c WHERE c.title = 'TypeScript Mastery';

-- Insert sample daily entries
INSERT INTO daily_entries (date, study_time, mood, notes) VALUES
(CURRENT_DATE - INTERVAL '2 days', 120, 4, 'Great progress on React hooks. Completed 3 exercises.'),
(CURRENT_DATE - INTERVAL '1 day', 90, 3, 'Struggled with database normalization concepts. Need more practice.'),
(CURRENT_DATE, 150, 5, 'Breakthrough with TypeScript generics! Everything is clicking now.');
