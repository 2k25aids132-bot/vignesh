import React, { useState, useEffect } from 'react';
import { sqliteDb } from './db/sqliteSimulation';
import { StudentRecord } from './types/student';
import { ActivePage, Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { ToastContainer, ToastMessage } from './components/Toast';
import { SqlConsoleModal } from './components/SqlConsoleModal';
import { PythonCodeViewerModal } from './components/PythonCodeViewerModal';

// Views
import { LoginView } from './views/LoginView';
import { DashboardView } from './views/DashboardView';
import { StudentListView } from './views/StudentListView';
import { AddStudentView } from './views/AddStudentView';
import { EditStudentView } from './views/EditStudentView';
import { StudentProfileView } from './views/StudentProfileView';
import { SearchView } from './views/SearchView';
import { SortingView } from './views/SortingView';
import { DsaLabView } from './views/DsaLabView';
import { ComplexityView } from './views/ComplexityView';
import { ReportsView } from './views/ReportsView';
import { AboutView } from './views/AboutView';

export default function App() {
  // Session Authentication state: defaults to authenticated for immediate dashboard access
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem('dsa_capstone_session_active');
    return saved !== null ? saved === 'true' : true;
  });

  const [currentUser, setCurrentUser] = useState<string>(() => {
    return localStorage.getItem('dsa_capstone_username') || 'Vicky';
  });

  // Current Active Page / Navigation
  const [activePage, setActivePage] = useState<ActivePage>('dashboard');

  // Database Students State (synchronized with SQLite engine)
  const [students, setStudents] = useState<StudentRecord[]>(() => {
    return sqliteDb.getAll();
  });

  // Selected student for Profile View and Edit View
  const [selectedStudent, setSelectedStudent] = useState<StudentRecord | null>(() => {
    const all = sqliteDb.getAll();
    return all.length > 0 ? all[0] : null;
  });

  // Toast notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Modals
  const [isSqlConsoleOpen, setIsSqlConsoleOpen] = useState(false);
  const [isPythonCodeModalOpen, setIsPythonCodeModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const addToast = (type: 'success' | 'error' | 'info', title: string, message?: string) => {
    const newToast: ToastMessage = {
      id: Math.random().toString(36).substring(2, 9),
      type,
      title,
      message
    };
    setToasts(prev => [newToast, ...prev]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== newToast.id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Login handler
  const handleLogin = (userName: string = 'Vicky') => {
    setIsAuthenticated(true);
    setCurrentUser(userName);
    localStorage.setItem('dsa_capstone_session_active', 'true');
    localStorage.setItem('dsa_capstone_username', userName);
    addToast('success', `Welcome, ${userName}!`, 'Signed into Student Record Management System.');
    setActivePage('dashboard');
  };

  // Logout handler
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('dsa_capstone_session_active');
    addToast('info', 'Logged out', 'Session closed.');
  };

  // CRUD: Add Student
  const handleAddStudent = (data: Omit<StudentRecord, 'id' | 'created_at'>) => {
    const res = sqliteDb.insert(data);
    if (res.success && res.student) {
      setStudents(sqliteDb.getAll());
      addToast(
        'success',
        'Student Registered in SQLite',
        `Successfully enrolled ${res.student.name} (ID: ${res.student.student_id}).`
      );
      setSelectedStudent(res.student);
      setActivePage('students');
      return { success: true };
    } else {
      addToast('error', 'Registration Failed', res.error);
      return { success: false, error: res.error };
    }
  };

  // CRUD: Update Student
  const handleUpdateStudent = (id: number, data: Omit<StudentRecord, 'id' | 'created_at'>) => {
    const res = sqliteDb.update(id, data);
    if (res.success && res.student) {
      setStudents(sqliteDb.getAll());
      addToast(
        'success',
        'Record Updated in SQLite',
        `Successfully modified record for ${res.student.name} (ID: ${res.student.student_id}).`
      );
      setSelectedStudent(res.student);
      setActivePage('students');
      return { success: true };
    } else {
      addToast('error', 'Update Failed', res.error);
      return { success: false, error: res.error };
    }
  };

  // CRUD: Delete Student
  const handleDeleteStudent = (id: number) => {
    const res = sqliteDb.delete(id);
    if (res.success && res.deletedStudent) {
      setStudents(sqliteDb.getAll());
      addToast(
        'info',
        'Record Deleted from SQLite',
        `Student ${res.deletedStudent.name} (ID: ${res.deletedStudent.student_id}) was unlinked and deleted.`
      );
      if (selectedStudent && selectedStudent.id === id) {
        setSelectedStudent(null);
      }
    } else {
      addToast('error', 'Delete Failed', res.error);
    }
  };

  // Reset database callback
  const handleDatabaseReset = () => {
    setStudents(sqliteDb.getAll());
    addToast('info', 'Database Reset', 'Default sample student records reloaded successfully.');
  };

  // View student profile
  const handleViewStudent = (student: StudentRecord) => {
    setSelectedStudent(student);
    setActivePage('profile');
  };

  // Edit student profile
  const handleEditStudent = (student: StudentRecord) => {
    setSelectedStudent(student);
    setActivePage('edit_student');
  };

  // If not authenticated, render Login Page
  if (!isAuthenticated) {
    return (
      <div className="font-sans antialiased text-slate-900 bg-slate-900 selection:bg-sky-500 selection:text-white">
        <ToastContainer toasts={toasts} onDismiss={removeToast} />
        <LoginView onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans antialiased text-slate-900 selection:bg-sky-500 selection:text-white">
      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* Desktop Sidebar */}
      <div className="hidden md:flex">
        <Sidebar
          activePage={activePage}
          onNavigate={page => {
            setActivePage(page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onLogout={handleLogout}
          onOpenSqlConsole={() => setIsSqlConsoleOpen(true)}
          onOpenPythonCode={() => setIsPythonCodeModalOpen(true)}
          studentCount={students.length}
          userName={currentUser}
        />
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative z-10 w-64 max-w-[80vw]">
            <Sidebar
              activePage={activePage}
              onNavigate={page => {
                setActivePage(page);
                setIsMobileMenuOpen(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onLogout={() => {
                setIsMobileMenuOpen(false);
                handleLogout();
              }}
              onOpenSqlConsole={() => {
                setIsMobileMenuOpen(false);
                setIsSqlConsoleOpen(true);
              }}
              onOpenPythonCode={() => {
                setIsMobileMenuOpen(false);
                setIsPythonCodeModalOpen(true);
              }}
              studentCount={students.length}
              userName={currentUser}
            />
          </div>
        </div>
      )}

      {/* Main Viewport Container */}
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar
          activePage={activePage}
          onNavigate={page => setActivePage(page)}
          onOpenSqlConsole={() => setIsSqlConsoleOpen(true)}
          onOpenPythonCode={() => setIsPythonCodeModalOpen(true)}
          onToggleMobileMenu={() => setIsMobileMenuOpen(true)}
          studentCount={students.length}
        />

        <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
          {activePage === 'dashboard' && (
            <DashboardView
              students={students}
              onNavigate={page => setActivePage(page)}
              onSelectStudent={handleViewStudent}
            />
          )}

          {activePage === 'students' && (
            <StudentListView
              students={students}
              onViewStudent={handleViewStudent}
              onEditStudent={handleEditStudent}
              onDeleteStudent={handleDeleteStudent}
              onAddStudent={() => setActivePage('add_student')}
            />
          )}

          {activePage === 'add_student' && (
            <AddStudentView
              onAddStudent={handleAddStudent}
              onCancel={() => setActivePage('students')}
              existingStudentIds={students.map(s => s.student_id)}
            />
          )}

          {activePage === 'profile' && selectedStudent && (
            <StudentProfileView
              student={selectedStudent}
              onEdit={handleEditStudent}
              onBack={() => setActivePage('students')}
            />
          )}

          {activePage === 'edit_student' && selectedStudent && (
            <EditStudentView
              student={selectedStudent}
              onUpdateStudent={handleUpdateStudent}
              onCancel={() => setActivePage('students')}
              existingStudentIds={students.map(s => s.student_id)}
            />
          )}

          {activePage === 'search' && (
            <SearchView
              students={students}
              onViewStudent={handleViewStudent}
            />
          )}

          {activePage === 'sorting' && (
            <SortingView students={students} />
          )}

          {activePage === 'dsa' && (
            <DsaLabView students={students} />
          )}

          {activePage === 'complexity' && (
            <ComplexityView />
          )}

          {activePage === 'reports' && (
            <ReportsView students={students} />
          )}

          {activePage === 'about' && (
            <AboutView
              onOpenPythonCode={() => setIsPythonCodeModalOpen(true)}
              onOpenSqlConsole={() => setIsSqlConsoleOpen(true)}
            />
          )}
        </main>
      </div>

      {/* SQLite Console & Schema Audit Modal */}
      <SqlConsoleModal
        isOpen={isSqlConsoleOpen}
        onClose={() => setIsSqlConsoleOpen(false)}
        onDataReset={handleDatabaseReset}
        students={students}
      />

      {/* Python Flask Source Code Browser Modal */}
      <PythonCodeViewerModal
        isOpen={isPythonCodeModalOpen}
        onClose={() => setIsPythonCodeModalOpen(false)}
      />
    </div>
  );
}
