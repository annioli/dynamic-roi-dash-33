import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Lock, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import RegisterForm from './RegisterForm';
import PlanSelectionModal from './PlanSelectionModal';
import TrialExpiredModal from './TrialExpiredModal';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showPlanSelection, setShowPlanSelection] = useState(false);
  const [registeredUsername, setRegisteredUsername] = useState('');
  
  const { login, trialExpired, setUserSubscribed } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate loading for better UX
    await new Promise(resolve => setTimeout(resolve, 800));

    const success = login(username, password);
    
    if (!success) {
      toast({
        title: "Erro de Autenticação",
        description: "Usuário/e-mail ou senha incorretos.",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };

  const handleRegisterSuccess = (username: string) => {
    setRegisteredUsername(username);
    setShowRegister(false);
    setShowPlanSelection(true);
  };

  const handlePlanSelection = (planType: 'trial' | 'subscription') => {
    const registeredUsers = JSON.parse(localStorage.getItem('nexum-registered-users') || '[]');
    const userIndex = registeredUsers.findIndex((u: any) => u.username === registeredUsername);
    
    if (userIndex !== -1) {
      if (planType === 'trial') {
        registeredUsers[userIndex].userType = 'trial';
        registeredUsers[userIndex].trialStartDate = new Date().toISOString();
        localStorage.setItem('nexum-trial-start', registeredUsers[userIndex].trialStartDate);
      } else {
        registeredUsers[userIndex].userType = 'admin';
      }
      
      localStorage.setItem('nexum-registered-users', JSON.stringify(registeredUsers));
      localStorage.setItem('nexum-auth', 'authenticated');
      localStorage.setItem('nexum-user-type', registeredUsers[userIndex].userType);
      localStorage.setItem('nexum-current-user', registeredUsername);
      
      setShowPlanSelection(false);
      
      toast({
        title: planType === 'trial' ? "Teste Iniciado!" : "Assinatura Ativada!",
        description: planType === 'trial' ? "Você tem 14 dias de acesso completo." : "Bem-vindo à Nexum Premium!",
      });
      
      // Reload page to trigger auth state update
      window.location.reload();
    }
  };

  const handleSubscribe = () => {
    setUserSubscribed();
    toast({
      title: "Assinatura Ativada!",
      description: "Bem-vindo à Nexum Premium!",
    });
    // Reload page to update auth state
    window.location.reload();
  };

  if (showRegister) {
    return (
      <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
        {/* Background - same as login */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.15),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.15),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(34,197,94,0.1),transparent_50%)]"></div>
        </div>

        {/* Animated floating elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-48 h-48 bg-purple-500/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-1/4 left-1/3 w-24 h-24 bg-green-500/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="w-full max-w-md relative z-10">
          {/* Logo */}
          <div className="text-center mb-8">
            <img 
              src="/lovable-uploads/8d13554a-6df1-4e26-8bb5-2b8ea7687f01.png" 
              alt="Nexum Logo" 
              className="h-24 w-auto mx-auto mb-4 drop-shadow-2xl"
            />
          </div>

          <RegisterForm 
            onBack={() => setShowRegister(false)} 
            onRegisterSuccess={handleRegisterSuccess}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      {/* Modern animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.15),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.15),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(34,197,94,0.1),transparent_50%)]"></div>
      </div>

      {/* Animated floating elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-48 h-48 bg-purple-500/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-24 h-24 bg-green-500/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo Section - Much larger and more prominent */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center mb-8 animate-scale-in">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-lg opacity-50 animate-pulse"></div>
              <img 
                src="/lovable-uploads/8d13554a-6df1-4e26-8bb5-2b8ea7687f01.png" 
                alt="Nexum Logo" 
                className="relative h-32 w-auto drop-shadow-2xl transform hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
          <p className="text-slate-300 text-lg font-light">Faça login para acessar suas métricas</p>
        </div>

        {/* Login Card - More modern design */}
        <Card className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl animate-slide-in-right">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl text-white font-light">Entrar</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username/Email Field */}
              <div className="space-y-2">
                <Label htmlFor="username" className="text-slate-300 font-medium">
                  Usuário ou E-mail
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Digite seu usuário ou e-mail"
                    className="pl-10 bg-white/5 backdrop-blur border-white/20 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-300 font-medium">
                  Senha
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Digite sua senha"
                    className="pl-10 pr-10 bg-white/5 backdrop-blur border-white/20 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors duration-200"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 hover:from-blue-700 hover:via-blue-800 hover:to-purple-800 text-white font-semibold py-3 text-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none border-0"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Entrando...</span>
                  </div>
                ) : (
                  'Entrar'
                )}
              </Button>
            </form>

            {/* Register Button - Updated to match login button style */}
            <div className="mt-6">
              <Button
                onClick={() => setShowRegister(true)}
                className="w-full bg-gradient-to-r from-green-600 via-green-700 to-emerald-700 hover:from-green-700 hover:via-green-800 hover:to-emerald-800 text-white font-semibold py-3 text-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg border-0"
              >
                Não tem conta? Cadastre-se
              </Button>
            </div>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-white/5 backdrop-blur rounded-lg border border-white/10">
              <p className="text-sm text-slate-400 text-center mb-3">Credenciais de demonstração:</p>
              <div className="text-sm text-slate-300 space-y-2">
                <div className="bg-white/5 p-2 rounded border border-white/10">
                  <p><span className="text-slate-400">Conta Teste:</span></p>
                  <p><span className="text-blue-400">Usuário:</span> Teste</p>
                  <p><span className="text-blue-400">Senha:</span> teste123</p>
                </div>
                <div className="bg-white/5 p-2 rounded border border-white/10">
                  <p><span className="text-slate-400">Conta Admin:</span></p>
                  <p><span className="text-green-400">Usuário:</span> Admin</p>
                  <p><span className="text-green-400">Senha:</span> Admin123</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 animate-fade-in">
          <p className="text-slate-500 text-sm">
            © 2025 Nexum. Todos os direitos reservados.
          </p>
        </div>
      </div>

      {/* Modals */}
      <PlanSelectionModal
        open={showPlanSelection}
        onClose={() => setShowPlanSelection(false)}
        onSelectPlan={handlePlanSelection}
        username={registeredUsername}
      />

      <TrialExpiredModal
        open={trialExpired}
        onSubscribe={handleSubscribe}
      />
    </div>
  );
};

export default LoginForm;
