import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Eye,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Download,
  RotateCcw
} from 'lucide-react';
import { StudentRecord } from '../types/student';
import { DEPARTMENTS, YEARS } from '../db/initialData';
import { DeleteConfirmModal } from '../components/Modal';

interface StudentListViewProps {
  students: StudentRecord[];
  onViewStudent: (student: StudentRecord) => void;
  onEditStudent: (student: StudentRecord) => void;
  onDeleteStudent: (id: number) => void;
  onAddStudent: () => void;
}

export const StudentListView: React.FC<StudentListViewProps> = ({
  students,
  onViewStudent,
  onEditStudent,
  onDeleteStudent,
  onAddStudent
}) => {
  // Filtering & Search states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');

  // Sorting state
  const [sortField, setSortField] = useState<'student_id' | 'name' | 'cgpa'>('student_id');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Deletion modal state
  const [studentToDelete, setStudentToDelete] = useState<StudentRecord | null>(null);

  // Filtered & Sorted student list
  const filteredStudents = useMemo(() => {
    let result = [...students];

    // Filter by search query (ID, Name, Email)
    if (searchTerm.trim()) {
      const q = searchTerm.trim().toLowerCase();
      result = result.filter(s =>
        s.student_id.toString().includes(q) ||
        s.name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.department.toLowerCase().includes(q)
      );
    }

    // Filter by department
    if (selectedDept !== 'all') {
      result = result.filter(s => s.department === selectedDept);
    }

    // Filter by year
    if (selectedYear !== 'all') {
      result = result.filter(s => s.year === selectedYear);
    }

    // Sort result
    result.sort((a, b) => {
      let valA: string | number = a[sortField];
      let valB: string | number = b[sortField];

      if (typeof valA === 'string' && typeof valB === 'string') {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
      }

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [students, searchTerm, selectedDept, selectedYear, sortField, sortDirection]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredStudents.length / pageSize) || 1;
  const paginatedStudents = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredStudents.slice(startIndex, startIndex + pageSize);
  }, [filteredStudents, currentPage, pageSize]);

  const handleSortToggle = (field: 'student_id' | 'name' | 'cgpa') => {
    if (sortField === field) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedDept('all');
    setSelectedYear('all');
    setSortField('student_id');
    setSortDirection('asc');
    setCurrentPage(1);
  };

  const handleExportCSV = () => {
    const headers = ['Student ID', 'Name', 'Gender', 'DOB', 'Department', 'Year', 'Section', 'Email', 'Phone', 'Address', 'CGPA'];
    const rows = filteredStudents.map(s => [
      s.student_id,
      `"${s.name}"`,
      s.gender,
      s.dob,
      `"${s.department}"`,
      `"${s.year}"`,
      s.section,
      `"${s.email}"`,
      s.phone,
      `"${s.address}"`,
      s.cgpa
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `students_records_export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Controls Header: Search, Filters, Stats */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={e => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by student name, ID, or email..."
              className="block w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-slate-900 bg-white"
            />
          </div>

          {/* Quick summary and actions */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-mono">
              Showing <strong className="text-slate-900">{filteredStudents.length}</strong> of{' '}
              <strong className="text-slate-900">{students.length}</strong> records
            </span>
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={onAddStudent}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-sky-600 rounded-lg hover:bg-sky-700 transition-colors shadow-xs"
            >
              <span>+ Add Student</span>
            </button>
          </div>
        </div>

        {/* Filter bar */}
        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-1.5 text-slate-500">
            <Filter className="w-3.5 h-3.5" />
            <span>Filters:</span>
          </div>

          {/* Department Filter */}
          <select
            value={selectedDept}
            onChange={e => {
              setSelectedDept(e.target.value);
              setCurrentPage(1);
            }}
            className="px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white text-slate-700 focus:ring-1 focus:ring-sky-500 text-xs"
          >
            <option value="all">All Departments</option>
            {DEPARTMENTS.map(d => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          {/* Year Filter */}
          <select
            value={selectedYear}
            onChange={e => {
              setSelectedYear(e.target.value);
              setCurrentPage(1);
            }}
            className="px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white text-slate-700 focus:ring-1 focus:ring-sky-500 text-xs"
          >
            <option value="all">All Years</option>
            {YEARS.map(y => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>

          {(searchTerm || selectedDept !== 'all' || selectedYear !== 'all') && (
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-1 text-slate-500 hover:text-slate-800 transition-colors ml-auto text-xs"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Students Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider text-[11px] font-semibold border-b border-slate-200 select-none">
              <tr>
                <th
                  onClick={() => handleSortToggle('student_id')}
                  className="px-5 py-3.5 cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Student ID</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSortToggle('name')}
                  className="px-5 py-3.5 cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Name</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="px-5 py-3.5">Department</th>
                <th className="px-5 py-3.5">Year</th>
                <th className="px-5 py-3.5 text-center">Sec</th>
                <th className="px-5 py-3.5">Email</th>
                <th
                  onClick={() => handleSortToggle('cgpa')}
                  className="px-5 py-3.5 cursor-pointer hover:bg-slate-100 transition-colors text-right"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>CGPA</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="px-5 py-3.5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-slate-400">
                    <p className="text-sm font-medium">No student records found matching your filters.</p>
                    <button
                      onClick={handleResetFilters}
                      className="mt-2 text-xs text-sky-600 hover:text-sky-800 font-semibold"
                    >
                      Clear search and filters
                    </button>
                  </td>
                </tr>
              ) : (
                paginatedStudents.map(student => (
                  <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Student ID */}
                    <td className="px-5 py-3 font-mono font-bold text-slate-900">
                      {student.student_id}
                    </td>

                    {/* Name */}
                    <td className="px-5 py-3 font-medium text-slate-900">
                      {student.name}
                    </td>

                    {/* Department */}
                    <td className="px-5 py-3 text-slate-600 truncate max-w-[200px]" title={student.department}>
                      {student.department}
                    </td>

                    {/* Year */}
                    <td className="px-5 py-3 text-slate-600">
                      {student.year}
                    </td>

                    {/* Section */}
                    <td className="px-5 py-3 text-center font-mono text-slate-600">
                      {student.section}
                    </td>

                    {/* Email */}
                    <td className="px-5 py-3 text-slate-500 font-mono text-[11px] truncate max-w-[170px]" title={student.email}>
                      {student.email}
                    </td>

                    {/* CGPA */}
                    <td className="px-5 py-3 text-right font-mono font-bold text-sky-700">
                      {student.cgpa.toFixed(2)}
                    </td>

                    {/* Action buttons */}
                    <td className="px-5 py-3 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => onViewStudent(student)}
                          title="View Complete Profile"
                          className="p-1.5 text-slate-600 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onEditStudent(student)}
                          title="Edit Student Information"
                          className="p-1.5 text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setStudentToDelete(student)}
                          title="Delete Record from SQLite"
                          className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination bar */}
        <div className="px-6 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div>
            Page <span className="font-semibold text-slate-900">{currentPage}</span> of{' '}
            <span className="font-semibold text-slate-900">{totalPages}</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {studentToDelete && (
        <DeleteConfirmModal
          isOpen={true}
          onClose={() => setStudentToDelete(null)}
          onConfirm={() => {
            onDeleteStudent(studentToDelete.id);
            setStudentToDelete(null);
          }}
          studentId={studentToDelete.student_id}
          studentName={studentToDelete.name}
        />
      )}
    </div>
  );
};
