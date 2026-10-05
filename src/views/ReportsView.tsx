import React from 'react';
import {
  Printer,
  Download,
  BarChart3,
  Award,
  Users,
  GraduationCap,
  Calendar,
  ShieldCheck,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { StudentRecord } from '../types/student';

interface ReportsViewProps {
  students: StudentRecord[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({ students }) => {
  const total = students.length;

  // Department counts
  const deptCounts: { [key: string]: number } = {};
  for (let i = 0; i < students.length; i++) {
    const d = students[i].department;
    deptCounts[d] = (deptCounts[d] || 0) + 1;
  }

  // Year counts
  const yearCounts: { [key: string]: number } = {};
  for (let i = 0; i < students.length; i++) {
    const y = students[i].year;
    yearCounts[y] = (yearCounts[y] || 0) + 1;
  }

  // CGPA brackets
  let distinctionCount = 0; // >= 9.0
  let firstClassCount = 0;  // 7.5 - 8.99
  let secondClassCount = 0; // 6.0 - 7.49
  let passCount = 0;        // < 6.0

  let sumCgpa = 0;
  let highestStudent = students[0];
  let lowestStudent = students[0];

  for (let i = 0; i < students.length; i++) {
    const c = students[i].cgpa;
    sumCgpa += c;
    if (!highestStudent || c > highestStudent.cgpa) highestStudent = students[i];
    if (!lowestStudent || c < lowestStudent.cgpa) lowestStudent = students[i];

    if (c >= 9.0) distinctionCount++;
    else if (c >= 7.5) firstClassCount++;
    else if (c >= 6.0) secondClassCount++;
    else passCount++;
  }

  const avgCgpa = total > 0 ? (sumCgpa / total).toFixed(2) : '0.00';

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const headers = ['Student ID', 'Name', 'Department', 'Year', 'Section', 'Email', 'Phone', 'CGPA'];
    const rows = students.map(s => [
      s.student_id,
      `"${s.name}"`,
      `"${s.department}"`,
      `"${s.year}"`,
      s.section,
      `"${s.email}"`,
      s.phone,
      s.cgpa
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `institutional_student_report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 print:m-0 print:p-0">
      {/* Action Header (Hidden in Print) */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Institutional Documentation</span>
            <span aria-hidden="true">·</span>
            <span>Academic Performance Audit</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Comprehensive Academic Reports & Analytics
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Official summary of departmental enrollments, CGPA distributions, and student cohorts.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Academic Report</span>
          </button>
        </div>
      </div>

      {/* Printable Report Layout */}
      <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-xs space-y-8 print:border-none print:shadow-none print:p-2">
        {/* Printable Header */}
        <div className="border-b border-slate-200 pb-6 text-center space-y-1">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
            College of Engineering & Technology
          </p>
          <h2 className="text-2xl font-bold text-slate-900">
            Student Academic Records & Performance Report
          </h2>
          <p className="text-xs text-slate-500 font-mono">
            Generated on {new Date().toLocaleDateString()} · Data Source: SQLite database.db
          </p>
        </div>

        {/* High-level Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Total Students</span>
            <span className="text-2xl font-bold font-mono text-slate-900 mt-1 block tabular-nums">{total}</span>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Average CGPA</span>
            <span className="text-2xl font-bold font-mono text-sky-700 mt-1 block tabular-nums">{avgCgpa}</span>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Highest CGPA</span>
            <span className="text-2xl font-bold font-mono text-emerald-600 mt-1 block tabular-nums">
              {highestStudent ? highestStudent.cgpa.toFixed(2) : '0.00'}
            </span>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Lowest CGPA</span>
            <span className="text-2xl font-bold font-mono text-rose-600 mt-1 block tabular-nums">
              {lowestStudent ? lowestStudent.cgpa.toFixed(2) : '0.00'}
            </span>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center col-span-2 md:col-span-1">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Departments</span>
            <span className="text-2xl font-bold font-mono text-slate-900 mt-1 block tabular-nums">
              {Object.keys(deptCounts).length}
            </span>
          </div>
        </div>

        {/* Section: Department-wise Breakdown & Year-wise Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-slate-100">
          {/* Department Breakdown */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center justify-between">
              <span>Department-Wise Distribution</span>
              <span className="text-slate-400 font-normal">Headcount</span>
            </h3>

            <div className="space-y-3">
              {Object.entries(deptCounts).map(([dept, count]) => {
                const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                return (
                  <div key={dept} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-800">{dept}</span>
                      <span className="font-mono text-slate-600 tabular-nums">
                        {count} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-sky-600 rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Year-wise Breakdown */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center justify-between">
              <span>Year-Wise Student Cohort</span>
              <span className="text-slate-400 font-normal">Distribution</span>
            </h3>

            <div className="space-y-3">
              {Object.entries(yearCounts).map(([year, count]) => {
                const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                return (
                  <div key={year} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-800">{year}</span>
                      <span className="font-mono text-slate-600 tabular-nums">
                        {count} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-600 rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Section: CGPA Performance Brackets */}
        <div className="pt-4 border-t border-slate-100 space-y-4">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100">
            Institutional CGPA Performance Classification
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50">
              <span className="font-bold text-emerald-950 block">Distinction (≥ 9.00)</span>
              <span className="text-2xl font-bold font-mono text-emerald-700 mt-1 block tabular-nums">
                {distinctionCount}{' '}
                <span className="text-xs font-normal text-emerald-800">
                  ({total > 0 ? Math.round((distinctionCount / total) * 100) : 0}%)
                </span>
              </span>
              <span className="text-[11px] text-emerald-800 mt-1 block">Honors Candidate</span>
            </div>

            <div className="p-4 rounded-xl border border-sky-200 bg-sky-50/50">
              <span className="font-bold text-sky-950 block">First Class (7.50 - 8.99)</span>
              <span className="text-2xl font-bold font-mono text-sky-700 mt-1 block tabular-nums">
                {firstClassCount}{' '}
                <span className="text-xs font-normal text-sky-800">
                  ({total > 0 ? Math.round((firstClassCount / total) * 100) : 0}%)
                </span>
              </span>
              <span className="text-[11px] text-sky-800 mt-1 block">Good Academic Standing</span>
            </div>

            <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50">
              <span className="font-bold text-amber-950 block">Second Class (6.00 - 7.49)</span>
              <span className="text-2xl font-bold font-mono text-amber-700 mt-1 block tabular-nums">
                {secondClassCount}{' '}
                <span className="text-xs font-normal text-amber-800">
                  ({total > 0 ? Math.round((secondClassCount / total) * 100) : 0}%)
                </span>
              </span>
              <span className="text-[11px] text-amber-800 mt-1 block">Satisfactory</span>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
              <span className="font-bold text-slate-900 block">Baseline (&lt; 6.00)</span>
              <span className="text-2xl font-bold font-mono text-slate-700 mt-1 block tabular-nums">
                {passCount}{' '}
                <span className="text-xs font-normal text-slate-500">
                  ({total > 0 ? Math.round((passCount / total) * 100) : 0}%)
                </span>
              </span>
              <span className="text-[11px] text-slate-500 mt-1 block">Academic Support Target</span>
            </div>
          </div>
        </div>

        {/* Printable Footer / Signoff */}
        <div className="pt-8 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div>
            <p className="font-semibold text-slate-800">Verified by: Head of Academic Records</p>
            <p className="text-[11px]">Department of Computer Science & Engineering</p>
          </div>
          <div className="text-right">
            <p className="font-mono text-[11px]">System Status: AUDITED</p>
            <p className="text-[11px]">Academic DSA Capstone Project</p>
          </div>
        </div>
      </div>
    </div>
  );
};
