'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useMaterials } from '@/lib/materials-context';
import { SUBJECTS, GRADES } from '@/lib/constants';
import type { Subject, Grade } from '@/lib/types';

export default function UploadPage() {
  const { state, dispatch } = useMaterials();
  const [subject, setSubject] = useState<Subject>('maths');
  const [grade, setGrade] = useState<Grade>('P3');
  const [textInput, setTextInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    try {
      let content = '';
      const type = file.type.startsWith('image/') ? 'image' as const : 'text' as const;

      if (type === 'image') {
        content = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      } else {
        content = await file.text();
      }

      const material = {
        id: `mat-${Date.now()}`,
        name: file.name,
        type,
        content,
        subject,
        grade,
        uploadedAt: new Date().toISOString(),
        processed: false,
      };

      dispatch({ type: 'ADD_MATERIAL', payload: material });
      setMessage('✅ Material uploaded! Processing with AI...');
      await processWithAI(material.id, content, type);
    } catch {
      setMessage('❌ Upload failed. Please try again.');
    }
    setUploading(false);
  };

  const handleTextSubmit = async () => {
    if (!textInput.trim()) return;
    setUploading(true);

    const material = {
      id: `mat-${Date.now()}`,
      name: `Text note - ${new Date().toLocaleDateString()}`,
      type: 'text' as const,
      content: textInput,
      subject,
      grade,
      uploadedAt: new Date().toISOString(),
      processed: false,
    };

    dispatch({ type: 'ADD_MATERIAL', payload: material });
    setTextInput('');
    setMessage('✅ Material saved! Processing with AI...');
    await processWithAI(material.id, textInput, 'text');
    setUploading(false);
  };

  const processWithAI = async (materialId: string, content: string, type: string) => {
    if (!state.apiKey) {
      setMessage('⚠️ Set your xAI API key in Settings to enable AI processing.');
      return;
    }

    setProcessing(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, type, subject, grade, apiKey: state.apiKey }),
      });

      if (!res.ok) throw new Error('AI generation failed');

      const data = await res.json();
      dispatch({ type: 'MARK_PROCESSED', payload: materialId });
      dispatch({
        type: 'ADD_GENERATED_CONTENT',
        payload: {
          id: `gen-${Date.now()}`,
          materialId,
          subject,
          grade,
          questions: data.questions || [],
          flashcards: data.flashcards || [],
          scrambleWords: data.scrambleWords || [],
          summary: data.summary || '',
          keyPoints: data.keyPoints || [],
          generatedAt: new Date().toISOString(),
        },
      });
      setMessage('🎉 AI content generated! Go play some games!');
    } catch {
      setMessage('❌ AI processing failed. Check your API key and try again.');
    }
    setProcessing(false);
  };

  return (
    <div className="min-h-screen bg-[#0f0a1e] p-4">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/" className="text-2xl">←</Link>
          <h1 className="text-2xl font-bold">Upload Materials</h1>
        </div>

        {/* Subject & Grade */}
        <div className="bg-white/5 rounded-2xl p-4 mb-4 border border-white/10">
          <label className="block text-sm font-bold mb-2">Subject</label>
          <select
            value={subject}
            onChange={e => setSubject(e.target.value as Subject)}
            className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm mb-3 focus:outline-none focus:border-purple-400"
          >
            {SUBJECTS.map(s => (
              <option key={s.id} value={s.id}>{s.icon} {s.name}</option>
            ))}
          </select>

          <label className="block text-sm font-bold mb-2">Grade</label>
          <div className="flex gap-2">
            {GRADES.map(g => (
              <button
                key={g}
                onClick={() => setGrade(g)}
                className={`px-3 py-1 rounded-full text-sm font-bold ${
                  g === grade ? 'bg-purple-600 text-white' : 'bg-white/5 text-slate-400'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Upload area */}
        <div
          className="bg-white/5 rounded-2xl p-8 mb-4 border-2 border-dashed border-white/20 text-center cursor-pointer hover:border-purple-400/50 transition-all"
          onClick={() => fileInputRef.current?.click()}
          onDragOver={e => e.preventDefault()}
          onDrop={e => {
            e.preventDefault();
            const file = e.dataTransfer.files[0];
            if (file) handleFileUpload(file);
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.txt,.pdf"
            className="hidden"
            onChange={e => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload(file);
            }}
          />
          <span className="text-4xl block mb-3">📸</span>
          <p className="font-bold">Drag & drop or tap to upload</p>
          <p className="text-sm text-slate-400 mt-1">Photos of textbooks, notes, exercises</p>
          <p className="text-xs text-slate-500 mt-2">Powered by xAI Grok 🤖</p>
        </div>

        {/* Text input */}
        <div className="bg-white/5 rounded-2xl p-4 mb-4 border border-white/10">
          <label className="block text-sm font-bold mb-2">📝 Or type/paste text</label>
          <textarea
            value={textInput}
            onChange={e => setTextInput(e.target.value)}
            placeholder="Paste your notes, questions, or study material here..."
            className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm h-32 resize-none focus:outline-none focus:border-purple-400"
          />
          <button
            onClick={handleTextSubmit}
            disabled={!textInput.trim() || uploading}
            className="w-full mt-2 py-2 rounded-xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-600 disabled:opacity-50"
          >
            {uploading ? 'Processing...' : 'Submit Text ✨'}
          </button>
        </div>

        {/* Status message */}
        {message && (
          <div className="bg-white/5 rounded-xl p-3 mb-4 border border-white/10 text-center text-sm animate-slide-up">
            {message}
          </div>
        )}

        {processing && (
          <div className="bg-purple-500/10 rounded-xl p-3 mb-4 border border-purple-400/30 text-center text-sm">
            🤖 xAI Grok is processing your material...
          </div>
        )}

        {!state.apiKey && (
          <Link
            href="/settings"
            className="block bg-yellow-500/10 rounded-xl p-3 mb-4 border border-yellow-400/30 text-center text-sm hover:bg-yellow-500/20"
          >
            ⚠️ Set your xAI API key in Settings to enable AI processing
          </Link>
        )}
      </div>
    </div>
  );
}