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
import { auth, onAuthStateChanged, User } from './lib/firebase';
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
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isCloudSyncing, setIsCloudSyncing] = useState<boolean>(false);

  // Listen to Firebase Auth
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
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

  return (
    <div id="app" className="w-full max-w-xl mx-auto flex flex-col gap-4 sm:gap-6 min-h-full">
      {/* Navigation Bar with Live Auth & Cloud Status */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        guestCount={responses.length}
        user={currentUser}
        isCloudSyncing={isCloudSyncing}
      />

      {/* Main View Transition Container */}
      <main className="w-full flex-1">
        {loading ? (
          <Card className="text-center p-8 sm:p-12 bg-white border border-slate-200/80 shadow-xs flex flex-col items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-200/60 flex items-center justify-center text-orange-600">
              <Loader2 size={24} className="animate-spin" />
            </div>
            <h2 className="font-heading text-base sm:text-lg font-bold text-slate-900">
              Синхронизация данных...
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-normal">
              Подключение к Firebase Firestore
            </p>
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

      {/* Modern Footer */}
      <footer className="mt-auto text-center text-xs text-slate-400 border-t border-slate-200/60 pt-4 pb-2">
        <span>🎂 Праздничный опросник · Realtime Firebase Firestore</span>
      </footer>
    </div>
  );
}
