
import { useState, useEffect } from 'react';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'baixa' | 'media' | 'urgente';
  completed: boolean;
  createdAt: string;
  completedAt?: string;
}

const STORAGE_KEY = 'nexum-tasks';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);

  // Load tasks from localStorage
  useEffect(() => {
    try {
      const savedTasks = localStorage.getItem(STORAGE_KEY);
      if (savedTasks) {
        setTasks(JSON.parse(savedTasks));
      }
    } catch (error) {
      console.error('Erro ao carregar tarefas:', error);
    }
  }, []);

  // Save tasks to localStorage
  const saveTasks = (updatedTasks: Task[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTasks));
      setTasks(updatedTasks);
    } catch (error) {
      console.error('Erro ao salvar tarefas:', error);
    }
  };

  // Add new task
  const addTask = (title: string, description: string, priority: Task['priority']) => {
    setLoading(true);
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      description,
      priority,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    const updatedTasks = [...tasks, newTask];
    saveTasks(updatedTasks);
    setLoading(false);
    return newTask;
  };

  // Toggle task completion
  const toggleTask = (id: string) => {
    const updatedTasks = tasks.map(task =>
      task.id === id
        ? { 
            ...task, 
            completed: !task.completed,
            completedAt: !task.completed ? new Date().toISOString() : undefined
          }
        : task
    );
    saveTasks(updatedTasks);
  };

  // Delete task
  const deleteTask = (id: string) => {
    const updatedTasks = tasks.filter(task => task.id !== id);
    saveTasks(updatedTasks);
  };

  // Update task
  const updateTask = (id: string, title: string, description: string, priority: Task['priority']) => {
    const updatedTasks = tasks.map(task =>
      task.id === id
        ? { ...task, title, description, priority }
        : task
    );
    saveTasks(updatedTasks);
  };

  return {
    tasks,
    loading,
    addTask,
    toggleTask,
    deleteTask,
    updateTask,
  };
};
