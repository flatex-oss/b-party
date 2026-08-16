import React, { useState, useEffect } from 'react';
import { ActiveTab, SurveyResponse } from './types';
import {
  subscribeToResponses,
  saveResponse,
  deleteResponse,
  resetToDemo,
  clearAllResponses,
  fetchResponses,
} from './utils/storage';
import {
  auth,
  onAuthStateChanged,
  UserProfile,
  getLocalUserProfile,
} from './lib/firebase';
import { Navbar } from './components/Navbar';
import { LandingView } from './components/LandingView';
import { SurveyView } from './components/SurveyView';
import { ThankYouView } from './components/ThankYouView';
import { AnalyticsView } from './components/AnalyticsView';
import { CalculatorView } from './components/CalculatorView';
import { Card } from './components/ui/card';
import { AnimatePresence, motion } from 'motion/react';
import { Loader2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('landing');
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [lastResponse, setLastResponse] = useState<SurveyResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => getLocalUserProfile());
  const [isCloudSyncing, setIsCloudSyncing] = useState<boolean>(false);

  // Listen to Firebase Auth
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser({
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          isGuest: false,
        });
      } else {
        const local = getLocalUserProfile();
        setCurrentUser(local);
      }
    });
    return () => unsubAuth();
  }, []);

  // Listen to Firestore real-time updates
  useEffect(() => {
    setIsCloudSyncing(true);
    const unsubscribe = subscribeToResponses(
      (data) => {
        setResponses(data);
        if (data.length > 0 && !lastResponse) {
          setLastResponse(data[0]);
        }
        setLoading(false);
        setIsCloudSyncing(false);
      },
      (err) => {
        console.warn('Realtime sync warning:', err);
        setLoading(false);
        setIsCloudSyncing(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleSurveyComplete = async (newResponse: SurveyResponse) => {
    setLastResponse(newResponse);
    setIsCloudSyncing(true);
    const updated = await saveResponse(newResponse);
    setResponses(updated);
    setIsCloudSyncing(false);
    setActiveTab('thankyou');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRefresh = async () => {
    setIsCloudSyncing(true);
    const fresh = await fetchResponses();
    setResponses(fresh);
    setIsCloudSyncing(false);
  };

  const handleDeleteResponse = async (id: string) => {
    setIsCloudSyncing(true);
    const updated = await deleteResponse(id, responses);
    setResponses(updated);
    setIsCloudSyncing(false);
    if (lastResponse?.id === id) {
      setLastResponse(updated[0] || null);
    }
  };

  const handleResetDemo = async () => {
    setIsCloudSyncing(true);
    const demo = await resetToDemo();
    setResponses(demo);
    setLastResponse(demo[0] || null);
    setIsCloudSyncing(false);
  };

  const handleClearAll = async () => {
    setIsCloudSyncing(true);
    const empty = await clearAllResponses();
    setResponses(empty);
    setLastResponse(null);
    setIsCloudSyncing(false);
  };

  const handleFillAgain = () => {
    setActiveTab('survey');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Adjust max container width based on tab to give analytics and calculator ample room
  const containerMaxWidth =
    activeTab === 'analytics' || activeTab === 'calculator'
      ? 'max-w-3xl'
      : 'max-w-2xl';

  return (
    <div id="app" className={`w-full ${containerMaxWidth} mx-auto flex flex-col gap-6 sm:gap-8 min-h-full transition-all duration-200`}>
      {/* Navigation Bar with Live Auth & Cloud Status */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        guestCount={responses.length}
        user={currentUser}
        onUserChange={setCurrentUser}
        isCloudSyncing={isCloudSyncing}
      />

      {/* Main View Transition Container */}
      <main className="w-full flex-1">
        {loading ? (
          <Card className="text-center p-10 sm:p-14 bg-white border border-slate-200/80 shadow-xs flex flex-col items-center justify-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-orange-50 border border-orange-200/60 flex items-center justify-center text-orange-600 shadow-2xs">
              <Loader2 size={28} className="animate-spin" />
            </div>
            <div className="flex flex-col gap-1">
              <h2 className="font-heading text-lg sm:text-xl font-bold text-slate-900">
                Синхронизация данных...
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-normal">
                Подключение к Firebase Firestore
              </p>
            </div>
          </Card>
        ) : (
          <AnimatePresence mode="wait">
            {activeTab === 'landing' && (
              <LandingView
                key="landing"
                setActiveTab={setActiveTab}
                responses={responses}
              />
            )}

            {activeTab === 'survey' && (
              <SurveyView
                key="survey"
                onComplete={handleSurveyComplete}
                setActiveTab={setActiveTab}
                defaultName={currentUser?.displayName || ''}
              />
            )}

            {activeTab === 'thankyou' && (
              <ThankYouView
                key="thankyou"
                response={lastResponse}
                setActiveTab={setActiveTab}
                onFillAgain={handleFillAgain}
              />
            )}

            {activeTab === 'analytics' && (
              <AnalyticsView
                key="analytics"
                responses={responses}
                onRefresh={handleRefresh}
                onDeleteResponse={handleDeleteResponse}
                onResetDemo={handleResetDemo}
                onClearAll={handleClearAll}
                setActiveTab={setActiveTab}
              />
            )}

            {activeTab === 'calculator' && (
              <CalculatorView
                key="calculator"
                responses={responses}
                setActiveTab={setActiveTab}
              />
            )}
          </AnimatePresence>
        )}
      </main>

      {/* Modern Footer with generous top padding and subtle styling */}
      <footer className="mt-auto text-center text-xs text-slate-400 border-t border-slate-200/80 pt-6 pb-4 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span className="font-medium">🎂 Вкусняхи · Праздничное меню</span>
        <span className="text-slate-400">Firebase Firestore Real-time</span>
      </footer>
    </div>
  );
}
