import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { FeaturesSection } from './components/FeaturesSection';
import { AcademySection } from './components/AcademySection';
import { CommunitySection } from './components/CommunitySection';
import { Footer } from './components/Footer';
import { SquadBuilderView } from './components/builder/SquadBuilderView';
import { PlayerGuideView } from './components/guide/PlayerGuideView';
import { AcademyMainView } from './components/academy/AcademyMainView';
import { LoginView } from './components/auth/LoginView';
import { RegisterView } from './components/auth/RegisterView';
import { ForgotPasswordView } from './components/auth/ForgotPasswordView';
import { ResetPasswordView } from './components/auth/ResetPasswordView';
import { PlayerProfileView } from './components/auth/PlayerProfileView';
import { SupabaseConfigModal } from './components/auth/SupabaseConfigModal';
import { useAuth } from './contexts/AuthContext';
import {
  AcademyDetailModal,
  TournamentModal,
  ContactModal,
  LegalModal,
} from './components/InteractiveModals';
import { NavSection, AcademyLevel, TournamentItem } from './types';

type AppView =
  | 'home'
  | 'builder'
  | 'guide'
  | 'academy'
  | 'login'
  | 'register'
  | 'forgot-password'
  | 'reset-password'
  | 'profile';

export function App() {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [activeSection, setActiveSection] = useState<NavSection>('accueil');
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);

  // Modals state
  const [selectedAcademyLevel, setSelectedAcademyLevel] = useState<AcademyLevel | null>(null);
  const [selectedTournament, setSelectedTournament] = useState<TournamentItem | null>(null);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [legalType, setLegalType] = useState<'mentions' | 'privacy' | 'terms' | null>(null);

  const { user } = useAuth();

  // Sync with URL hash for Netlify & browser history support
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#builder' || hash === '#constructeur' || hash === '#equipes') {
        setCurrentView('builder');
        setActiveSection('equipes');
      } else if (hash === '#guide' || hash === '#joueurs' || hash === '#comparateur') {
        setCurrentView('guide');
        setActiveSection('joueurs');
      } else if (hash.startsWith('#academie') || hash === '#apprendre') {
        setCurrentView('academy');
        setActiveSection('apprendre');
        const match = hash.match(/^#academie\/(.+)$/);
        if (match) {
          setSelectedLessonId(match[1]);
        }
      } else if (hash === '#connexion' || hash === '#login') {
        setCurrentView('login');
      } else if (hash === '#inscription' || hash === '#register') {
        setCurrentView('register');
      } else if (hash === '#mot-de-passe-oublie' || hash === '#forgot-password') {
        setCurrentView('forgot-password');
      } else if (hash === '#reinitialisation' || hash === '#reset-password') {
        setCurrentView('reset-password');
      } else if (hash === '#profil' || hash === '#compte' || hash === '#profile') {
        setCurrentView('profile');
      } else {
        setCurrentView('home');
        if (hash === '#classements') setActiveSection('classements');
        else if (hash === '#tournois') setActiveSection('tournois');
        else setActiveSection('accueil');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Navigation router / scroll handler
  const handleNavigate = (section: NavSection) => {
    setActiveSection(section);

    if (section === 'equipes') {
      setCurrentView('builder');
      window.location.hash = '#builder';
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (section === 'joueurs') {
      setCurrentView('guide');
      window.location.hash = '#guide';
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (section === 'apprendre') {
      handleOpenAcademy();
      return;
    }

    if (currentView !== 'home') {
      setCurrentView('home');
      window.location.hash = section === 'accueil' ? '' : `#${section}`;
    }

    if (section === 'accueil') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (section === 'classements' || section === 'tournois') {
      setTimeout(() => {
        const el = document.getElementById('classements');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    }
  };

  const handleOpenBuilder = (squadId?: string) => {
    setCurrentView('builder');
    setActiveSection('equipes');
    window.location.hash = '#builder';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenGuide = () => {
    setCurrentView('guide');
    setActiveSection('joueurs');
    window.location.hash = '#guide';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAcademy = (lessonId?: string) => {
    setCurrentView('academy');
    setActiveSection('apprendre');
    setSelectedLessonId(lessonId || null);
    window.location.hash = lessonId ? `#academie/${lessonId}` : '#academie';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenLogin = () => {
    setCurrentView('login');
    window.location.hash = '#connexion';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenRegister = () => {
    setCurrentView('register');
    window.location.hash = '#inscription';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenProfile = () => {
    setCurrentView('profile');
    window.location.hash = '#profil';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenForgotPassword = () => {
    setCurrentView('forgot-password');
    window.location.hash = '#mot-de-passe-oublie';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setActiveSection('accueil');
    setSelectedLessonId(null);
    window.location.hash = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If in Builder view, render the dedicated Squad Builder tool
  if (currentView === 'builder') {
    return (
      <SquadBuilderView
        onBackToHome={handleBackToHome}
        onGoToGuide={handleOpenGuide}
      />
    );
  }

  // If in Guide view, render the dedicated Player Guide and Comparator
  if (currentView === 'guide') {
    return (
      <PlayerGuideView
        onBackToHome={handleBackToHome}
        onGoToBuilder={handleOpenBuilder}
      />
    );
  }

  // If in Academy view, render the dedicated Academy and Lesson reader
  if (currentView === 'academy') {
    return (
      <AcademyMainView
        onBackToHome={handleBackToHome}
        onGoToBuilder={handleOpenBuilder}
        onGoToGuide={handleOpenGuide}
        initialLessonId={selectedLessonId}
      />
    );
  }

  // Auth Views
  if (currentView === 'login') {
    return (
      <>
        <LoginView
          onBackToHome={handleBackToHome}
          onNavigateRegister={handleOpenRegister}
          onNavigateForgotPassword={handleOpenForgotPassword}
          onOpenConfigModal={() => setIsConfigModalOpen(true)}
        />
        <SupabaseConfigModal
          isOpen={isConfigModalOpen}
          onClose={() => setIsConfigModalOpen(false)}
        />
      </>
    );
  }

  if (currentView === 'register') {
    return (
      <>
        <RegisterView
          onBackToHome={handleBackToHome}
          onNavigateLogin={handleOpenLogin}
          onOpenConfigModal={() => setIsConfigModalOpen(true)}
        />
        <SupabaseConfigModal
          isOpen={isConfigModalOpen}
          onClose={() => setIsConfigModalOpen(false)}
        />
      </>
    );
  }

  if (currentView === 'forgot-password') {
    return (
      <ForgotPasswordView
        onBackToLogin={handleOpenLogin}
        onBackToHome={handleBackToHome}
      />
    );
  }

  if (currentView === 'reset-password') {
    return (
      <ResetPasswordView
        onBackToLogin={handleOpenLogin}
        onBackToHome={handleBackToHome}
      />
    );
  }

  if (currentView === 'profile') {
    // If not logged in, redirect to login view
    if (!user) {
      return (
        <>
          <LoginView
            onBackToHome={handleBackToHome}
            onNavigateRegister={handleOpenRegister}
            onNavigateForgotPassword={handleOpenForgotPassword}
            onOpenConfigModal={() => setIsConfigModalOpen(true)}
          />
          <SupabaseConfigModal
            isOpen={isConfigModalOpen}
            onClose={() => setIsConfigModalOpen(false)}
          />
        </>
      );
    }

    return (
      <PlayerProfileView
        onBackToHome={handleBackToHome}
        onGoToAcademy={handleOpenAcademy}
        onGoToBuilder={handleOpenBuilder}
      />
    );
  }

  // Otherwise, render the Homepage
  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 selection:bg-blue-600 selection:text-white stadium-grid flex flex-col justify-between">
      {/* 1. Header / Navigation */}
      <Navbar
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onOpenJoinModal={() => setIsContactOpen(true)}
        onNavigateLogin={handleOpenLogin}
        onNavigateRegister={handleOpenRegister}
        onNavigateProfile={handleOpenProfile}
      />

      <main id="accueil" className="flex-1">
        {/* 2. Hero Section */}
        <Hero
          onOpenSquadBuilder={handleOpenBuilder}
          onNavigateAcademy={() => handleNavigate('apprendre')}
          onNavigatePlayerGuide={handleOpenGuide}
        />

        {/* 3. Section des 4 Fonctionnalités Majeures */}
        <FeaturesSection
          onOpenSquadBuilder={handleOpenBuilder}
          onOpenPlayerGuide={handleOpenGuide}
          onNavigateAcademy={() => handleNavigate('apprendre')}
          onNavigateTournaments={() => handleNavigate('classements')}
        />

        {/* 4. Section d'Apprentissage (Progresse match après match) */}
        <AcademySection
          onSelectLevel={(level) => setSelectedAcademyLevel(level)}
          onOpenAcademyView={() => handleOpenAcademy()}
        />

        {/* 5. Section Communautaire (Classements, Tournois & Résultats vérifiés) */}
        <CommunitySection
          onRegisterTournament={(t) => setSelectedTournament(t)}
          onOpenReportResultModal={() => setIsContactOpen(true)}
        />
      </main>

      {/* 6. Pied de Page */}
      <Footer
        onOpenLegal={(type) => setLegalType(type)}
        onOpenContact={() => setIsContactOpen(true)}
        onNavigateHome={() => handleNavigate('accueil')}
        onOpenSupabaseConfig={() => setIsConfigModalOpen(true)}
        onNavigateProfile={user ? handleOpenProfile : handleOpenLogin}
      />

      {/* Modals & Dialogs (Zero Dead Clicks) */}
      <SupabaseConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
      />

      <AcademyDetailModal
        level={selectedAcademyLevel}
        isOpen={selectedAcademyLevel !== null}
        onClose={() => setSelectedAcademyLevel(null)}
        onOpenFullAcademy={() => handleOpenAcademy()}
      />

      <TournamentModal
        tournament={selectedTournament}
        isOpen={selectedTournament !== null}
        onClose={() => setSelectedTournament(null)}
      />

      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />

      <LegalModal
        type={legalType}
        onClose={() => setLegalType(null)}
      />
    </div>
  );
}

export default App;
