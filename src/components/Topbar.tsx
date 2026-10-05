import React from 'react';
import { Database, Code2, Plus, Menu } from 'lucide-react';
import { ActivePage } from './Sidebar';

interface TopbarProps {
  activePage: ActivePage;
  onNavigate: (page: ActivePage) => void;
  onOpenSqlConsole: () => void;
  onOpenPythonCode: () => void;
  onToggleMobileMenu?: () => void;
  studentCount: number;
}

const PAGE_TITLES: Record<ActivePage, { title: string; category: string }> = {
  dashboard: { title: 'Academic Dashboard', category: 'Overview' },
  students: { title: 'Student Records Directory', category: 'Database Records' },
  add_student: { title: 'New Student Registration', category: 'Record Entry' },
  profile: { title: 'Student Academic Profile', category: 'Detailed View' },
  edit_student: { title: 'Edit Student Information', category: 'Record Modification' },
  search: { title: 'Search Algorithms Lab', category: 'DSA Demonstration' },
  sorting: { title: 'Sorting Algorithms Lab', category: 'DSA Demonstration' },
  dsa: { title: 'Singly Linked List Visualizer', category: 'DSA Data Structure' },
  complexity: { title: 'Algorithm Complexity Matrix', category: 'Theory & Analysis' },
  reports: { title: 'Academic Reports & Analytics', category: 'Export & Insights' },
  about: { title: 'Project Overview & Viva Guide', category: 'Documentation' }
};

export const Topbar: React.FC<TopbarProps> = ({
  activePage,
  onNavigate,
  onOpenSqlConsole,
  onOpenPythonCode,
  onToggleMobileMenu,
  studentCount
}) => {
  const current = PAGE_TITLES[activePage] || { title: 'Student Management', category: 'System' };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 sticky top-0 z-30">
      {/* Zone 1: Contextual Breadcrumb & Title */}
      <div className="flex items-center gap-3">
        {onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <span>Student Management</span>
            <span>/</span>
            <span className="text-slate-700">{current.category}</span>
          </div>
          <h2 className="text-sm font-bold text-slate-900 leading-tight">
            {current.title}
          </h2>
        </div>
      </div>

      {/* Zone 2: Informative Status (clean unboxed metadata) */}
      <div className="hidden lg:flex items-center gap-3 text-xs text-slate-600 font-mono">
        <span>SQLite: Connected</span>
        <span aria-hidden="true">·</span>
        <span>Table: students ({studentCount} rows)</span>
        <span aria-hidden="true">·</span>
        <span>DSA: Manual Engines</span>
      </div>

      {/* Zone 3: Quick Action Affordances */}
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenSqlConsole}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors whitespace-nowrap"
          title="Inspect SQLite Schema and Real SQL Logs"
        >
          <Database className="w-3.5 h-3.5 text-emerald-600" />
          <span className="hidden sm:inline">SQLite Console</span>
        </button>

        <button
          onClick={onOpenPythonCode}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors whitespace-nowrap"
          title="Inspect Python Flask and DSA Backend Files"
        >
          <Code2 className="w-3.5 h-3.5 text-amber-600" />
          <span className="hidden sm:inline">Python Files</span>
        </button>

        {activePage !== 'add_student' && (
          <button
            onClick={() => onNavigate('add_student')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-sky-600 rounded-lg hover:bg-sky-700 transition-colors shadow-xs whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Student</span>
          </button>
        )}
      </div>
    </header>
  );
};
