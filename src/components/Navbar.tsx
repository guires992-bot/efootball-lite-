import React, { useState } from 'react';
import { Trophy, Menu, X, Shield, ArrowUpRight, User, LogOut } from 'lucide-react';
import { NavSection } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { PlayerAvatar } from './auth/AvatarPresets';

interface NavbarProps {
  activeSection: string;
  onNavigate: (section: NavSection) => void;
  onOpenJoinModal: () => void;
  onNavigateLogin?: () => void;
  onNavigateRegister?: () => void;
  onNavigateProfile?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeSection,
  onNavigate,
  onOpenJoinModal,
  onNavigateLogin,
  onNavigateRegister,
  onNavigateProfile,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, profile, signOut } = useAuth();

  const navLinks: { id: NavSection; label: string }[] = [
    { id: 'accueil', label: 'Accueil' },
    { id: 'equipes', label: 'Équipes' },
    { id: 'joueurs', label: 'Joueurs' },
    { id: 'apprendre', label: 'Académie' },
    { id: 'classements', label: 'Classements' },
    { id: 'tournois', label: 'Tournois' },
  ];

  const handleLinkClick = (id: NavSection) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#070b14]/90 backdrop-blur-md border-b border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-6">
        {/* Zone 1: Brand wordmark with esports emblem */}
        <button
          onClick={() => handleLinkClick('accueil')}
          className="flex items-center gap-3 text-left group cursor-pointer shrink-0"
          aria-label="eFootball Elite Accueil"
        >
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 via-blue-700 to-emerald-500 p-0.5 shadow-[0_0_15px_rgba(37,99,235,0.3)]">
            <div className="w-full h-full bg-[#070b14] rounded-[7px] flex items-center justify-center text-blue-400 group-hover:text-emerald-400 transition-colors">
              <Shield className="w-5 h-5" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-heading text-2xl font-bold tracking-wider text-white whitespace-nowrap leading-none">
              eFOOTBALL <span className="text-blue-500 group-hover:text-emerald-400 transition-colors">ELITE</span>
            </span>
          </div>
        </button>

        {/* Zone 2: Nav links with hover indicator */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className={`transition-colors whitespace-nowrap shrink-0 relative py-1 cursor-pointer ${
                  isActive ? 'text-blue-400 font-semibold' : 'text-slate-300 hover:text-white'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-emerald-400 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Account & Auth Actions */}
        <div className="hidden sm:flex items-center gap-3 shrink-0">
          {user ? (
            <div className="flex items-center gap-3">
              <button
                onClick={onNavigateProfile}
                className="cursor-pointer inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 hover:text-white transition-all shadow-[0_0_15px_rgba(37,99,235,0.15)] group"
              >
                <PlayerAvatar avatarId={profile?.avatar_url || 'avatar-1'} size="sm" />
                <div className="flex flex-col text-left">
                  <span className="text-white font-bold leading-tight group-hover:text-blue-400 transition-colors">
                    {profile?.username || 'Mon Profil'}
                  </span>
                  <span className="text-[10px] text-amber-400 font-mono font-semibold">
                    {profile?.xp ?? 0} XP
                  </span>
                </div>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={onNavigateLogin}
                className="cursor-pointer px-3.5 py-2 text-xs font-semibold uppercase tracking-wider text-slate-300 hover:text-white hover:bg-slate-900 rounded-lg transition-colors border border-transparent hover:border-slate-800"
              >
                Connexion
              </button>

              <button
                onClick={onNavigateRegister}
                className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 rounded-lg transition-all shadow-[0_0_15px_rgba(37,99,235,0.35)]"
              >
                <User className="w-3.5 h-3.5" />
                <span>Inscription</span>
              </button>
            </div>
          )}
        </div>

        {/* Mobile Hamburger toggle */}
        <div className="flex lg:hidden items-center gap-2">
          {user && (
            <button
              onClick={onNavigateProfile}
              className="cursor-pointer p-1 rounded-lg bg-slate-900 border border-slate-800"
              title="Mon profil"
            >
              <PlayerAvatar avatarId={profile?.avatar_url || 'avatar-1'} size="sm" />
            </button>
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-300 hover:text-white rounded-lg bg-slate-900 border border-slate-800"
            aria-label={mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#070b14]/98 border-b border-slate-800 px-6 py-6 animate-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className={`text-left text-lg font-medium py-2 px-3 rounded-md transition-colors ${
                  activeSection === link.id
                    ? 'bg-blue-950/60 text-blue-400 font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                {link.label}
              </button>
            ))}

            {/* User section in mobile */}
            <div className="pt-4 border-t border-slate-800 flex flex-col gap-3">
              {user ? (
                <>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      if (onNavigateProfile) onNavigateProfile();
                    }}
                    className="w-full py-3 px-4 rounded-xl bg-slate-900 border border-slate-700 text-white font-semibold text-sm flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <PlayerAvatar avatarId={profile?.avatar_url || 'avatar-1'} size="sm" />
                      <span>{profile?.username || 'Mon Profil'}</span>
                    </div>
                    <span className="text-amber-400 font-mono text-xs">{profile?.xp ?? 0} XP</span>
                  </button>

                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      signOut();
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-red-950/30 text-red-400 border border-red-500/20 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Déconnexion</span>
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      if (onNavigateLogin) onNavigateLogin();
                    }}
                    className="py-2.5 px-3 rounded-xl bg-slate-900 border border-slate-800 text-white font-bold text-xs uppercase tracking-wider text-center"
                  >
                    Connexion
                  </button>

                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      if (onNavigateRegister) onNavigateRegister();
                    }}
                    className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-600 text-white font-bold text-xs uppercase tracking-wider text-center"
                  >
                    Inscription
                  </button>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
