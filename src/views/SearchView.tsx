import React, { useState } from 'react';
import {
  Search,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  TrendingUp,
  Cpu,
  RefreshCw,
  Eye,
  Info
} from 'lucide-react';
import { StudentRecord, SearchResult } from '../types/student';
import { manualLinearSearch, manualBinarySearch, isSortedByStudentId } from '../dsa/searching';
import { manualBubbleSort } from '../dsa/sorting';

interface SearchViewProps {
  students: StudentRecord[];
  onViewStudent: (student: StudentRecord) => void;
}

export const SearchView: React.FC<SearchViewProps> = ({
  students,
  onViewStudent
}) => {
  const [activeAlgorithm, setActiveAlgorithm] = useState<'linear' | 'binary'>('linear');

  // Search Inputs
  const [linearQuery, setLinearQuery] = useState('Priya');
  const [linearKey, setLinearKey] = useState<'student_id' | 'name'>('name');

  const [binaryQuery, setBinaryQuery] = useState('105');

  // Results
  const [linearResult, setLinearResult] = useState<SearchResult | null>(null);
  const [binaryResult, setBinaryResult] = useState<SearchResult | null>(null);

  // Auto-sort toggle for Binary Search
  const isSorted = isSortedByStudentId(students);
  const [forceSortedBinaryData, setForceSortedBinaryData] = useState<StudentRecord[]>(() => {
    return isSorted ? students : manualBubbleSort(students, 'student_id', 'asc').sortedData;
  });

  const handleLinearSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!linearQuery.trim()) return;

    const res = manualLinearSearch(students, linearQuery, linearKey);
    setLinearResult(res);
  };

  const handleBinarySearch = (e: React.FormEvent) => {
    e.preventDefault();
    const idNum = parseInt(binaryQuery.trim(), 10);
    if (isNaN(idNum)) return;

    // Use guaranteed sorted dataset by student_id
    const dataset = isSorted ? students : forceSortedBinaryData;
    const res = manualBinarySearch(dataset, idNum);
    setBinaryResult(res);
  };

  const handleSortDatasetForBinary = () => {
    const sorted = manualBubbleSort(students, 'student_id', 'asc').sortedData;
    setForceSortedBinaryData(sorted);
  };

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <span>DSA Module 01</span>
              <span aria-hidden="true">·</span>
              <span>Algorithm Comparison Lab</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Searching Algorithms Demonstration
            </h1>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Demonstrate manual search mechanics without hash tables or built-in functions. Compare linear sequential traversal <strong className="font-mono text-slate-900">O(n)</strong> with logarithmic divide-and-conquer <strong className="font-mono text-slate-900">O(log n)</strong>.
            </p>
          </div>

          {/* Algorithm Toggle Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg shrink-0">
            <button
              onClick={() => setActiveAlgorithm('linear')}
              className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors ${
                activeAlgorithm === 'linear'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Linear Search O(n)
            </button>
            <button
              onClick={() => setActiveAlgorithm('binary')}
              className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors ${
                activeAlgorithm === 'binary'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Binary Search O(log n)
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {activeAlgorithm === 'linear' && (
        <div className="space-y-6">
          {/* Explanation Banner */}
          <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 text-xs text-sky-950 flex items-start gap-3">
            <Info className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold text-sky-900">Linear Search Concept</p>
              <p className="leading-relaxed text-sky-900">
                &ldquo;Linear Search checks each student record one by one sequentially until the required record is found or the end of the collection is reached.&rdquo;
              </p>
              <div className="flex items-center gap-4 text-[11px] font-mono text-sky-800 pt-1">
                <span>Best Case: O(1) (Item at index 0)</span>
                <span>·</span>
                <span>Average / Worst Case: O(n)</span>
                <span>·</span>
                <span>Prerequisite: None (Works on unsorted arrays)</span>
              </div>
            </div>
          </div>

          {/* Search Controls Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <form onSubmit={handleLinearSearch} className="flex flex-col sm:flex-row items-end gap-3">
              <div className="w-full sm:w-48">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Search Attribute
                </label>
                <select
                  value={linearKey}
                  onChange={e => setLinearKey(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white text-slate-800 focus:ring-2 focus:ring-sky-500"
                >
                  <option value="name">Student Name</option>
                  <option value="student_id">Student ID</option>
                </select>
              </div>

              <div className="flex-1 w-full">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Target Value
                </label>
                <input
                  type={linearKey === 'student_id' ? 'number' : 'text'}
                  value={linearQuery}
                  onChange={e => setLinearQuery(e.target.value)}
                  placeholder={linearKey === 'student_id' ? 'e.g. 102' : 'e.g. Priya or Arun'}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-sky-600 rounded-lg hover:bg-sky-700 transition-colors shadow-xs whitespace-nowrap"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Execute Linear Search</span>
              </button>
            </form>
          </div>

          {/* Search Results Display */}
          {linearResult && (
            <div className="space-y-4">
              {/* Metrics Summary Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
                  <span className="text-xs text-slate-500">Search Outcome</span>
                  <div className={`text-base font-bold flex items-center gap-1.5 mt-1 ${
                    linearResult.found ? 'text-emerald-600' : 'text-rose-600'
                  }`}>
                    {linearResult.found ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                    <span>{linearResult.found ? 'Record Found' : 'Not Found'}</span>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
                  <span className="text-xs text-slate-500">Comparisons Made</span>
                  <div className="text-2xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
                    {linearResult.comparisons}{' '}
                    <span className="text-xs font-normal text-slate-500">/ {students.length} max</span>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
                  <span className="text-xs text-slate-500">Theoretical Complexity</span>
                  <div className="text-2xl font-bold font-mono text-sky-700 mt-1">
                    {linearResult.timeComplexity}
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
                  <span className="text-xs text-slate-500">Execution Time</span>
                  <div className="text-2xl font-bold font-mono text-slate-700 mt-1 tabular-nums">
                    {linearResult.executionTimeMs} ms
                  </div>
                </div>
              </div>

              {/* Matched Record Banner */}
              {linearResult.student && (
                <div className="bg-white rounded-xl border border-emerald-200 p-4 shadow-xs flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-mono font-bold">
                      {linearResult.student.student_id}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{linearResult.student.name}</p>
                      <p className="text-xs text-slate-500">
                        {linearResult.student.department} · {linearResult.student.year} · CGPA {linearResult.student.cgpa.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => onViewStudent(linearResult.student!)}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-lg transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Profile</span>
                  </button>
                </div>
              )}

              {/* Step-by-Step Inspection Trace */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Step-by-Step Linear Search Trace
                  </h3>
                  <span className="text-xs font-mono text-slate-500">
                    Inspected {linearResult.steps.length} sequential node(s)
                  </span>
                </div>
                <div className="overflow-x-auto max-h-72">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-slate-50 text-slate-600 text-[10px] uppercase border-b border-slate-100">
                      <tr>
                        <th className="px-5 py-2.5">Step</th>
                        <th className="px-5 py-2.5">Index</th>
                        <th className="px-5 py-2.5">Student ID</th>
                        <th className="px-5 py-2.5">Candidate Name</th>
                        <th className="px-5 py-2.5">Comparison Statement</th>
                        <th className="px-5 py-2.5 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {linearResult.steps.map(step => (
                        <tr
                          key={step.step}
                          className={step.status === 'matched' ? 'bg-emerald-50/60 font-semibold' : 'hover:bg-slate-50'}
                        >
                          <td className="px-5 py-2 text-slate-500">{step.step}</td>
                          <td className="px-5 py-2 text-slate-700">[{step.index}]</td>
                          <td className="px-5 py-2 text-slate-900 font-bold">{step.studentId}</td>
                          <td className="px-5 py-2 text-slate-800">{step.studentName}</td>
                          <td className="px-5 py-2 text-slate-600 font-sans text-xs">{step.comparison}</td>
                          <td className="px-5 py-2 text-center">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              step.status === 'matched'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-slate-100 text-slate-500'
                            }`}>
                              {step.status === 'matched' ? 'MATCH' : 'MISMATCH'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Binary Search View */}
      {activeAlgorithm === 'binary' && (
        <div className="space-y-6">
          {/* Explanation Banner */}
          <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 text-xs text-sky-950 flex items-start gap-3">
            <Info className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold text-sky-900">Binary Search Concept</p>
              <p className="leading-relaxed text-sky-900">
                &ldquo;Binary Search repeatedly divides the sorted data into two halves using midpoint arithmetic: <code className="bg-sky-100 px-1 py-0.5 rounded font-mono">mid = floor((low + high) / 2)</code>. At each step, half the remaining search space is eliminated.&rdquo;
              </p>
              <div className="flex items-center gap-4 text-[11px] font-mono text-sky-800 pt-1">
                <span>Best Case: O(1) (Target is at initial mid)</span>
                <span>·</span>
                <span>Worst / Average Case: O(log n)</span>
                <span>·</span>
                <span className="font-bold text-amber-900">STRICT PREREQUISITE: Data MUST be sorted by Student ID</span>
              </div>
            </div>
          </div>

          {/* Sorted Prerequisite Alert */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Cpu className="w-5 h-5 text-indigo-600 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-slate-900">
                  Data Sorted Status: {isSorted ? 'Array is strictly sorted by student_id ascending' : 'Current SQLite storage is unsorted for Student ID'}
                </p>
                <p className="text-[11px] text-slate-500">
                  Binary Search operates on <span className="font-mono font-bold text-slate-700">{forceSortedBinaryData.length} records</span> sorted by ID.
                </p>
              </div>
            </div>
            {!isSorted && (
              <button
                onClick={handleSortDatasetForBinary}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition-colors whitespace-nowrap"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Re-sort by Student ID</span>
              </button>
            )}
          </div>

          {/* Search Controls Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <form onSubmit={handleBinarySearch} className="flex flex-col sm:flex-row items-end gap-3">
              <div className="flex-1 w-full">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Target Student ID (Numeric Key)
                </label>
                <input
                  type="number"
                  value={binaryQuery}
                  onChange={e => setBinaryQuery(e.target.value)}
                  placeholder="e.g. 101, 105, 110, 114"
                  className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-sky-600 rounded-lg hover:bg-sky-700 transition-colors shadow-xs whitespace-nowrap"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Execute Binary Search</span>
              </button>
            </form>
          </div>

          {/* Binary Search Results */}
          {binaryResult && (
            <div className="space-y-4">
              {/* Metrics Summary Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
                  <span className="text-xs text-slate-500">Search Outcome</span>
                  <div className={`text-base font-bold flex items-center gap-1.5 mt-1 ${
                    binaryResult.found ? 'text-emerald-600' : 'text-rose-600'
                  }`}>
                    {binaryResult.found ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                    <span>{binaryResult.found ? 'Record Found' : 'Not Found'}</span>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
                  <span className="text-xs text-slate-500">Total Comparisons</span>
                  <div className="text-2xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
                    {binaryResult.comparisons}{' '}
                    <span className="text-xs font-normal text-emerald-600 font-sans">
                      (Max ⌈log₂{forceSortedBinaryData.length}⌉ = {Math.ceil(Math.log2(forceSortedBinaryData.length))})
                    </span>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
                  <span className="text-xs text-slate-500">Time Complexity</span>
                  <div className="text-2xl font-bold font-mono text-sky-700 mt-1">
                    {binaryResult.timeComplexity}
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
                  <span className="text-xs text-slate-500">Execution Speed</span>
                  <div className="text-2xl font-bold font-mono text-slate-700 mt-1 tabular-nums">
                    {binaryResult.executionTimeMs} ms
                  </div>
                </div>
              </div>

              {/* Matched Profile */}
              {binaryResult.student && (
                <div className="bg-white rounded-xl border border-emerald-200 p-4 shadow-xs flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-mono font-bold">
                      {binaryResult.student.student_id}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{binaryResult.student.name}</p>
                      <p className="text-xs text-slate-500">
                        {binaryResult.student.department} · {binaryResult.student.year} · CGPA {binaryResult.student.cgpa.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => onViewStudent(binaryResult.student!)}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-lg transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Profile</span>
                  </button>
                </div>
              )}

              {/* Step-by-Step Halving Trace */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Binary Search Pointer Trace: [low, mid, high]
                  </h3>
                  <span className="text-xs font-mono text-slate-500">
                    Solved in {binaryResult.steps.length} iteration(s)
                  </span>
                </div>
                <div className="divide-y divide-slate-100">
                  {binaryResult.steps.map(step => (
                    <div key={step.step} className="p-4 space-y-2 hover:bg-slate-50/50 transition-colors">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-900">
                          Iteration #{step.step}
                        </span>
                        <div className="flex items-center gap-3 font-mono text-[11px]">
                          <span className="text-slate-500">low = <strong>{step.low}</strong></span>
                          <span className="text-slate-500">high = <strong>{step.high}</strong></span>
                          <span className="text-sky-700 bg-sky-50 px-2 py-0.5 rounded font-bold">mid = {step.mid}</span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-700 font-mono leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                        {step.comparison}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
