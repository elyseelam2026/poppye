'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { UploadedMaterial, AIGeneratedContent, RevisionPlan } from './types';

interface MaterialsState {
  materials: UploadedMaterial[];
  generatedContent: AIGeneratedContent[];
  revisionPlans: RevisionPlan[];
  apiKey: string;
}

const DEFAULT_STATE: MaterialsState = {
  materials: [],
  generatedContent: [],
  revisionPlans: [],
  apiKey: '',
};

type Action =
  | { type: 'LOAD_STATE'; payload: MaterialsState }
  | { type: 'ADD_MATERIAL'; payload: UploadedMaterial }
  | { type: 'REMOVE_MATERIAL'; payload: string }
  | { type: 'MARK_PROCESSED'; payload: string }
  | { type: 'ADD_GENERATED_CONTENT'; payload: AIGeneratedContent }
  | { type: 'ADD_REVISION_PLAN'; payload: RevisionPlan }
  | { type: 'SET_API_KEY'; payload: string }
  | { type: 'CLEAR_ALL' };

function materialsReducer(state: MaterialsState, action: Action): MaterialsState {
  switch (action.type) {
    case 'LOAD_STATE':
      return action.payload;
    case 'ADD_MATERIAL':
      return { ...state, materials: [...state.materials, action.payload] };
    case 'REMOVE_MATERIAL':
      return {
        ...state,
        materials: state.materials.filter(m => m.id !== action.payload),
        generatedContent: state.generatedContent.filter(c => c.materialId !== action.payload),
      };
    case 'MARK_PROCESSED':
      return {
        ...state,
        materials: state.materials.map(m =>
          m.id === action.payload ? { ...m, processed: true } : m
        ),
      };
    case 'ADD_GENERATED_CONTENT':
      return { ...state, generatedContent: [...state.generatedContent, action.payload] };
    case 'ADD_REVISION_PLAN':
      return { ...state, revisionPlans: [...state.revisionPlans, action.payload] };
    case 'SET_API_KEY':
      return { ...state, apiKey: action.payload };
    case 'CLEAR_ALL':
      return { ...DEFAULT_STATE, apiKey: state.apiKey };
    default:
      return state;
  }
}

const MaterialsContext = createContext<{
  state: MaterialsState;
  dispatch: React.Dispatch<Action>;
}>({
  state: DEFAULT_STATE,
  dispatch: () => {},
});

export function MaterialsProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(materialsReducer, DEFAULT_STATE);

  useEffect(() => {
    const saved = localStorage.getItem('poppye-materials');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        dispatch({ type: 'LOAD_STATE', payload: { ...DEFAULT_STATE, ...parsed } });
      } catch {
        // ignore corrupt data
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('poppye-materials', JSON.stringify(state));
  }, [state]);

  return (
    <MaterialsContext.Provider value={{ state, dispatch }}>
      {children}
    </MaterialsContext.Provider>
  );
}

export function useMaterials() {
  return useContext(MaterialsContext);
}
