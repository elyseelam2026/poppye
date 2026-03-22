'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useProgress } from '@/lib/progress-context';
import BuddyAvatar from '@/components/BuddyAvatar';
import type { BuddyCharacter } from '@/lib/types';

const EMOJI_OPTIONS = [
  '🐸', '🦁', '🐷', '🦈', '🦜', '🐢', '🦎', '🦩',
  '🐝', '🦔', '🐙', '🦀', '🐳', '🦚', '🐻‍❄️', '🦦',
  '🐺', '🦅', '🐮', '🐰', '🐣', '🦖', '🐊', '🦥',
  '🐾', '🌸', '🌟', '⭐', '🌈', '🎀', '💎', '🔮',
  '👾', '🤖', '👻', '🎃', '🧸', '🎪', '🎠', '🎭',
];

const COLOR_OPTIONS = [
  { name: 'Red', value: '#ef4444', gradient: 'from-red-500 to-rose-600' },
  { name: 'Orange', value: '#f97316', gradient: 'from-orange-500 to-red-500' },
  { name: 'Amber', value: '#f59e0b', gradient: 'from-amber-500 to-yellow-600' },
  { name: 'Green', value: '#22c55e', gradient: 'from-green-500 to-emerald-600' },
  { name: 'Teal', value: '#14b8a6', gradient: 'from-teal-500 to-cyan-600' },
  { name: 'Blue', value: '#3b82f6', gradient: 'from-blue-500 to-indigo-600' },
  { name: 'Indigo', value: '#6366f1', gradient: 'from-indigo-500 to-violet-600' },
  { name: 'Purple', value: '#a855f7', gradient: 'from-purple-500 to-pink-500' },
  { name: 'Pink', value: '#ec4899', gradient: 'from-pink-500 to-rose-600' },
  { name: 'Fuchsia', value: '#d946ef', gradient: 'from-fuchsia-500 to-pink-600' },
  { name: 'Cyan', value: '#06b6d4', gradient: 'from-cyan-500 to-teal-600' },
  { name: 'Sky', value: '#0ea5e9', gradient: 'from-sky-500 to-blue-600' },
];

const PERSONALITY_TEMPLATES = [
  { label: '😊 Friendly', desc: 'Warm and supportive — always cheering you on!' },
  { label: '🤪 Silly', desc: 'Goofy and hilarious — makes learning a joke-fest!' },
  { label: '🧠 Brainy', desc: 'Super smart and nerdy — loves facts and details!' },
  { label: '💪 Sporty', desc: 'Energetic and competitive — treats learning like a sport!' },
  { label: '🎨 Creative', desc: 'Artistic and dreamy — sees beauty in everything!' },
  { label: '😎 Cool', desc: 'Laid-back and chill — makes everything look easy!' },
  { label: '🥰 Sweet', desc: 'Loving and caring — gives the best encouragement!' },
  { label: '🔥 Fierce', desc: 'Bold and brave — faces every challenge head-on!' },
];

