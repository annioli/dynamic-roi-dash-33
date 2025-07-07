
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNotes } from '@/hooks/useNotes';
import LoginForm from '@/components/auth/LoginForm';
import Header from '@/components/dashboard/Header';
import TopNavigation from '@/components/dashboard/TopNavigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Anotacoes = () => {
  const { isAuthenticated, loading } = useAuth();
  const { notes, addNote, updateNote, deleteNote } = useNotes();
  const { toast } = useToast();
  
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  const handleSaveNew = () => {
    if (!newContent.trim()) {
      toast({
        title: "Erro",
        description: "O conteúdo da anotação não pode estar vazio.",
        variant: "destructive",
      });
      return;
    }

    addNote(newTitle.trim() || 'Nova Anotação', newContent.trim());
    setNewTitle('');
    setNewContent('');
    setIsCreating(false);
    
    toast({
      title: "Sucesso",
      description: "Anotação criada com sucesso!",
    });
  };

  const handleSaveEdit = (id: string) => {
    if (!newContent.trim()) {
      toast({
        title: "Erro",
        description: "O conteúdo da anotação não pode estar vazio.",
        variant: "destructive",
      });
      return;
    }

    updateNote(id, newTitle.trim() || 'Anotação', newContent.trim());
    setEditingId(null);
    setNewTitle('');
    setNewContent('');
    
    toast({
      title: "Sucesso",
      description: "Anotação atualizada com sucesso!",
    });
  };

  const handleEdit = (note: any) => {
    setEditingId(note.id);
    setNewTitle(note.title);
    setNewContent(note.content);
  };

  const handleDelete = (id: string) => {
    deleteNote(id);
    toast({
      title: "Sucesso",
      description: "Anotação excluída com sucesso!",
    });
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingId(null);
    setNewTitle('');
    setNewContent('');
  };

  return (
    <div className="dark min-h-screen bg-black">
      <Header />
      <TopNavigation />
      
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Minhas Anotações</h1>
          <p className="text-slate-400">Organize suas ideias e observações importantes</p>
        </div>

        {/* Botão para criar nova anotação */}
        <div className="mb-6">
          {!isCreating && (
            <Button
              onClick={() => setIsCreating(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nova Anotação
            </Button>
          )}
        </div>

        {/* Formulário para nova anotação */}
        {isCreating && (
          <Card className="mb-6 bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Nova Anotação</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Título da anotação"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="bg-slate-900/50 border-slate-600 text-white"
              />
              <Textarea
                placeholder="Escreva sua anotação aqui..."
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                rows={4}
                className="bg-slate-900/50 border-slate-600 text-white resize-none"
              />
              <div className="flex space-x-2">
                <Button onClick={handleSaveNew} className="bg-green-600 hover:bg-green-700">
                  <Save className="h-4 w-4 mr-2" />
                  Salvar
                </Button>
                <Button onClick={handleCancel} variant="outline" className="border-slate-600 text-slate-300">
                  <X className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Lista de anotações */}
        <div className="grid gap-4">
          {notes.length === 0 ? (
            <Card className="bg-slate-800/30 border-slate-700">
              <CardContent className="p-8 text-center">
                <p className="text-slate-400 text-lg">Nenhuma anotação encontrada</p>
                <p className="text-slate-500 mt-2">Clique em "Nova Anotação" para começar</p>
              </CardContent>
            </Card>
          ) : (
            notes.map((note) => (
              <Card key={note.id} className="bg-slate-800/30 border-slate-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  {editingId === note.id ? (
                    <Input
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="bg-slate-900/50 border-slate-600 text-white flex-1 mr-4"
                    />
                  ) : (
                    <CardTitle className="text-white text-lg">{note.title}</CardTitle>
                  )}
                  
                  <div className="flex space-x-2">
                    {editingId === note.id ? (
                      <>
                        <Button
                          onClick={() => handleSaveEdit(note.id)}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Save className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={handleCancel}
                          size="sm"
                          variant="outline"
                          className="border-slate-600 text-slate-300"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          onClick={() => handleEdit(note)}
                          size="sm"
                          variant="outline"
                          className="border-slate-600 text-slate-300 hover:bg-slate-700"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() => handleDelete(note.id)}
                          size="sm"
                          variant="outline"
                          className="border-red-600 text-red-400 hover:bg-red-600/20"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {editingId === note.id ? (
                    <Textarea
                      value={newContent}
                      onChange={(e) => setNewContent(e.target.value)}
                      rows={4}
                      className="bg-slate-900/50 border-slate-600 text-white resize-none"
                    />
                  ) : (
                    <div>
                      <p className="text-slate-300 whitespace-pre-wrap">{note.content}</p>
                      <div className="mt-4 text-xs text-slate-500">
                        <p>Criado em: {new Date(note.createdAt).toLocaleString('pt-BR')}</p>
                        {note.updatedAt !== note.createdAt && (
                          <p>Atualizado em: {new Date(note.updatedAt).toLocaleString('pt-BR')}</p>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Anotacoes;
