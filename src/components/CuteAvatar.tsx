import React from 'react';

export interface CuteAvatarOption {
  id: string;
  name: string;
  gender: 'Male' | 'Female';
  gradient: string;
  bg: string;
  border: string;
  badge: string;
  desc: string;
  animationClass: string;
}

// Cute avatars with bouncing/waving/floating animated emojis
export const CUTE_AVATARS: CuteAvatarOption[] = [
  {
    id: 'avatar-cat-ear',
    name: 'Cosy Neko',
    gender: 'Female',
    gradient: 'from-pink-400 to-rose-500',
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    badge: '🐱',
    desc: 'Chill & book lover',
    animationClass: 'animate-bounce',
  },
  {
    id: 'avatar-tech-bro',
    name: 'Dev Pixel',
    gender: 'Male',
    gradient: 'from-blue-500 to-indigo-600',
    bg: 'bg-indigo-50',
    border: 'border-indigo-200',
    badge: '👾',
    desc: 'Night coder & tea fan',
    animationClass: 'animate-pulse',
  },
  {
    id: 'avatar-artist',
    name: 'Sunny Mallow',
    gender: 'Female',
    gradient: 'from-amber-400 to-orange-500',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    badge: '🎨',
    desc: 'Creative & plants lover',
    animationClass: 'animate-bounce',
  },
  {
    id: 'avatar-chill-guy',
    name: 'Wave Rider',
    gender: 'Male',
    gradient: 'from-teal-400 to-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    badge: '🏄‍♂️',
    desc: 'Easygoing & music junkie',
    animationClass: 'animate-pulse',
  },
  {
    id: 'avatar-coffee-nerd',
    name: 'Boba Bear',
    gender: 'Female',
    gradient: 'from-purple-400 to-violet-600',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    badge: '🧋',
    desc: 'Clean & sweet roommate',
    animationClass: 'animate-bounce',
  },
  {
    id: 'avatar-foodie',
    name: 'Kolkata Foodie',
    gender: 'Male',
    gradient: 'from-amber-500 to-red-500',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    badge: '🥟',
    desc: 'Biryani & momo partner',
    animationClass: 'animate-bounce',
  },
  {
    id: 'avatar-zen',
    name: 'Peaceful Sprout',
    gender: 'Female',
    gradient: 'from-emerald-400 to-teal-500',
    bg: 'bg-teal-50',
    border: 'border-teal-200',
    badge: '🌱',
    desc: 'Minimalist & quiet',
    animationClass: 'animate-pulse',
  },
  {
    id: 'avatar-gamer',
    name: 'Arcade Kid',
    gender: 'Male',
    gradient: 'from-cyan-400 to-blue-600',
    bg: 'bg-cyan-50',
    border: 'border-cyan-200',
    badge: '🎮',
    desc: 'Gamer & polite roommate',
    animationClass: 'animate-bounce',
  },
  {
    id: 'avatar-star',
    name: 'Starlight Joy',
    gender: 'Female',
    gradient: 'from-fuchsia-500 to-pink-500',
    bg: 'bg-fuchsia-50',
    border: 'border-fuchsia-200',
    badge: '✨',
    desc: 'Outgoing & organized',
    animationClass: 'animate-spin',
  },
  {
    id: 'avatar-scholar',
    name: 'Campus Brain',
    gender: 'Male',
    gradient: 'from-slate-700 to-slate-900',
    bg: 'bg-slate-100',
    border: 'border-slate-300',
    badge: '🎓',
    desc: 'Studious & disciplined',
    animationClass: 'animate-pulse',
  },
  {
    id: 'avatar-fitness',
    name: 'Gym Bunny',
    gender: 'Female',
    gradient: 'from-lime-400 to-emerald-500',
    bg: 'bg-lime-50',
    border: 'border-lime-200',
    badge: '⚡',
    desc: 'Early bird & fitness fan',
    animationClass: 'animate-bounce',
  },
  {
    id: 'avatar-guitar',
    name: 'Acoustic Soul',
    gender: 'Male',
    gradient: 'from-yellow-400 to-amber-600',
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    badge: '🎸',
    desc: 'Warm vibes & non-intrusive',
    animationClass: 'animate-pulse',
  }
];

export const getAvatarById = (id: string) => {
  return CUTE_AVATARS.find(a => a.id === id) || CUTE_AVATARS[0];
};

export const CuteAvatarDisplay: React.FC<{
  avatarId: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showAnimation?: boolean;
}> = ({ avatarId, size = 'md', className = '', showAnimation = true }) => {
  const avatar = getAvatarById(avatarId);

  const sizeClasses = {
    xs: 'w-8 h-8 text-sm',
    sm: 'w-10 h-10 text-base',
    md: 'w-12 h-12 text-xl',
    lg: 'w-16 h-16 text-3xl',
    xl: 'w-20 h-20 text-4xl',
  };

  return (
    <div
      className={`relative rounded-2xl ${avatar.bg} border-2 ${avatar.border} shadow-2xs flex items-center justify-center select-none overflow-hidden shrink-0 ${sizeClasses[size]} ${className}`}
    >
      <div className={`absolute inset-0 bg-gradient-to-tr ${avatar.gradient} opacity-15`} />
      
      {/* Emoji Badge */}
      <span className="relative z-10 inline-block">
        {avatar.badge}
      </span>

      {/* Decorative sparkle */}
      <span className="absolute top-1 right-1 w-1 h-1 rounded-full bg-white animate-ping" />
    </div>
  );
};