export default function DesignBuddyPage() {
  const router = useRouter();
  const { addCustomBuddy, dispatch } = useProgress();

  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('🐸');
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [avatarMode, setAvatarMode] = useState<'grid' | 'type' | 'photo'>('grid');
  const [personality, setPersonality] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [colorIdx, setColorIdx] = useState(0);
  const [greeting, setGreeting] = useState('');
  const [customPhrases, setCustomPhrases] = useState({
    ask: '',
    correct: '',
    wrong: '',
    encourage: '',
  });

  const selectedColor = COLOR_OPTIONS[colorIdx];

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const size = 128;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        // Crop to square from center
        const min = Math.min(img.width, img.height);
        const sx = (img.width - min) / 2;
        const sy = (img.height - min) / 2;
        ctx.drawImage(img, sx, sy, min, min, 0, 0, size, size);
        setCustomImage(canvas.toDataURL('image/webp', 0.8));
        setAvatarMode('photo');
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Preview buddy object for BuddyAvatar
  const previewBuddy: BuddyCharacter = {
    id: 'preview',
    name: name || 'Your Buddy',
    emoji,
    personality: personality || 'Give me a personality!',
    color: selectedColor.value,
    bgGradient: selectedColor.gradient,
    greeting: '',
    askPhrases: [],
    correctReactions: [],
    wrongReactions: [],
    encouragements: [],
    ...(avatarMode === 'photo' && customImage ? { customImage } : {}),
  };

  const generatePhrases = (buddyName: string, buddyEmoji: string, personalityText: string) => {
    const base = {
      askPhrases: [
        `${buddyEmoji} Ooh, try this one!`,
        `Here's a question for you! ${buddyEmoji}`,
        `Let's see what you know! 🤔`,
        `Ready? Here comes a question! ✨`,
        `${buddyName} wants to know...`,
      ],
      correctReactions: [
        `YES! Amazing answer! ${buddyEmoji}🎉`,
        `You got it! ${buddyName} is so proud! ✨`,
        `Brilliant! That's 100% correct! 🏆`,
        `WOOHOO! You're a genius! ${buddyEmoji}💯`,
        `Perfect answer! Keep going! 🌟`,
      ],
      wrongReactions: [
        `Oops! Don't worry, try again! ${buddyEmoji}💕`,
        `Almost! You'll get it next time! 🌈`,
        `That's okay! Learning takes practice! ${buddyEmoji}`,
        `No worries! ${buddyName} believes in you! 💪`,
      ],
      encouragements: [
        `You're doing amazing! ${buddyEmoji}`,
        `${buddyName} is cheering for you! 🎉`,
        `Keep it up, superstar! ⭐`,
        `You make ${buddyName} so proud! ${buddyEmoji}💕`,
      ],
    };

    if (personalityText.toLowerCase().includes('silly') || personalityText.toLowerCase().includes('funny')) {
      base.askPhrases[0] = `*does a silly dance* Try this! ${buddyEmoji}`;
      base.correctReactions[0] = `HAHA YES! You're HILARIOUS-ly smart! ${buddyEmoji}😂`;
    }
    if (personalityText.toLowerCase().includes('brave') || personalityText.toLowerCase().includes('fierce')) {
      base.askPhrases[0] = `*battle stance* Face this challenge! ${buddyEmoji}`;
      base.correctReactions[0] = `LEGENDARY! A true warrior's answer! ${buddyEmoji}⚔️`;
    }

    return base;
  };

  const handleCreate = () => {
    const phrases = generatePhrases(name, emoji, personality);

    // Merge in any custom phrases the user wrote
    if (customPhrases.ask.trim()) {
      phrases.askPhrases.unshift(customPhrases.ask.trim());
    }
    if (customPhrases.correct.trim()) {
      phrases.correctReactions.unshift(customPhrases.correct.trim());
    }
    if (customPhrases.wrong.trim()) {
      phrases.wrongReactions.unshift(customPhrases.wrong.trim());
    }
    if (customPhrases.encourage.trim()) {
      phrases.encouragements.unshift(customPhrases.encourage.trim());
    }

    const buddy: BuddyCharacter = {
      id: `custom-${Date.now()}`,
      name,
      emoji,
      personality,
      color: selectedColor.value,
      bgGradient: selectedColor.gradient,
      greeting: greeting || `Hey there! ${emoji} ${name} is ready to learn with you!`,
      ...phrases,
      isCustom: true,
      ...(avatarMode === 'photo' && customImage ? { customImage } : {}),
    };

    addCustomBuddy(buddy);
    dispatch({ type: 'SET_BUDDY', payload: buddy.id });
    router.push('/buddy');
  };

  return (
    <div className="min-h-screen bg-[#0f0a1e] p-4">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/buddy" className="text-2xl">←</Link>
          <h1 className="text-2xl font-bold">Design Your Buddy</h1>
        </div>

        {/* Progress steps */}
        <div className="flex gap-1 mb-6">
          {[1, 2, 3, 4].map(s => (
            <div
              key={s}
              className={`h-2 flex-1 rounded-full transition-all ${
                s <= step ? 'bg-gradient-to-r from-pink-500 to-purple-600' : 'bg-white/10'
              }`}
            />
          ))}
        </div>

        {/* Live Preview */}
        <div
          className="rounded-2xl p-4 mb-6 border border-white/10 text-center"
          style={{ background: `linear-gradient(135deg, ${selectedColor.value}20, ${selectedColor.value}05)` }}
        >
          <BuddyAvatar buddy={previewBuddy} size="lg" className="animate-float" />
          <p className="font-bold text-xl mt-2">{name || 'Your Buddy'}</p>
          <p className="text-sm text-slate-400">{personality || 'Give me a personality!'}</p>
          {greeting && <p className="text-sm mt-2 text-slate-300">&ldquo;{greeting}&rdquo;</p>}
        </div>

        {/* Step 1: Name & Avatar */}
        {step === 1 && (
          <div className="space-y-4 animate-slide-up">
            <h2 className="text-lg font-bold">Step 1: Name & Look</h2>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Buddy Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value.slice(0, 20))}
                placeholder="e.g. Sparkles, Rocky, Sunshine..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500"
                maxLength={20}
              />
              <p className="text-xs text-slate-500 mt-1">{name.length}/20 characters</p>
            </div>

            {/* Avatar mode tabs */}
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Choose Your Buddy&apos;s Look</label>
              <div className="flex gap-1 bg-white/5 rounded-xl p-1 mb-3">
                {[
                  { mode: 'grid' as const, label: '🎯 Pick' },
                  { mode: 'type' as const, label: '⌨️ Type' },
                  { mode: 'photo' as const, label: '📷 Photo' },
                ].map(t => (
                  <button
                    key={t.mode}
                    onClick={() => setAvatarMode(t.mode)}
                    className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
                      avatarMode === t.mode
                        ? 'bg-purple-600 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Grid picker */}
              {avatarMode === 'grid' && (
                <div className="grid grid-cols-8 gap-2">
                  {EMOJI_OPTIONS.map(e => (
                    <button
                      key={e}
                      onClick={() => { setEmoji(e); setCustomImage(null); }}
                      className={`text-2xl p-2 rounded-xl transition-all ${
                        e === emoji && !customImage ? 'bg-purple-600 scale-110' : 'bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              )}

              {/* Type your own emoji */}
              {avatarMode === 'type' && (
                <div className="space-y-2">
                  <p className="text-xs text-slate-500">
                    Type or paste any emoji! On most devices, press the emoji key on your keyboard (Win + . on Windows, Ctrl + Cmd + Space on Mac, or tap the emoji button on mobile).
                  </p>
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={emoji}
                      onChange={e => {
                        const val = e.target.value;
                        if (val) {
                          // Take the last emoji/character entered
                          const segments = [...new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(val)];
                          const lastSegment = segments[segments.length - 1];
                          if (lastSegment) {
                            setEmoji(lastSegment.segment);
                            setCustomImage(null);
                          }
                        }
                      }}
                      className="w-24 h-20 text-5xl text-center bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-purple-500"
                    />
                    <div className="flex-1 text-sm text-slate-400">
                      <p className="font-medium text-white mb-1">Your emoji: <span className="text-3xl">{emoji}</span></p>
                      <p>Type, paste, or use your device&apos;s emoji picker!</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Photo upload */}
              {avatarMode === 'photo' && (
                <div className="space-y-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  {customImage ? (
                    <div className="text-center space-y-3">
                      <img
                        src={customImage}
                        alt="Buddy photo"
                        className="w-24 h-24 rounded-full object-cover mx-auto border-4 border-purple-500"
                      />
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="px-4 py-2 rounded-xl text-sm font-bold bg-white/10 hover:bg-white/20 transition-all"
                        >
                          📷 Change Photo
                        </button>
                        <button
                          onClick={() => { setCustomImage(null); setAvatarMode('grid'); }}
                          className="px-4 py-2 rounded-xl text-sm font-bold bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all"
                        >
                          ✕ Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full py-8 rounded-2xl border-2 border-dashed border-white/20 hover:border-purple-500 hover:bg-white/5 transition-all text-center"
                    >
                      <span className="text-4xl block mb-2">📷</span>
                      <p className="font-bold">Upload a Photo</p>
                      <p className="text-xs text-slate-500 mt-1">JPG, PNG, or any image — it&apos;ll be cropped to a circle</p>
                    </button>
                  )}
                </div>
              )}
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!name.trim()}
              className="w-full py-3 rounded-xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Next → Personality
            </button>
          </div>
        )}

        {/* Step 2: Personality & Color */}
        {step === 2 && (
          <div className="space-y-4 animate-slide-up">
            <h2 className="text-lg font-bold">Step 2: Personality</h2>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Pick a Personality Template</label>
              <div className="grid grid-cols-2 gap-2 mb-3">
                {PERSONALITY_TEMPLATES.map(p => (
                  <button
                    key={p.label}
                    onClick={() => setPersonality(p.desc)}
                    className={`p-3 rounded-xl text-left text-sm transition-all ${
                      personality === p.desc
                        ? 'bg-purple-600 border-purple-400'
                        : 'bg-white/5 hover:bg-white/10'
                    } border border-white/10`}
                  >
                    <span className="font-bold block">{p.label}</span>
                    <span className="text-xs text-slate-400">{p.desc.slice(0, 40)}...</span>
                  </button>
                ))}
              </div>
              <p className="text-xs text-slate-500 mb-1">Or write your own:</p>
              <input
                type="text"
                value={personality}
                onChange={e => setPersonality(e.target.value.slice(0, 60))}
                placeholder="e.g. Brave and adventurous!"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500"
                maxLength={60}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Choose a Color</label>
              <div className="grid grid-cols-6 gap-2">
                {COLOR_OPTIONS.map((c, i) => (
                  <button
                    key={c.name}
                    onClick={() => setColorIdx(i)}
                    className={`w-full aspect-square rounded-xl transition-all ${
                      i === colorIdx ? 'ring-2 ring-white scale-110' : 'hover:scale-105'
                    }`}
                    style={{ backgroundColor: c.value }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <button onClick={() => setStep(1)} className="flex-1 py-3 rounded-xl font-bold bg-white/10 hover:bg-white/20 transition-all">
                ← Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!personality.trim()}
                className="flex-1 py-3 rounded-xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Next → Greeting
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Greeting & Custom Phrases */}
        {step === 3 && (
          <div className="space-y-4 animate-slide-up">
            <h2 className="text-lg font-bold">Step 3: What Does {name} Say?</h2>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Greeting Message</label>
              <input
                type="text"
                value={greeting}
                onChange={e => setGreeting(e.target.value.slice(0, 80))}
                placeholder={`e.g. Hey there! ${emoji} Let's learn together!`}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500"
                maxLength={80}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">When asking a question (optional)</label>
              <input
                type="text"
                value={customPhrases.ask}
                onChange={e => setCustomPhrases(p => ({ ...p, ask: e.target.value.slice(0, 60) }))}
                placeholder="e.g. Ooh ooh, try this one!"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500"
                maxLength={60}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">When you get it right (optional)</label>
              <input
                type="text"
                value={customPhrases.correct}
                onChange={e => setCustomPhrases(p => ({ ...p, correct: e.target.value.slice(0, 60) }))}
                placeholder="e.g. AMAZING! You're so smart!"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500"
                maxLength={60}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">When you get it wrong (optional)</label>
              <input
                type="text"
                value={customPhrases.wrong}
                onChange={e => setCustomPhrases(p => ({ ...p, wrong: e.target.value.slice(0, 60) }))}
                placeholder="e.g. Don't worry, try again!"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500"
                maxLength={60}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Encouragement (optional)</label>
              <input
                type="text"
                value={customPhrases.encourage}
                onChange={e => setCustomPhrases(p => ({ ...p, encourage: e.target.value.slice(0, 60) }))}
                placeholder="e.g. You're doing great!"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500"
                maxLength={60}
              />
            </div>

            <div className="flex gap-2">
              <button onClick={() => setStep(2)} className="flex-1 py-3 rounded-xl font-bold bg-white/10 hover:bg-white/20 transition-all">
                ← Back
              </button>
              <button
                onClick={() => setStep(4)}
                className="flex-1 py-3 rounded-xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Next → Preview
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Preview & Create */}
        {step === 4 && (
          <div className="space-y-4 animate-slide-up">
            <h2 className="text-lg font-bold">Step 4: Preview Your Buddy!</h2>

            <div
              className="rounded-2xl p-6 border border-white/10"
              style={{ background: `linear-gradient(135deg, ${selectedColor.value}15, ${selectedColor.value}05)` }}
            >
              <div className="text-center mb-4">
                <BuddyAvatar buddy={previewBuddy} size="xl" className="animate-bounce-in" />
                <h3 className="text-2xl font-bold mt-3">{name}</h3>
                <p className="text-slate-400 text-sm">{personality}</p>
              </div>

              <div className="space-y-3 text-sm">
                <div className="bg-white/5 rounded-xl p-3">
                  <p className="text-slate-400 text-xs mb-1">💬 Greeting:</p>
                  <p>&ldquo;{greeting || `Hey there! ${emoji} ${name} is ready to learn with you!`}&rdquo;</p>
                </div>
                <div className="bg-white/5 rounded-xl p-3">
                  <p className="text-slate-400 text-xs mb-1">❓ Asks questions like:</p>
                  <p>&ldquo;{customPhrases.ask || `${emoji} Ooh, try this one!`}&rdquo;</p>
                </div>
                <div className="bg-white/5 rounded-xl p-3">
                  <p className="text-slate-400 text-xs mb-1">✅ When you're right:</p>
                  <p>&ldquo;{customPhrases.correct || `YES! Amazing answer! ${emoji}🎉`}&rdquo;</p>
                </div>
                <div className="bg-white/5 rounded-xl p-3">
                  <p className="text-slate-400 text-xs mb-1">❌ When you're wrong:</p>
                  <p>&ldquo;{customPhrases.wrong || `Oops! Don't worry, try again! ${emoji}💕`}&rdquo;</p>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button onClick={() => setStep(3)} className="flex-1 py-3 rounded-xl font-bold bg-white/10 hover:bg-white/20 transition-all">
                ← Back
              </button>
              <button
                onClick={handleCreate}
                className="flex-1 py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-pink-500 to-purple-600 hover:scale-[1.02] active:scale-[0.98] transition-all animate-pulse-glow"
              >
                Create {customImage ? '📸' : emoji} {name}!
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
