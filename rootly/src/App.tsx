import { useState } from 'react';
import { Navigation } from '@/components/navigation/Navigation';
import { NotesPage } from '@/pages/NotesPage';
import { CoursesPage } from '@/pages/CoursesPage';
import { ReviewPage } from '@/pages/ReviewPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { RootLayout } from '@/components/layout/RootLayout';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import type { Note, Course, DailyEntry, CourseInput } from '@/types';
import type { NoteInput } from '@/lib/zod/note';

// Mock data (in a real app, this would come from API/database)
const mockCourses: Course[] = [
  {
    id: "1",
    instructor: "Dan Abramov",
    title: "React Deep Dive",
    links: {
      course: "https://react.dev",
      repo: "https://github.com/facebook/react",
      docs: "https://react.dev/reference"
    },
    version: "React 18",
    startedAt: "2024-01-15T00:00:00.000Z",
    tags: ["hooks", "reconciliation", "rendering"]
  },
  {
    id: "2", 
    instructor: "Kent C. Dodds",
    title: "Advanced React Patterns",
    links: {
      course: "https://epicreact.dev",
      repo: "",
      docs: ""
    },
    version: "React 18",
    startedAt: "2024-02-01T00:00:00.000Z",
    tags: ["hooks", "performance", "state"]
  }
];

const mockNotes: Note[] = [
  {
    id: "1",
    courseId: "1",
    question: "How does the React reconciliation algorithm work?",
    topics: ["reconciliation", "rendering"],
    status: "active",
    understanding: 25,
    flags: { focus: true },
    createdAt: "2024-01-20T10:00:00.000Z",
    updatedAt: "2024-01-22T14:30:00.000Z"
  },
  {
    id: "2",
    courseId: "1", 
    question: "When should I use useEffect vs useLayoutEffect?",
    topics: ["hooks"],
    status: "answered",
    understanding: 85,
    flags: { mastered: true },
    createdAt: "2024-01-18T09:00:00.000Z",
    updatedAt: "2024-01-21T16:45:00.000Z"
  },
  {
    id: "3",
    courseId: "2",
    question: "What are the different ways to optimize React performance?",
    topics: ["performance", "rendering"],
    status: "active", 
    understanding: 40,
    flags: { blackBox: true },
    createdAt: "2024-02-05T11:30:00.000Z",
    updatedAt: "2024-02-07T13:20:00.000Z"
  },
  {
    id: "4",
    courseId: "2",
    question: "How does React's state batching work in v18?",
    topics: ["state", "hooks"],
    status: "draft",
    understanding: 10,
    flags: { focus: true },
    createdAt: "2024-02-10T15:00:00.000Z",
    updatedAt: "2024-02-10T15:00:00.000Z"
  }
];

const mockDailyEntries: DailyEntry[] = [
  {
    id: "1",
    date: "2024-08-25",
    studiedMinutes: 45,
    summary: "Reviewed React reconciliation and fiber architecture",
    topicsTouched: ["reconciliation", "rendering"],
    mood: "energized"
  },
  {
    id: "2", 
    date: "2024-08-24",
    studiedMinutes: 30,
    summary: "Practiced useEffect patterns and cleanup",
    topicsTouched: ["hooks"],
    mood: "ok"
  },
  {
    id: "3",
    date: "2024-08-23", 
    studiedMinutes: 60,
    summary: "Deep dive into performance optimization techniques",
    topicsTouched: ["performance"],
    mood: "energized"
  },
  {
    id: "4",
    date: "2024-08-22",
    studiedMinutes: 25,
    summary: "Quick review of state management patterns",
    topicsTouched: ["state"],
    mood: "tired"
  }
];

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [notes, setNotes] = useState<Note[]>(mockNotes);
  const [courses, setCourses] = useState<Course[]>(mockCourses);
  const [dailyEntries] = useState<DailyEntry[]>(mockDailyEntries);
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateNote = async (noteInput: NoteInput) => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newNote: Note = {
        id: Date.now().toString(),
        ...noteInput,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      setNotes(prev => [newNote, ...prev]);
    } catch (error) {
      console.error("Failed to create note:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateNote = (noteId: string, updates: Partial<Note>) => {
    setNotes(prev => 
      prev.map(note => 
        note.id === noteId 
          ? { ...note, ...updates, updatedAt: new Date().toISOString() }
          : note
      )
    );
  };

  const handleDeleteNote = (noteId: string) => {
    setNotes(prev => prev.filter(note => note.id !== noteId));
  };

  const handleCreateCourse = async (courseInput: CourseInput) => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newCourse: Course = {
        id: Date.now().toString(),
        ...courseInput,
      };
      
      setCourses(prev => [newCourse, ...prev]);
    } catch (error) {
      console.error("Failed to create course:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateCourse = (courseId: string, updates: Partial<Course>) => {
    setCourses(prev => 
      prev.map(course => 
        course.id === courseId 
          ? { ...course, ...updates }
          : course
      )
    );
  };

  const handleDeleteCourse = (courseId: string) => {
    setCourses(prev => prev.filter(course => course.id !== courseId));
    // Also delete all notes associated with this course
    setNotes(prev => prev.filter(note => note.courseId !== courseId));
  };

  const handleNav = (page: string) => {
    setCurrentPage(page);
    switch (page) {
      case 'dashboard':
        navigate('/dashboard');
        break;
      case 'courses':
        navigate('/courses');
        break;
      case 'review':
        navigate('/review');
        break;
      case 'notes':
      default:
        navigate('/notes');
    }
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background antialiased">
        <Routes>
          <Route element={<RootLayout />}>
            <Route path="/" element={<DashboardPage notes={notes} dailyEntries={dailyEntries} />} />
            <Route path="/dashboard" element={<DashboardPage notes={notes} dailyEntries={dailyEntries} />} />
            <Route path="/notes" element={
              <NotesPage 
                notes={notes} 
                courses={courses} 
                dailyEntries={dailyEntries} 
                onCreateNote={handleCreateNote} 
                onUpdateNote={handleUpdateNote}
                onDeleteNote={handleDeleteNote}
                isLoading={isLoading} 
              />
            } />
            <Route path="/courses" element={
              <CoursesPage 
                courses={courses} 
                onCreateCourse={handleCreateCourse}
                onUpdateCourse={handleUpdateCourse}
                onDeleteCourse={handleDeleteCourse}
                isLoading={isLoading}
              />
            } />
            <Route path="/review" element={<ReviewPage notes={notes} onUpdateNote={handleUpdateNote} />} />
          </Route>
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App
