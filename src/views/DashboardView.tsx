import React from 'react';
import {
  Users,
  GraduationCap,
  Award,
  TrendingUp,
  TrendingDown,
  UserPlus,
  Search,
  Network,
  ArrowRight,
  Database
} from 'lucide-react';
import { StudentRecord } from '../types/student';
import { ActivePage } from '../components/Sidebar';

interface DashboardViewProps {
  students: StudentRecord[];
  onNavigate: (page: ActivePage) => void;
  onSelectStudent: (student: StudentRecord) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  students,
  onNavigate,
  onSelectStudent
}) => {
  // Statistics calculations (pure algorithmic iteration)
  const totalStudents = students.length;

  // Department counts (manual array scan without hash tables)
  const deptMap: { [key: string]: number } = {};
  for (let i = 0; i < students.length; i++) {
    const dept = students[i].department;
    deptMap[dept] = (deptMap[dept] || 0) + 1;
  }
  const deptKeys = Object.keys(deptMap);
  const totalDepartments = deptKeys.length;

  let sumCgpa = 0;
  let highestCgpa = students.length > 0 ? students[0].cgpa : 0;
  let lowestCgpa = students.length > 0 ? students[0].cgpa : 0;
  let topStudent: StudentRecord | null = students.length > 0 ? students[0] : null;

  for (let i = 0; i < students.length; i++) {
    const c = students[i].cgpa;
    sumCgpa += c;
    if (c > highestCgpa) {
      highestCgpa = c;
      topStudent = students[i];
    }
    if (c < lowestCgpa) {
      lowestCgpa = c;
    }
  }

  const avgCgpa = totalStudents > 0 ? Number((sumCgpa / totalStudents).toFixed(2)) : 0;

  // Recently added students (last 5 by ID descending)
  const recentStudents = [...students].sort((a, b) => b.id - a.id).slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Welcome Banner / Overview */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Academic Session 2025–2026</span>
            <span aria-hidden="true">·</span>
            <span>Department of Computer Science & Engineering</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Student Record Management System
          </h1>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Academic software demonstration combining an ACID-compliant SQLite backend with custom manual implementations of Singly Linked Lists, Linear Search, Binary Search, Bubble Sort, and Merge Sort.
          </p>
        </div>

        {/* Quick action buttons */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => onNavigate('add_student')}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-sky-600 rounded-lg hover:bg-sky-700 transition-colors shadow-xs"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Add Student</span>
          </button>
          <button
            onClick={() => onNavigate('students')}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <Users className="w-3.5 h-3.5 text-slate-500" />
            <span>View All</span>
          </button>
          <button
            onClick={() => onNavigate('search')}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <Search className="w-3.5 h-3.5 text-slate-500" />
            <span>Search</span>
          </button>
          <button
            onClick={() => onNavigate('dsa')}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-sky-700 bg-sky-50 border border-sky-200 rounded-lg hover:bg-sky-100 transition-colors"
          >
            <Network className="w-3.5 h-3.5" />
            <span>DSA Lab</span>
          </button>
        </div>
      </div>

      {/* 5 Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1: Total Students */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Total Students</span>
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
            {totalStudents}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Active SQLite Records</p>
        </div>

        {/* Card 2: Total Departments */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Departments</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
            {totalDepartments}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Engineering Disciplines</p>
        </div>

        {/* Card 3: Average CGPA */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Average CGPA</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
            {avgCgpa.toFixed(2)}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Overall Institutional Mean</p>
        </div>

        {/* Card 4: Highest CGPA */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Highest CGPA</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-600 tabular-nums">
            {highestCgpa.toFixed(2)}
          </div>
          <p className="text-[11px] text-slate-500 mt-1 truncate">
            {topStudent ? topStudent.name : 'N/A'}
          </p>
        </div>

        {/* Card 5: Lowest CGPA */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Lowest CGPA</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-rose-600 tabular-nums">
            {lowestCgpa.toFixed(2)}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Support Target Baseline</p>
        </div>
      </div>

      {/* Main Grid: Recently Added Students & Department Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Recently Added Students (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Recently Added Students</h2>
              <p className="text-xs text-slate-500">Latest enrolled records from SQLite database</p>
            </div>
            <button
              onClick={() => onNavigate('students')}
              className="flex items-center gap-1 text-xs font-medium text-sky-600 hover:text-sky-800 transition-colors"
            >
              <span>View All Records</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-semibold border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3">Student ID</th>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Department</th>
                  <th className="px-6 py-3">Year</th>
                  <th className="px-6 py-3 text-right">CGPA</th>
                  <th className="px-6 py-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentStudents.map(student => (
                  <tr key={student.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-3.5 font-mono font-semibold text-slate-900">
                      {student.student_id}
                    </td>
                    <td className="px-6 py-3.5 font-medium text-slate-800">
                      {student.name}
                    </td>
                    <td className="px-6 py-3.5 text-slate-600 truncate max-w-[180px]">
                      {student.department}
                    </td>
                    <td className="px-6 py-3.5 text-slate-600">
                      {student.year}
                    </td>
                    <td className="px-6 py-3.5 text-right font-mono font-bold text-sky-700">
                      {student.cgpa.toFixed(2)}
                    </td>
                    <td className="px-6 py-3.5 text-center">
                      <button
                        onClick={() => {
                          onSelectStudent(student);
                          onNavigate('profile');
                        }}
                        className="text-xs text-sky-600 hover:text-sky-800 font-medium"
                      >
                        Profile
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Department-wise Count (1 Col) */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 mb-1">
              Department-Wise Count
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Distribution of students by discipline
            </p>

            <div className="space-y-3.5">
              {deptKeys.map(dept => {
                const count = deptMap[dept];
                const pct = totalStudents > 0 ? Math.round((count / totalStudents) * 100) : 0;
                return (
                  <div key={dept} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-700 truncate max-w-[200px]" title={dept}>
                        {dept}
                      </span>
                      <span className="font-mono text-slate-500 tabular-nums">
                        {count} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-sky-600 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1.5 font-mono text-[11px]">
              <Database className="w-3.5 h-3.5 text-emerald-600" />
              <span>GROUP BY department</span>
            </span>
            <button
              onClick={() => onNavigate('reports')}
              className="text-sky-600 hover:text-sky-800 font-medium"
            >
              Full Analytics
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
