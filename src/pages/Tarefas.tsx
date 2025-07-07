
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useTasks, Task } from '@/hooks/useTasks';
import LoginForm from '@/components/auth/LoginForm';
import Header from '@/components/dashboard/Header';
import TopNavigation from '@/components/dashboard/TopNavigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, CheckCircle2, Clock, AlertTriangle, Trash2, Edit } from 'lucide-react';
import { toast } from 'sonner';

const Tarefas = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { tasks, loading, addTask, toggleTask, deleteTask, updateTask } = useTasks();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'media' as Task['priority']
  });

  if (authLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newTask.title.trim()) {
      toast.error('Por favor, insira um título para a tarefa');
      return;
    }

    if (editingTask) {
      updateTask(editingTask.id, newTask.title, newTask.description, newTask.priority);
      toast.success('Tarefa atualizada com sucesso!');
      setEditingTask(null);
    } else {
      addTask(newTask.title, newTask.description, newTask.priority);
      toast.success('Tarefa adicionada com sucesso!');
    }

    setNewTask({ title: '', description: '', priority: 'media' });
    setIsDialogOpen(false);
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'baixa': return 'bg-green-600';
      case 'media': return 'bg-yellow-600';
      case 'urgente': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  const getPriorityIcon = (priority: Task['priority']) => {
    switch (priority) {
      case 'baixa': return <CheckCircle2 className="h-4 w-4" />;
      case 'media': return <Clock className="h-4 w-4" />;
      case 'urgente': return <AlertTriangle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const pendingTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  const openEditDialog = (task: Task) => {
    setEditingTask(task);
    setNewTask({
      title: task.title,
      description: task.description,
      priority: task.priority
    });
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingTask(null);
    setNewTask({ title: '', description: '', priority: 'media' });
  };

  return (
    <div className="dark min-h-screen bg-black">
      <Header />
      <TopNavigation />
      
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">Tarefas do Dia</h1>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Nova Tarefa
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-slate-700 text-white">
              <DialogHeader>
                <DialogTitle>{editingTask ? 'Editar Tarefa' : 'Nova Tarefa'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Título</label>
                  <Input
                    value={newTask.title}
                    onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                    className="bg-slate-800 border-slate-600 text-white"
                    placeholder="Digite o título da tarefa"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Descrição</label>
                  <Textarea
                    value={newTask.description}
                    onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                    className="bg-slate-800 border-slate-600 text-white"
                    placeholder="Digite a descrição da tarefa"
                    rows={3}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Prioridade</label>
                  <Select value={newTask.priority} onValueChange={(value: Task['priority']) => setNewTask(prev => ({ ...prev, priority: value }))}>
                    <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      <SelectItem value="baixa">Baixa</SelectItem>
                      <SelectItem value="media">Média</SelectItem>
                      <SelectItem value="urgente">Urgente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex space-x-2">
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white" disabled={loading}>
                    {editingTask ? 'Atualizar' : 'Adicionar'} Tarefa
                  </Button>
                  <Button type="button" variant="outline" onClick={closeDialog} className="border-slate-600 text-slate-300">
                    Cancelar
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Tarefas Pendentes */}
          <Card className="bg-slate-900/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Pendentes ({pendingTasks.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {pendingTasks.length === 0 ? (
                <p className="text-slate-400 text-center py-8">Nenhuma tarefa pendente</p>
              ) : (
                pendingTasks.map((task) => (
                  <div key={task.id} className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <Checkbox
                          checked={task.completed}
                          onCheckedChange={() => toggleTask(task.id)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-white">{task.title}</h3>
                          {task.description && (
                            <p className="text-slate-400 text-sm mt-1">{task.description}</p>
                          )}
                          <div className="flex items-center space-x-2 mt-2">
                            <Badge className={`${getPriorityColor(task.priority)} text-white`}>
                              {getPriorityIcon(task.priority)}
                              <span className="ml-1 capitalize">{task.priority}</span>
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openEditDialog(task)}
                          className="text-slate-400 hover:text-white"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteTask(task.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Tarefas Concluídas */}
          <Card className="bg-slate-900/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <CheckCircle2 className="h-5 w-5" />
                <span>Concluídas ({completedTasks.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {completedTasks.length === 0 ? (
                <p className="text-slate-400 text-center py-8">Nenhuma tarefa concluída</p>
              ) : (
                completedTasks.map((task) => (
                  <div key={task.id} className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 opacity-60">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <Checkbox
                          checked={task.completed}
                          onCheckedChange={() => toggleTask(task.id)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-white line-through">{task.title}</h3>
                          {task.description && (
                            <p className="text-slate-400 text-sm mt-1 line-through">{task.description}</p>
                          )}
                          <div className="flex items-center space-x-2 mt-2">
                            <Badge className={`${getPriorityColor(task.priority)} text-white`}>
                              {getPriorityIcon(task.priority)}
                              <span className="ml-1 capitalize">{task.priority}</span>
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteTask(task.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Tarefas;
