import React from 'react';
import {
  LayoutDashboard,
  Users,
  UserPlus,
  Search,
  ArrowUpDown,
  Network,
  TableProperties,
  BarChart3,
  BookOpen,
  LogOut,
  Database,
  GraduationCap,
  Code2
} from 'lucide-react';

export type ActivePage =
  | 'dashboard'
  | 'students'
  | 'add_student'
  | 'search'
  | 'sorting'
  | 'dsa'
  | 'complexity'
  | 'reports'
  | 'about'
  | 'profile'
  | 'edit_student';

interface SidebarProps {
  activePage: ActivePage;
  onNavigate: (page: ActivePage) => void;
  onLogout: () => void;
  onOpenSqlConsole: () => void;
  onOpenPythonCode: () => void;
  studentCount: number;
  userName?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activePage,
  onNavigate,
  onLogout,
  onOpenSqlConsole,
  onOpenPythonCode,
  studentCount,
  userName = 'Vicky'
}) => {
  const navItems = [
    { id: 'dashboard' as ActivePage, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'students' as ActivePage, label: 'Student Records', icon: Users, badge: studentCount },
    { id: 'add_student' as ActivePage, label: 'Add Student', icon: UserPlus },
    { id: 'search' as ActivePage, label: 'Search System', icon: Search, hint: 'Linear / Binary' },
    { id: 'sorting' as ActivePage, label: 'Sorting System', icon: ArrowUpDown, hint: 'Bubble / Merge' },
    { id: 'dsa' as ActivePage, label: 'DSA Lab (Linked List)', icon: Network, hint: 'Node Pointers' },
    { id: 'complexity' as ActivePage, label: 'Complexity Matrix', icon: TableProperties },
    { id: 'reports' as ActivePage, label: 'Reports & Analytics', icon: BarChart3 },
    { id: 'about' as ActivePage, label: 'About & Viva Guide', icon: BookOpen }
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 border-r border-slate-800 select-none min-h-screen">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-sky-600 flex items-center justify-center text-white shadow-md">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-sm tracking-tight text-white leading-tight">
              Student Records
            </h1>
            <p className="text-[11px] text-sky-400 font-mono">DSA Capstone System</p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
          Management & DSA
        </p>

        {navItems.map(item => {
          const Icon = item.icon;
          const isActive =
            activePage === item.id ||
            (item.id === 'students' && (activePage === 'profile' || activePage === 'edit_student'));

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>

              {item.badge !== undefined && (
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                  isActive ? 'bg-sky-700 text-white' : 'bg-slate-800 text-slate-400'
                }`}>
                  {item.badge}
                </span>
              )}

              {item.hint && !item.badge && (
                <span className={`text-[9px] font-mono ${isActive ? 'text-sky-100' : 'text-slate-400'}`}>
                  {item.hint}
                </span>
              )}
            </button>
          );
        })}

        <div className="pt-4 mt-4 border-t border-slate-800/80 space-y-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
            Viva Evaluator Tools
          </p>

          <button
            onClick={onOpenSqlConsole}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors"
          >
            <Database className="w-4 h-4 text-emerald-400" />
            <span className="flex-1 text-left">SQLite Console & Schema</span>
          </button>

          <button
            onClick={onOpenPythonCode}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors"
          >
            <Code2 className="w-4 h-4 text-amber-400" />
            <span className="flex-1 text-left">Python Flask Source Code</span>
          </button>
        </div>
      </div>

      {/* Footer / Account / Logout */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/40">
        <div className="flex items-center justify-between px-2 py-1.5">
          <div className="min-w-0">
            <p className="text-xs font-semibold text-white truncate">{userName} (Admin)</p>
            <p className="text-[10px] text-sky-400 truncate">SQLite Session Active</p>
          </div>
          <button
            onClick={onLogout}
            title="Sign Out"
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-md transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
