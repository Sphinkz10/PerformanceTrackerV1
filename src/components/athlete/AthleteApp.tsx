/**
 * Athlete App - Main App for Athlete Role
 * 
 * Features:
 * - AthleteLayout with simplified navigation
 * - AthleteDashboard (main page)
 * - Profile page (reuses NewAthleteProfile in self-view mode)
 * - Lab page (read-only mode)
 * - All Quick Action modals
 * - PHASE 4: Chat, Notifications, History, Export, Wearables
 * 
 * Design System: 100% compliant with Guidelines.md
 * 
 * @author PerformTrack Team
 * @since Athlete Portal - Complete Experience + Phase 4
 */

import { useState } from 'react';
import { Toaster } from 'sonner@2.0.3';
import { useApp } from '../../contexts/AppContext';
import { AthleteLayout } from './layout/AthleteLayout';
import { AthleteDashboard } from './dashboard/AthleteDashboard';
import { NewAthleteProfile } from './NewAthleteProfile';
import { AthleteCalendar } from './calendar/AthleteCalendar';
import { ReportPainModal } from './modals/ReportPainModal';
import { CancelWorkoutModal } from './modals/CancelWorkoutModal';
import { RequestChangeModal } from './modals/RequestChangeModal';
import { MarkUnavailableModal } from './modals/MarkUnavailableModal';
import { WorkoutDetailsModal } from './modals/WorkoutDetailsModal';
import { FloatingChatButton } from './chat/FloatingChatButton';
import { ChatWithCoach } from './chat/ChatWithCoach';
import { NotificationsDrawer } from './notifications/NotificationsDrawer';
import { WorkoutChangesHistory } from './history/WorkoutChangesHistory';
import { ExportReportsModal } from './reports/ExportReportsModal';
import { WearablesConnect } from './wearables/WearablesConnect';

type AthletePage = 'dashboard' | 'profile' | 'chat' | 'calendar' | 'history' | 'wearables';

export function AthleteApp() {
  const { user } = useApp();
  const [currentPage, setCurrentPage] = useState<AthletePage>('dashboard');

  // Modal states
  const [reportPainOpen, setReportPainOpen] = useState(false);
  const [cancelWorkoutOpen, setCancelWorkoutOpen] = useState(false);
  const [requestChangeOpen, setRequestChangeOpen] = useState(false);
  const [markUnavailableOpen, setMarkUnavailableOpen] = useState(false);
  const [workoutDetailsOpen, setWorkoutDetailsOpen] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState<any>(null);

  // PHASE 4: New features states
  const [chatOpen, setChatOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [exportReportsOpen, setExportReportsOpen] = useState(false);

  const handleViewWorkout = (workout: any) => {
    setSelectedWorkout(workout);
    setWorkoutDetailsOpen(true);
  };

  const handleNavigate = (page: AthletePage) => {
    setCurrentPage(page);
    
    // If navigating to chat, open the chat drawer
    if (page === 'chat') {
      setChatOpen(true);
    }
  };

  return (
    <>
      <AthleteLayout
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onNotificationsClick={() => setNotificationsOpen(true)}
      >
        {/* Dashboard */}
        {currentPage === 'dashboard' && (
          <AthleteDashboard
            onReportPain={() => setReportPainOpen(true)}
            onCancelWorkout={() => setCancelWorkoutOpen(true)}
            onRequestChange={() => setRequestChangeOpen(true)}
            onMarkUnavailable={() => setMarkUnavailableOpen(true)}
            onExportReports={() => setExportReportsOpen(true)}
            onViewHistory={() => setCurrentPage('history')}
            onViewWorkout={handleViewWorkout}
          />
        )}

        {/* Profile (Self-View) */}
        {currentPage === 'profile' && (
          <div className="p-4 sm:p-6">
            <NewAthleteProfile
              athleteId={user?.id || 'athlete-1'}
              onBack={() => setCurrentPage('dashboard')}
              isSelfView={true}
            />
          </div>
        )}

        {/* Calendar */}
        {currentPage === 'calendar' && (
          <div className="p-4 sm:p-6 max-w-7xl mx-auto">
            <AthleteCalendar />
          </div>
        )}

        {/* Chat - just keep page active, drawer opens automatically */}
        {currentPage === 'chat' && (
          <div className="p-4 sm:p-6 max-w-4xl mx-auto">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm text-center">
              <h2 className="text-xl font-bold text-slate-900 mb-2">Chat com o Coach</h2>
              <p className="text-sm text-slate-600">
                O chat está aberto! 💬
              </p>
            </div>
          </div>
        )}

        {/* PHASE 4: Workout Changes History */}
        {currentPage === 'history' && (
          <div className="p-4 sm:p-6 max-w-4xl mx-auto">
            <WorkoutChangesHistory />
          </div>
        )}

        {/* PHASE 4: Wearables */}
        {currentPage === 'wearables' && (
          <div className="p-4 sm:p-6 max-w-4xl mx-auto">
            <WearablesConnect />
          </div>
        )}
      </AthleteLayout>

      {/* Quick Action Modals */}
      <ReportPainModal isOpen={reportPainOpen} onClose={() => setReportPainOpen(false)} />
      <CancelWorkoutModal isOpen={cancelWorkoutOpen} onClose={() => setCancelWorkoutOpen(false)} />
      <RequestChangeModal isOpen={requestChangeOpen} onClose={() => setRequestChangeOpen(false)} />
      <MarkUnavailableModal
        isOpen={markUnavailableOpen}
        onClose={() => setMarkUnavailableOpen(false)}
      />
      <WorkoutDetailsModal
        isOpen={workoutDetailsOpen}
        onClose={() => setWorkoutDetailsOpen(false)}
        workout={selectedWorkout}
      />

      {/* PHASE 4: Chat */}
      <FloatingChatButton onClick={() => setChatOpen(true)} unreadCount={2} />
      <ChatWithCoach isOpen={chatOpen} onClose={() => setChatOpen(false)} />

      {/* PHASE 4: Notifications Drawer */}
      <NotificationsDrawer isOpen={notificationsOpen} onClose={() => setNotificationsOpen(false)} />

      {/* PHASE 4: Export Reports Modal */}
      <ExportReportsModal isOpen={exportReportsOpen} onClose={() => setExportReportsOpen(false)} />

      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            borderRadius: '12px',
            fontSize: '14px',
          },
        }}
      />
    </>
  );
}