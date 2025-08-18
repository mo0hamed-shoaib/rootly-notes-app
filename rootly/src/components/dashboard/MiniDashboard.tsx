// src/components/dashboard/MiniDashboard.tsx
import { useMemo } from "react";
import { Calendar, Target, TrendingUp, Focus, BookOpen, Clock, Award, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TopicMix } from "@/components/charts/TopicMix";
import { ProgressRing } from "@/components/charts/ProgressRing";
import { StudyStreak } from "@/components/charts/StudyStreak";
import type { Note, DailyEntry, Topic } from "@/types";
import { motion } from "motion/react";

interface MiniDashboardProps {
  notes: Note[];
  dailyEntries: DailyEntry[];
}

export function MiniDashboard({ notes, dailyEntries }: MiniDashboardProps) {
  const stats = useMemo(() => {
    // Calculate answered percentage
    const answeredNotes = notes.filter(note => note.status === "answered").length;
    const answeredPercentage = notes.length > 0 ? (answeredNotes / notes.length) * 100 : 0;

    // Get today's study data
    const today = new Date().toISOString().split('T')[0];
    const todayEntry = dailyEntries.find(entry => entry.date === today);
    const todayMinutes = todayEntry?.studiedMinutes || 0;

    // Calculate 7-day streak
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    });
    
    const streak = last7Days.reduce((count, date) => {
      const hasStudied = dailyEntries.some(entry => 
        entry.date === date && entry.studiedMinutes > 0
      );
      return hasStudied ? count + 1 : count;
    }, 0);

    // Calculate topic distribution
    const topicCounts: Record<Topic, number> = {
      hooks: 0,
      reconciliation: 0,
      rendering: 0,
      state: 0,
      routing: 0,
      performance: 0,
      other: 0,
    };

    notes.forEach(note => {
      note.topics.forEach(topic => {
        topicCounts[topic]++;
      });
    });

    const totalTopicCount = Object.values(topicCounts).reduce((sum, count) => sum + count, 0);
    const topicMixData = Object.entries(topicCounts)
      .filter(([_, count]) => count > 0)
      .map(([topic, count]) => ({
        name: topic as Topic,
        value: totalTopicCount > 0 ? Math.round((count / totalTopicCount) * 100) : 0,
        count,
      }));

    // Get focus notes
    const focusNotes = notes
      .filter(note => note.flags.focus)
      .sort((a, b) => a.understanding - b.understanding)
      .slice(0, 3);

    // Get study data for chart
    const studyData = last7Days.reverse().map(date => {
      const entry = dailyEntries.find(e => e.date === date);
      return {
        date,
        minutes: entry?.studiedMinutes || 0,
      };
    });

    return {
      answeredPercentage,
      todayMinutes,
      streak,
      topicMixData,
      focusNotes,
      studyData,
      totalNotes: notes.length,
      blackBoxCount: notes.filter(note => note.flags.blackBox).length,
      activeNotes: notes.filter(note => note.status === "active").length,
    };
  }, [notes, dailyEntries]);

  const generateSummary = () => {
    const leadingTopic = stats.topicMixData.length > 0 
      ? stats.topicMixData.reduce((max, topic) => topic.value > max.value ? topic : max)
      : null;

    const parts = [
      `You answered ${Math.round(stats.answeredPercentage)}% of your notes this week.`,
      leadingTopic && `${leadingTopic.name} led your study focus.`,
      stats.blackBoxCount > 0 && `${stats.blackBoxCount} Black Box${stats.blackBoxCount > 1 ? 'es' : ''} await.`
    ].filter(Boolean);

    return parts.join(' ');
  };

  return (
    <div className="space-y-6 sm:space-y-8 lg:space-y-10">
      {/* Summary Text - Centered */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto px-4">
          {generateSummary()}
        </p>
      </motion.div>

      {/* Stats Grid - Responsive and Symmetrical */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
        {/* Today's Study Time */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="h-full border shadow-sm hover:shadow-md transition-all duration-200 hover:border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium">Today's Study</CardTitle>
              <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-2xl sm:text-3xl font-bold text-foreground">
                {stats.todayMinutes}m
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span>{stats.streak} day streak</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Progress Ring */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="h-full border shadow-sm hover:shadow-md transition-all duration-200 hover:border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium">Answered</CardTitle>
              <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Target className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
            </CardHeader>
            <CardContent className="flex items-center justify-center pt-2">
              <ProgressRing percentage={stats.answeredPercentage} size={80} strokeWidth={8} />
            </CardContent>
          </Card>
        </motion.div>

        {/* Total Notes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="h-full border shadow-sm hover:shadow-md transition-all duration-200 hover:border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium">Total Notes</CardTitle>
              <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <BookOpen className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-2xl sm:text-3xl font-bold text-foreground">
                {stats.totalNotes}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span>{stats.activeNotes} active</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Black Box Count */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="h-full border shadow-sm hover:shadow-md transition-all duration-200 hover:border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium">Black Box</CardTitle>
              <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <Zap className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-2xl sm:text-3xl font-bold text-foreground">
                {stats.blackBoxCount}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                <span>need deep dive</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts Section - Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
                 {/* Topic Mix Chart */}
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.5, delay: 0.5 }}
         >
           <Card className="h-full border shadow-sm hover:shadow-md transition-all duration-200 hover:border-primary/20">
             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
               <CardTitle className="text-lg font-semibold">Topic Distribution</CardTitle>
               <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                 <TrendingUp className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
               </div>
             </CardHeader>
             <CardContent className="pt-0">
               <div className="h-72 flex items-center justify-center">
                 {stats.topicMixData.length > 0 ? (
                   <TopicMix data={stats.topicMixData} />
                 ) : (
                   <div className="text-center text-muted-foreground">
                     <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                       <TrendingUp className="w-8 h-8" />
                     </div>
                     <p className="text-sm">No topic data available</p>
                   </div>
                 )}
               </div>
             </CardContent>
           </Card>
         </motion.div>

        {/* Focus Notes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card className="h-full border shadow-sm hover:shadow-md transition-all duration-200 hover:border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-lg font-semibold">Focus Questions</CardTitle>
              <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <Focus className="h-4 w-4 text-red-600 dark:text-red-400" />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-4">
                {stats.focusNotes.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                      <Award className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground">No focus questions</p>
                    <p className="text-xs text-muted-foreground mt-1">Add focus flags to prioritize</p>
                  </div>
                ) : (
                  stats.focusNotes.map((note, index) => (
                    <div key={note.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                      <div className="w-2 h-2 rounded-full bg-amber-500 mt-2 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium line-clamp-2 mb-1" title={note.question}>
                          {note.question}
                        </p>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {note.understanding}%
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {note.topics[0]}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Study Activity Chart - Full Width */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <Card className="border shadow-sm hover:shadow-md transition-all duration-200 hover:border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-lg font-semibold">7-Day Study Activity</CardTitle>
            <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <Clock className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-32 sm:h-40 overflow-hidden">
              <StudyStreak data={stats.studyData} />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
