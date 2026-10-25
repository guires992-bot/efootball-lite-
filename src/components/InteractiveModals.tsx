import React, { useState } from 'react';
import { X, Trophy, Layers, BookOpen, Users, Check, AlertCircle, Shield, Send, ExternalLink } from 'lucide-react';
import { FORMATIONS_DATA, FEATURED_PLAYERS_SAMPLE } from '../data/arenaData';
import { AcademyLevel, TournamentItem, TacticalFormation } from '../types';

// Generic Modal Container
interface ModalWrapperProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

const ModalWrapper: React.FC<ModalWrapperProps> = ({ isOpen, onClose, title, subtitle, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-[#0b1222] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-5 sm:p-6 border-b border-slate-800 bg-[#080d19]">
          <div>
            <h3 className="font-heading text-2xl font-bold uppercase text-white tracking-wide">{title}</h3>
            {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="cursor-pointer p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Fermer la boîte de dialogue"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 max-h-[75vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

// 1. Squad Builder Preview Modal
interface SquadBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SquadBuilderModal: React.FC<SquadBuilderModalProps> = ({ isOpen, onClose }) => {
  const [selectedFormationId, setSelectedFormationId] = useState<string>('4-2-1-3');
  const formation = FORMATIONS_DATA.find((f) => f.id === selectedFormationId) || FORMATIONS_DATA[0];

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title="Aperçu Tactique — Constructeur d'équipe"
      subtitle="Visualisation du onze de départ et des synergies méta"
    >
      <div className="space-y-6">
        {/* Formation Selector */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Choisis ta formation
          </label>
          <div className="grid grid-cols-3 gap-2">
            {FORMATIONS_DATA.map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedFormationId(f.id)}
                className={`cursor-pointer py-2.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${
                  selectedFormationId === f.id
                    ? 'bg-blue-600 text-white border-blue-400 shadow-[0_0_15px_rgba(37,99,235,0.3)]'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                {f.id}
              </button>
            ))}
          </div>
        </div>

        {/* Formation details banner */}
        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
          <div>
            <p className="font-semibold text-white">{formation.name}</p>
            <p className="text-slate-400 mt-0.5">{formation.strengths}</p>
          </div>
          <span className="text-emerald-400 font-mono font-medium">{formation.playstyleFit}</span>
        </div>

        {/* Interactive Pitch Board */}
        <div className="relative aspect-[3/4] sm:aspect-[4/3] w-full bg-[#081523] rounded-2xl border-2 border-slate-800 p-4 overflow-hidden shadow-inner">
          {/* Pitch lines */}
          <div className="absolute inset-3 border border-emerald-500/20 rounded pointer-events-none" />
          <div className="absolute top-1/2 left-3 right-3 h-[1px] bg-emerald-500/20 -translate-y-1/2 pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full border border-emerald-500/20 pointer-events-none" />
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-32 h-14 border-b border-l border-r border-emerald-500/20 pointer-events-none" />
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-32 h-14 border-t border-l border-r border-emerald-500/20 pointer-events-none" />

          {/* Player Nodes */}
          {formation.slots.map((slot, index) => (
            <div
              key={index}
              className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer"
              style={{ left: `${slot.x}%`, top: `${slot.y}%` }}
            >
              <div className="w-8 h-8 rounded-full bg-blue-600 border-2 border-white/80 text-white font-mono text-[10px] font-bold flex items-center justify-center shadow-md group-hover:scale-125 group-hover:bg-emerald-500 transition-all">
                {slot.position}
              </div>
              <span className="text-[10px] font-bold text-slate-200 mt-1 bg-black/70 px-1.5 py-0.5 rounded whitespace-nowrap">
                {slot.label}
              </span>
            </div>
          ))}
        </div>

        <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-800/40 text-xs text-blue-200 flex items-start gap-3">
          <Layers className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-white">Module complet en cours de déploiement</p>
            <p className="text-slate-300 mt-0.5">
              La version finale permettra d'importer tes effectifs, de tester les combinaisons d'instructions individuelles et de simuler les collectifs d'équipe.
            </p>
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
};

// 2. Player Guide Preview Modal
interface PlayerGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PlayerGuideModal: React.FC<PlayerGuideModalProps> = ({ isOpen, onClose }) => {
  const [selectedPlayer, setSelectedPlayer] = useState(FEATURED_PLAYERS_SAMPLE[0]);

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title="Guide des Joueurs & Fiches Techniques"
      subtitle="Comprendre les statistiques cachées, postes et compétences spéciales"
    >
      <div className="space-y-6">
        {/* Quick Player Switcher */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {FEATURED_PLAYERS_SAMPLE.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedPlayer(p)}
              className={`cursor-pointer px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap border transition-all ${
                selectedPlayer.id === p.id
                  ? 'bg-emerald-600 text-white border-emerald-400'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
              }`}
            >
              {p.name} ({p.position})
            </button>
          ))}
        </div>

        {/* Selected Player Detailed Sheet */}
        <div className="bg-[#080d19] rounded-2xl border border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-blue-400 font-semibold">{selectedPlayer.club} · {selectedPlayer.nationality}</span>
              <h4 className="font-heading text-2xl font-bold uppercase text-white mt-0.5">{selectedPlayer.name}</h4>
              <p className="text-xs text-emerald-400 font-medium">Style de jeu : {selectedPlayer.playStyle}</p>
            </div>
            <div className="text-right">
              <span className="font-heading text-4xl font-extrabold text-white font-mono tabular-nums">{selectedPlayer.overall}</span>
              <span className="block text-[10px] text-slate-400 uppercase tracking-wider">Note Globale</span>
            </div>
          </div>

          {/* Key Stats Grid */}
          <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-800 text-xs">
            <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800/80">
              <span className="text-slate-400">Vitesse / Accél.</span>
              <p className="text-sm font-bold font-mono text-white mt-1 tabular-nums">{selectedPlayer.keyStats.pace}</p>
            </div>
            <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800/80">
              <span className="text-slate-400">Tir / Finition</span>
              <p className="text-sm font-bold font-mono text-white mt-1 tabular-nums">{selectedPlayer.keyStats.finishing}</p>
            </div>
            <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800/80">
              <span className="text-slate-400">Passes courtes/longues</span>
              <p className="text-sm font-bold font-mono text-white mt-1 tabular-nums">{selectedPlayer.keyStats.passing}</p>
            </div>
            <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800/80">
              <span className="text-slate-400">Dribble / Contrôle</span>
              <p className="text-sm font-bold font-mono text-white mt-1 tabular-nums">{selectedPlayer.keyStats.dribbling}</p>
            </div>
            <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800/80">
              <span className="text-slate-400">Défense / Agressivité</span>
              <p className="text-sm font-bold font-mono text-white mt-1 tabular-nums">{selectedPlayer.keyStats.defending}</p>
            </div>
            <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800/80">
              <span className="text-slate-400">Physique / Équilibre</span>
              <p className="text-sm font-bold font-mono text-white mt-1 tabular-nums">{selectedPlayer.keyStats.physical}</p>
            </div>
          </div>

          {/* Skills tags */}
          <div className="pt-2">
            <p className="text-xs font-semibold text-slate-400 mb-2">Compétences de joueur recommandées :</p>
            <div className="flex flex-wrap gap-2 text-xs">
              {selectedPlayer.skills.map((s, i) => (
                <span key={i} className="px-2.5 py-1 rounded bg-slate-800 text-slate-200 border border-slate-700">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
};

// 3. Academy Level Detailed Curriculum Modal
interface AcademyDetailModalProps {
  level: AcademyLevel | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenFullAcademy?: () => void;
}

export const AcademyDetailModal: React.FC<AcademyDetailModalProps> = ({
  level,
  isOpen,
  onClose,
  onOpenFullAcademy,
}) => {
  if (!level) return null;

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title={`Académie — Palier ${level.title}`}
      subtitle={level.tagline}
    >
      <div className="space-y-4">
        <div className="p-3 bg-blue-950/40 rounded-xl border border-blue-800/40 flex items-center justify-between text-xs text-blue-200">
          <span>Programme certifié eFootball Elite</span>
          <span className="font-mono text-white">{level.duration}</span>
        </div>

        <div className="space-y-3">
          {level.modules.map((m, idx) => (
            <div key={idx} className="bg-[#080d19] p-4 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between mb-1.5">
                <h5 className="font-heading text-lg font-bold text-white">{m.title}</h5>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-emerald-400 border border-slate-700">
                  {m.controlsKey}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{m.description}</p>
            </div>
          ))}
        </div>

        {onOpenFullAcademy && (
          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button
              onClick={() => {
                onClose();
                onOpenFullAcademy();
              }}
              className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)]"
            >
              <span>Accéder aux leçons interactives & quiz</span>
              <BookOpen className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </ModalWrapper>
  );
};

// 4. Tournament Inscription Modal
interface TournamentModalProps {
  tournament: TournamentItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TournamentModal: React.FC<TournamentModalProps> = ({ tournament, isOpen, onClose }) => {
  const [pseudo, setPseudo] = useState('');
  const [platform, setPlatform] = useState('PlayStation 5');
  const [submitted, setSubmitted] = useState(false);

  if (!tournament) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pseudo.trim()) return;
    setSubmitted(true);
  };

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={() => {
        setSubmitted(false);
        onClose();
      }}
      title="Inscription Tournoi Communautaire"
      subtitle={tournament.name}
    >
      {submitted ? (
        <div className="text-center py-6 space-y-4">
          <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/40">
            <Check className="w-8 h-8" />
          </div>
          <h4 className="font-heading text-2xl font-bold uppercase text-white">Pré-inscription Confirmée !</h4>
          <p className="text-xs text-slate-300 max-w-md mx-auto">
            Ton pseudo <strong className="text-white">{pseudo}</strong> est enregistré pour le tournoi <strong className="text-emerald-400">{tournament.name}</strong> ({tournament.dates}).
          </p>
          <button
            onClick={() => {
              setSubmitted(false);
              onClose();
            }}
            className="cursor-pointer px-6 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold uppercase tracking-wider mt-4"
          >
            Fermer
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Pseudo en jeu (eFootball ID ou Gamertag)
            </label>
            <input
              type="text"
              required
              value={pseudo}
              onChange={(e) => setPseudo(e.target.value)}
              placeholder="Ex: Aero_Player99"
              className="w-full bg-[#080d19] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Plateforme de jeu
            </label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="w-full bg-[#080d19] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
            >
              <option value="PlayStation 5">PlayStation 5</option>
              <option value="PC (Steam)">PC (Steam)</option>
              <option value="Xbox Series X/S">Xbox Series X/S</option>
              <option value="Mobile (iOS / Android)">Mobile (iOS / Android)</option>
            </select>
          </div>

          <div className="p-3 bg-slate-900 rounded-xl text-xs text-slate-400 border border-slate-800">
            <span className="font-semibold text-slate-200">Rappel du format :</span> {tournament.format} · {tournament.prizePool}
          </div>

          <button
            type="submit"
            className="cursor-pointer w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-600 text-white text-xs font-bold uppercase tracking-wider hover:opacity-95 transition-all mt-4"
          >
            Confirmer mon inscription
          </button>
        </form>
      )}
    </ModalWrapper>
  );
};

// 5. Contact & Community Join Modal
interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTopic?: string;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose, defaultTopic = 'General' }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSent(true);
  };

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={() => {
        setSent(false);
        onClose();
      }}
      title="Contacter eFootball Elite"
      subtitle="Une question, une idée de tournoi ou une suggestion tactique ?"
    >
      {sent ? (
        <div className="text-center py-6 space-y-4">
          <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/40">
            <Check className="w-8 h-8" />
          </div>
          <h4 className="font-heading text-2xl font-bold uppercase text-white">Message Reçu !</h4>
          <p className="text-xs text-slate-300 max-w-md mx-auto">
            Merci de ton message. L'équipe d'eFootball Elite te répondra par courriel à <strong className="text-white">{email}</strong> sous 24 à 48 heures.
          </p>
          <button
            onClick={() => {
              setSent(false);
              onClose();
            }}
            className="cursor-pointer px-6 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold uppercase tracking-wider mt-4"
          >
            Fermer
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Ton adresse e-mail
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="joueur@domaine.com"
              className="w-full bg-[#080d19] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Sujet
            </label>
            <select
              defaultValue={defaultTopic}
              className="w-full bg-[#080d19] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
            >
              <option value="General">Question générale / Rejoindre l'arène</option>
              <option value="Tournois">Organisation de tournois / Homologation</option>
              <option value="Tactiques">Contribution aux guides tactiques</option>
              <option value="Partenariat">Partenariat communautaire</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Ton message
            </label>
            <textarea
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Explique ta demande ou partage ton retour..."
              className="w-full bg-[#080d19] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>

          <button
            type="submit"
            className="cursor-pointer w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span>Envoyer le message</span>
          </button>
        </form>
      )}
    </ModalWrapper>
  );
};

// 6. Legal and Disclaimer Modal
interface LegalModalProps {
  type: 'mentions' | 'privacy' | 'terms' | null;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  return (
    <ModalWrapper
      isOpen={Boolean(type)}
      onClose={onClose}
      title={
        type === 'mentions'
          ? 'À Propos & Statut Indépendant'
          : type === 'privacy'
          ? 'Politique de Confidentialité'
          : 'Conditions Générales d\'Utilisation'
      }
    >
      <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
        {type === 'mentions' && (
          <>
            <div className="p-3 bg-red-950/30 border border-red-800/40 rounded-xl text-red-200">
              <strong className="text-white block mb-1">Clause de non-affiliation (Konami) :</strong>
              eFootball Elite est un projet web indépendant fondé par des passionnés de football virtuel et d'e-sport. Le site n'est ni sponsorisé, ni validé, ni affilié à la société Konami Digital Entertainment Inc.
            </div>
            <p>
              Toutes les marques, visuels de jeu, noms de joueurs et données associées demeurent la propriété stricte de leurs titulaires respectifs. eFootball Elite a vocation exclusive à fournir des analyses tactiques, des guides d'apprentissage et un espace d'émulation communautaire à but non commercial.
            </p>
            <p>
              Hébergement : Conforme au déploiement JAMstack moderne sur Netlify avec architecture SPA optimisée.
            </p>
          </>
        )}

        {type === 'privacy' && (
          <>
            <p>
              Nous respectons scrupuleusement la vie privée de nos visiteurs. eFootball Elite ne recueille aucune donnée personnelle sans consentement explicite.
            </p>
            <p>
              Les formulaires d'inscription aux tournois et de contact ne transmettent aucune donnée à des régies publicitaires tierces.
            </p>
            <p>
              Aucun traceur invasif ou cookie tiers n'est requis pour la consultation des tactiques et de l'académie.
            </p>
          </>
        )}

        {type === 'terms' && (
          <>
            <p>
              L'accès à eFootball Elite est gratuit et libre. Les utilisateurs s'engagent à respecter les règles de courtoisie et d'esprit sportif lors des compétitions et tournois communautaires.
            </p>
            <p>
              Tout comportement anti-jeu, déconnexion volontaire répétée ou triche avérée entraînera l'exclusion immédiate des classements de la ligue.
            </p>
          </>
        )}
      </div>
    </ModalWrapper>
  );
};
