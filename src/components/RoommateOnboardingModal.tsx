import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, ArrowLeft, X } from 'lucide-react';

interface RoommateOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartPosting?: () => void;
}

interface StepConfig {
  targetId: string;
  badge: string;
  title: string;
  desc: string;
}

const STEPS: StepConfig[] = [
  {
    targetId: 'tour-post-card',
    badge: 'Step 1/3: Post Requirement',
    title: 'Apna Requirement Yahan Post Karo ✍️',
    desc: 'Room chahiye ya rent share karne flatmate dhoondh rahe ho? 1 minute mein post karo.',
  },
  {
    targetId: 'tour-teamup-btn',
    badge: 'Step 2/3: New Roommate ya Room in Flat',
    title: 'Choose What You Are Looking For 🤝',
    desc: 'Roommate dhoondh rahe ho toh New Roommate select karo, ya already available flat mein private room chahiye toh Room in Flat click karo.',
  },
  {
    targetId: 'tour-card-whatsapp',
    badge: 'Step 3/3: Direct Connect',
    title: 'Connect with Our Flatzy Team 💬',
    desc: 'Agar kisi flatmate se connect karna hai ya hamari team se direct support chahiye, yahan WhatsApp pe click karo.',
  },
];

export const RoommateOnboardingModal: React.FC<RoommateOnboardingModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [popoverRect, setPopoverRect] = useState<DOMRect | null>(null);

  const step = STEPS[currentStep];
  const isLast = currentStep === STEPS.length - 1;

  useEffect(() => {
    if (!isOpen) return;

    const updatePosition = () => {
      const el = document.getElementById(step.targetId);
      if (el) {
        el.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'center',
        });

        setTimeout(() => {
          const rect = el.getBoundingClientRect();
          setTargetRect(rect);
          if (popoverRef.current) {
            setPopoverRect(popoverRef.current.getBoundingClientRect());
          }
        }, 320);
      }
    };

    updatePosition();

    const handleRecalc = () => {
      const el = document.getElementById(step.targetId);
      if (el) {
        setTargetRect(el.getBoundingClientRect());
      }
      if (popoverRef.current) {
        setPopoverRect(popoverRef.current.getBoundingClientRect());
      }
    };

    window.addEventListener('resize', handleRecalc);
    window.addEventListener('scroll', handleRecalc, true);

    return () => {
      window.removeEventListener('resize', handleRecalc);
      window.removeEventListener('scroll', handleRecalc, true);
    };
  }, [isOpen, currentStep, step.targetId]);

  if (!isOpen) return null;

  const handleNext = () => {
    if (isLast) {
      onClose();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // Coordinates for the direct connector line
  let startX = 0;
  let startY = 0;
  let endX = 0;
  let endY = 0;

  if (targetRect && popoverRect) {
    startX = Math.max(20, Math.min(window.innerWidth - 20, targetRect.left + targetRect.width / 2));
    startY = targetRect.bottom > 100 && targetRect.bottom < popoverRect.top
      ? targetRect.bottom
      : targetRect.top;

    endX = Math.max(20, Math.min(window.innerWidth - 20, popoverRect.left + popoverRect.width / 2));
    endY = popoverRect.top;
  }

  const midY = (startY + endY) / 2;

  return (
    <div className="fixed inset-0 z-[1000] pointer-events-none select-none">
      {/* NO BLURRED BG / NO DIMMED OVERLAY - page is fully clear and visible */}

      {/* SVG Dotted Line connecting Target Element directly to White Card */}
      {targetRect && popoverRect && (
        <svg className="fixed inset-0 w-full h-full pointer-events-none z-[1002] overflow-visible">
          <path
            d={`M ${startX} ${startY} C ${startX} ${midY}, ${endX} ${midY}, ${endX} ${endY}`}
            fill="none"
            stroke="#f59e0b"
            strokeWidth="2.5"
            strokeDasharray="5 5"
            strokeLinecap="round"
          />
          {/* Glowing Anchor Dot on Target element */}
          <circle
            cx={startX}
            cy={startY}
            r="6"
            fill="#f59e0b"
            stroke="#ffffff"
            strokeWidth="2.5"
          />
          {/* Connector Dot at white card */}
          <circle
            cx={endX}
            cy={endY}
            r="4.5"
            fill="#d97706"
            stroke="#ffffff"
            strokeWidth="2"
          />
        </svg>
      )}

      {/* Target Element Outline (Clean Dotted Frame) */}
      {targetRect && (
        <div
          className="fixed pointer-events-none transition-all duration-300 z-[1001]"
          style={{
            top: targetRect.top - 4,
            left: targetRect.left - 4,
            width: targetRect.width + 8,
            height: targetRect.height + 8,
          }}
        >
          <div className="w-full h-full rounded-2xl border-2 border-dashed border-amber-500 shadow-[0_4px_20px_rgba(245,158,11,0.22)]" />
        </div>
      )}

      {/* Pure White Pop-Up Card */}
      <div
        ref={popoverRef}
        className="fixed bottom-24 sm:bottom-28 left-4 right-4 sm:left-auto sm:right-8 sm:w-[320px] max-w-[330px] mx-auto sm:mx-0 z-[1003] pointer-events-auto bg-white rounded-2xl shadow-[0_12px_36px_rgba(15,23,42,0.16)] border border-slate-200 p-4 space-y-2.5 animate-in fade-in slide-in-from-bottom-2 duration-200 select-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header: Step Badge + Close */}
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-[10px] font-black uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
            <span>{step.badge}</span>
          </span>

          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Close"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Title & Description */}
        <div className="space-y-1">
          <h4 className="text-[14px] font-black text-slate-900 leading-snug">
            {step.title}
          </h4>
          <p className="text-[12px] text-slate-600 leading-relaxed font-normal">
            {step.desc}
          </p>
        </div>

        {/* Footer: Pagination Dots + Skip & Next Buttons */}
        <div className="flex items-center justify-between pt-2">
          {/* Step Dots (3 steps) */}
          <div className="flex items-center gap-1.5">
            {STEPS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStep(idx)}
                className={`transition-all duration-300 rounded-full ${
                  currentStep === idx
                    ? 'w-4 h-1.5 bg-amber-500'
                    : 'w-1.5 h-1.5 bg-slate-200 hover:bg-slate-300'
                }`}
                aria-label={`Step ${idx + 1}`}
              />
            ))}
          </div>

          {/* Controls: Back (if > 0), Skip, and Next */}
          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <button
                onClick={handlePrev}
                className="px-2 py-1 rounded-lg text-slate-500 hover:text-slate-800 text-[11px] font-semibold transition-colors flex items-center gap-0.5"
              >
                <ArrowLeft className="w-3 h-3" />
                <span>Back</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="text-[11px] font-bold text-slate-400 hover:text-slate-600 transition-colors px-1"
            >
              Skip
            </button>

            <button
              onClick={handleNext}
              className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-95 text-white text-[11px] font-black shadow-xs transition-all flex items-center gap-1"
            >
              <span>{isLast ? 'Got it! 👍' : 'Next'}</span>
              {!isLast && <ArrowRight className="w-3 h-3 stroke-[2.5]" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
