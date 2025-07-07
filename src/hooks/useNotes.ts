
import { useState, useEffect } from 'react';

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = 'nexum-notes';

export const useNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);

  // Load notes from localStorage
  useEffect(() => {
    try {
      const savedNotes = localStorage.getItem(STORAGE_KEY);
      if (savedNotes) {
        setNotes(JSON.parse(savedNotes));
      }
    } catch (error) {
      console.error('Erro ao carregar anotações:', error);
    }
  }, []);

  // Save notes to localStorage
  const saveNotes = (updatedNotes: Note[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNotes));
      setNotes(updatedNotes);
    } catch (error) {
      console.error('Erro ao salvar anotações:', error);
    }
  };

  // Add new note
  const addNote = (title: string, content: string) => {
    setLoading(true);
    const newNote: Note = {
      id: Date.now().toString(),
      title: title || 'Nova Anotação',
      content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedNotes = [...notes, newNote];
    saveNotes(updatedNotes);
    setLoading(false);
    return newNote;
  };

  // Update existing note
  const updateNote = (id: string, title: string, content: string) => {
    setLoading(true);
    const updatedNotes = notes.map(note =>
      note.id === id
        ? { ...note, title, content, updatedAt: new Date().toISOString() }
        : note
    );
    saveNotes(updatedNotes);
    setLoading(false);
  };

  // Delete note
  const deleteNote = (id: string) => {
    const updatedNotes = notes.filter(note => note.id !== id);
    saveNotes(updatedNotes);
  };

  return {
    notes,
    loading,
    addNote,
    updateNote,
    deleteNote,
  };
};
