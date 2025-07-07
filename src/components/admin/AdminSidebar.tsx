
import React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from '@/components/ui/sidebar';
import { Users, BarChart3, Settings, Shield, Crown, Sparkles, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const menuItems = [
  {
    title: "Usuários",
    url: "users",
    icon: Users,
    description: "Gerenciar usuários cadastrados",
    color: "from-blue-500 to-cyan-500"
  },
  {
    title: "Estatísticas",
    url: "stats",
    icon: BarChart3,
    description: "Visualizar métricas do sistema",
    color: "from-green-500 to-emerald-500"
  },
  {
    title: "ROI dos Usuários",
    url: "roi",
    icon: Shield,
    description: "Monitorar ROI em tempo real",
    color: "from-purple-500 to-pink-500"
  },
  {
    title: "Configurações",
    url: "settings",
    icon: Settings,
    description: "Configurações do sistema",
    color: "from-orange-500 to-red-500"
  }
];

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeTab, onTabChange }) => {
  const { state } = useSidebar();
  const { logout } = useAuth();
  const isCollapsed = state === 'collapsed';

  const handleLogout = () => {
    logout();
  };

  return (
    <Sidebar className="bg-slate-950 border-r border-slate-700/50">
      <SidebarHeader className="border-b border-slate-700/50 p-6 bg-slate-950">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full blur-sm opacity-60"></div>
            <div className="relative bg-gradient-to-r from-purple-600 to-blue-600 p-2.5 rounded-full">
              <Crown className="h-5 w-5 text-white" />
            </div>
          </div>
          {!isCollapsed && (
            <div>
              <h2 className="text-lg font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                Admin Panel
              </h2>
              <div className="flex items-center space-x-1 mt-1">
                <Sparkles className="h-3 w-3 text-purple-400" />
                <p className="text-xs text-slate-400 font-medium">Sistema Nexum</p>
              </div>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="p-4 bg-slate-950">
        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-300 font-semibold text-xs uppercase tracking-wider mb-4 px-2">
            {!isCollapsed && "NAVEGAÇÃO"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    onClick={() => onTabChange(item.url)}
                    isActive={activeTab === item.url}
                    className={`w-full justify-start group relative overflow-hidden transition-all duration-300 rounded-xl p-4 ${
                      activeTab === item.url
                        ? 'bg-gradient-to-r from-blue-600/90 to-blue-500/90 text-white shadow-lg shadow-blue-500/20 border border-blue-400/30'
                        : 'text-slate-300 hover:bg-slate-800/70 hover:text-white border border-transparent hover:border-slate-600/50'
                    }`}
                    tooltip={isCollapsed ? item.title : undefined}
                  >
                    {/* Icon container */}
                    <div className={`relative p-2.5 rounded-lg transition-all duration-300 ${
                      activeTab === item.url 
                        ? 'bg-white/20 backdrop-blur-sm shadow-md' 
                        : 'bg-slate-700/50 group-hover:bg-slate-600/70'
                    }`}>
                      <item.icon className={`h-5 w-5 transition-colors duration-300 ${
                        activeTab === item.url ? 'text-white' : 'text-slate-300 group-hover:text-white'
                      }`} />
                    </div>
                    
                    {/* Text content */}
                    {!isCollapsed && (
                      <div className="flex-1 ml-4">
                        <div className={`font-semibold text-sm transition-colors duration-300 ${
                          activeTab === item.url ? 'text-white' : 'text-slate-300 group-hover:text-white'
                        }`}>
                          {item.title}
                        </div>
                        <div className={`text-xs mt-1 font-medium leading-tight transition-colors duration-300 ${
                          activeTab === item.url ? 'text-blue-100' : 'text-slate-400 group-hover:text-slate-300'
                        }`}>
                          {item.description}
                        </div>
                      </div>
                    )}

                    {/* Active indicator */}
                    {activeTab === item.url && (
                      <div className="absolute right-3 w-2 h-2 bg-white/80 rounded-full animate-pulse shadow-lg"></div>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Logout button */}
        <div className="mt-4 border-t border-slate-700/50 pt-4">
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              className="w-full justify-start group relative overflow-hidden transition-all duration-300 rounded-xl p-4 text-red-400 hover:bg-red-900/30 hover:text-red-300 border border-transparent hover:border-red-600/50"
              tooltip={isCollapsed ? "Sair" : undefined}
            >
              {/* Icon container */}
              <div className="relative p-2.5 rounded-lg transition-all duration-300 bg-red-800/30 group-hover:bg-red-700/50">
                <LogOut className="h-5 w-5 transition-colors duration-300 text-red-400 group-hover:text-red-300" />
              </div>
              
              {/* Text content */}
              {!isCollapsed && (
                <div className="flex-1 ml-4">
                  <div className="font-semibold text-sm transition-colors duration-300 text-red-400 group-hover:text-red-300">
                    Sair
                  </div>
                  <div className="text-xs mt-1 font-medium leading-tight transition-colors duration-300 text-red-500/70 group-hover:text-red-400/80">
                    Fazer logout do sistema
                  </div>
                </div>
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </div>

        {/* System status footer */}
        {!isCollapsed && (
          <div className="mt-auto pt-6 border-t border-slate-700/50">
            <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
                <span className="text-xs font-semibold text-slate-200">Sistema Ativo</span>
              </div>
              <p className="text-xs text-slate-400">
                Todas as funcionalidades operacionais
              </p>
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
};
