import React from 'react';
import {
  Zap,
  Target,
  Shield,
  Trophy,
  Flame,
  Award,
  Crown,
  Compass,
} from 'lucide-react';

export interface AvatarOption {
  id: string;
  name: string;
  role: string;
  color: string;
  bgGradient: string;
  border: string;
  icon: React.ReactNode;
}

export const AVATAR_PRESETS: AvatarOption[] = [
  {
    id: 'avatar-1',
    name: 'Buteur Foudroyant',
    role: 'Attaquant Star',
    color: 'text-sky-400',
    bgGradient: 'from-blue-600 via-sky-500 to-cyan-400',
    border: 'border-sky-500/50',
    icon: <Zap className="w-5 h-5" />,
  },
  {
    id: 'avatar-2',
    name: 'Maestro Tacticien',
    role: 'Milieu Créateur',
    color: 'text-emerald-400',
    bgGradient: 'from-emerald-600 via-teal-500 to-green-400',
    border: 'border-emerald-500/50',
    icon: <Target className="w-5 h-5" />,
  },
  {
    id: 'avatar-3',
    name: 'Roc Défensif',
    role: 'Défenseur Central',
    color: 'text-blue-400',
    bgGradient: 'from-indigo-600 via-blue-600 to-blue-400',
    border: 'border-blue-500/50',
    icon: <Shield className="w-5 h-5" />,
  },
  {
    id: 'avatar-4',
    name: 'Champion d’Arène',
    role: 'Compétiteur Élite',
    color: 'text-amber-400',
    bgGradient: 'from-amber-600 via-yellow-500 to-orange-400',
    border: 'border-amber-500/50',
    icon: <Trophy className="w-5 h-5" />,
  },
  {
    id: 'avatar-5',
    name: 'Ailier Explosif',
    role: 'Dribbleur Vif',
    color: 'text-violet-400',
    bgGradient: 'from-purple-600 via-violet-500 to-indigo-400',
    border: 'border-purple-500/50',
    icon: <Flame className="w-5 h-5" />,
  },
  {
    id: 'avatar-6',
    name: 'Coach Stratège',
    role: 'Analyste Banc',
    color: 'text-slate-300',
    bgGradient: 'from-slate-700 via-slate-600 to-zinc-500',
    border: 'border-slate-500/50',
    icon: <Compass className="w-5 h-5" />,
  },
  {
    id: 'avatar-7',
    name: 'Muraille Infranchissable',
    role: 'Gardien Numéro 1',
    color: 'text-rose-400',
    bgGradient: 'from-rose-600 via-red-500 to-orange-400',
    border: 'border-rose-500/50',
    icon: <Award className="w-5 h-5" />,
  },
  {
    id: 'avatar-8',
    name: 'Légende eFOOTBALL',
    role: 'Grand Maître',
    color: 'text-yellow-300',
    bgGradient: 'from-yellow-500 via-amber-500 to-emerald-400',
    border: 'border-yellow-400/60',
    icon: <Crown className="w-5 h-5" />,
  },
];

export const PlayerAvatar: React.FC<{
  avatarId?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}> = ({ avatarId = 'avatar-1', size = 'md', className = '' }) => {
  const preset = AVATAR_PRESETS.find((a) => a.id === avatarId) || AVATAR_PRESETS[0];

  const sizeStyles = {
    sm: 'w-8 h-8 rounded-lg text-xs p-0.5',
    md: 'w-10 h-10 rounded-xl text-sm p-0.5',
    lg: 'w-14 h-14 rounded-2xl text-base p-1',
    xl: 'w-20 h-20 rounded-3xl text-xl p-1',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-7 h-7',
    xl: 'w-10 h-10',
  };

  return (
    <div
      className={`inline-flex shrink-0 items-center justify-center bg-gradient-to-br ${preset.bgGradient} ${sizeStyles[size]} shadow-[0_0_15px_rgba(37,99,235,0.25)] ${className}`}
    >
      <div className="w-full h-full bg-[#070b14] rounded-[inherit] flex items-center justify-center text-white">
        <span className={`${preset.color}`}>
          {React.cloneElement(preset.icon as React.ReactElement<{ className?: string }>, {
            className: iconSizes[size],
          })}
        </span>
      </div>
    </div>
  );
};
