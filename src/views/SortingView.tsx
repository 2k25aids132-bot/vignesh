import React, { useState } from 'react';
import {
  ArrowUpDown,
  Play,
  RotateCcw,
  Sparkles,
  GitMerge,
  Cpu,
  Layers,
  Info,
  CheckCircle2
} from 'lucide-react';
import { StudentRecord, SortKey, SortOrder, SortResult } from '../types/student';
import { manualBubbleSort, manualMergeSort } from '../dsa/sorting';

interface SortingViewProps {
  students: StudentRecord[];
}

export const SortingView: React.FC<SortingViewProps> = ({ students }) => {
  const [selectedAlgo, setSelectedAlgo] = useState<'bubble' | 'merge'>('bubble');
  const [sortKey, setSortKey] = useState<SortKey>('cgpa');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const [sortResult, setSortResult] = useState<SortResult | null>(() => {
    return manualBubbleSort(students, 'cgpa', 'desc');
  });

  const handleExecuteSort = () => {
    if (selectedAlgo === 'bubble') {
      const res = manualBubbleSort(students, sortKey, sortOrder);
      setSortResult(res);
    } else {
      const res = manualMergeSort(students, sortKey, sortOrder);
      setSortResult(res);
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <span>DSA Module 02</span>
              <span aria-hidden="true">·</span>
              <span>Sorting Benchmarking Lab</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Sorting Algorithms Demonstration
            </h1>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Compare iterative pairwise Bubble Sort <strong className="font-mono text-slate-900">O(n²)</strong> with divide-and-conquer Merge Sort <strong className="font-mono text-slate-900">O(n log n)</strong>. No built-in <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-[11px]">sort()</code> or <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-[11px]">sorted()</code> used.
            </p>
          </div>

          {/* Algorithm Toggle */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg shrink-0">
            <button
              onClick={() => {
                setSelectedAlgo('bubble');
                setSortResult(manualBubbleSort(students, sortKey, sortOrder));
              }}
              className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors ${
                selectedAlgo === 'bubble'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Bubble Sort O(n²)
            </button>
            <button
              onClick={() => {
                setSelectedAlgo('merge');
                setSortResult(manualMergeSort(students, sortKey, sortOrder));
              }}
              className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors ${
                selectedAlgo === 'merge'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Merge Sort O(n log n)
            </button>
          </div>
        </div>
      </div>

      {/* Concept Explanation Card */}
      {selectedAlgo === 'bubble' ? (
        <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 text-xs text-sky-950 flex items-start gap-3">
          <Info className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold text-sky-900">Bubble Sort Mechanism</p>
            <p className="leading-relaxed text-sky-900">
              Iterates through the dataset comparing adjacent pairs: <code className="bg-sky-100 px-1 py-0.5 rounded font-mono">if arr[j] &gt; arr[j+1] =&gt; swap</code>. After each outer pass, the largest remaining element bubbles to its final position. Includes early exit flag when no swaps occur.
            </p>
            <div className="flex items-center gap-4 text-[11px] font-mono text-sky-800 pt-1">
              <span>Time: Best O(n) · Average O(n²) · Worst O(n²)</span>
              <span>·</span>
              <span>Auxiliary Space: O(1) in-place</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 text-xs text-sky-950 flex items-start gap-3">
          <Info className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold text-sky-900">Merge Sort Mechanism (Divide & Conquer)</p>
            <p className="leading-relaxed text-sky-900">
              1. <strong>Divide</strong>: Split array into left and right sublists of size n/2 recursively until base case of size ≤ 1.
              <br />
              2. <strong>Conquer</strong>: Sorted sublists are combined by comparing front elements in linear O(n) time.
            </p>
            <div className="flex items-center gap-4 text-[11px] font-mono text-sky-800 pt-1">
              <span>Time: Guaranteed O(n log n) in all cases</span>
              <span>·</span>
              <span>Auxiliary Space: O(n) memory</span>
            </div>
          </div>
        </div>
      )}

      {/* Sort Configuration Controls */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row items-end gap-3">
          {/* Key Selection */}
          <div className="flex-1 w-full">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Sort By Field (Key)
            </label>
            <select
              value={sortKey}
              onChange={e => setSortKey(e.target.value as SortKey)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white text-slate-800 focus:ring-2 focus:ring-sky-500"
            >
              <option value="student_id">Student ID (Numeric Key)</option>
              <option value="name">Student Name (Alphabetical Key)</option>
              <option value="cgpa">CGPA (Academic Performance Key)</option>
            </select>
          </div>

          {/* Order Selection */}
          <div className="w-full sm:w-48">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Order Direction
            </label>
            <select
              value={sortOrder}
              onChange={e => setSortOrder(e.target.value as SortOrder)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white text-slate-800 focus:ring-2 focus:ring-sky-500"
            >
              <option value="asc">Ascending (Low to High)</option>
              <option value="desc">Descending (High to Low)</option>
            </select>
          </div>

          <button
            onClick={handleExecuteSort}
            className="flex items-center gap-1.5 px-6 py-2 text-xs font-semibold text-white bg-sky-600 rounded-lg hover:bg-sky-700 transition-colors shadow-xs whitespace-nowrap"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Execute {selectedAlgo === 'bubble' ? 'Bubble Sort' : 'Merge Sort'}</span>
          </button>
        </div>
      </div>

      {/* Metrics Strips */}
      {sortResult && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
              <span className="text-xs text-slate-500">Algorithm</span>
              <div className="text-base font-bold text-slate-900 mt-1">
                {sortResult.algorithm}
              </div>
              <span className="text-[11px] text-slate-500 font-mono">
                Key: {sortResult.key} ({sortResult.order.toUpperCase()})
              </span>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
              <span className="text-xs text-slate-500">Element Comparisons</span>
              <div className="text-2xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
                {sortResult.comparisons}
              </div>
              <span className="text-[11px] text-slate-500">Manual comparison steps</span>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
              <span className="text-xs text-slate-500">
                {sortResult.algorithm === 'Bubble Sort' ? 'Swaps Performed' : 'Auxiliary Space'}
              </span>
              <div className="text-2xl font-bold font-mono text-sky-700 mt-1 tabular-nums">
                {sortResult.algorithm === 'Bubble Sort' ? sortResult.swaps : sortResult.spaceComplexity}
              </div>
              <span className="text-[11px] text-slate-500">
                {sortResult.algorithm === 'Bubble Sort' ? 'In-place memory writes' : 'Extra buffers allocated'}
              </span>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
              <span className="text-xs text-slate-500">Execution Time</span>
              <div className="text-2xl font-bold font-mono text-slate-800 mt-1 tabular-nums">
                {sortResult.executionTimeMs} ms
              </div>
              <span className="text-[11px] font-mono text-emerald-600 font-medium">
                Complexity: {sortResult.timeComplexity}
              </span>
            </div>
          </div>

          {/* Merge Sort Recursive Divide-and-Merge Tree View */}
          {sortResult.algorithm === 'Merge Sort' && sortResult.mergeTreeSteps && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Merge Sort Divide-and-Conquer Trace
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Visual tree showing recursive division into left/right sublists and bottom-up merge combination.
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-sky-700 bg-sky-50 px-2.5 py-1 rounded-lg font-mono">
                  <GitMerge className="w-3.5 h-3.5" />
                  <span>log₂({students.length}) levels</span>
                </div>
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto pr-2">
                {sortResult.mergeTreeSteps.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs font-mono flex flex-col md:flex-row md:items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-slate-200 text-slate-800 font-bold rounded text-[10px]">
                        {step.stage}
                      </span>
                      <span className="text-slate-600 font-sans text-xs">{step.description}</span>
                    </div>
                    <div className="text-sky-800 font-bold text-right truncate">
                      {step.subarrays.join(' · ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Side-by-Side: Original Data vs Sorted Data */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Original Data Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Original Dataset ({sortResult.originalData.length} records)
                </span>
                <span className="text-[11px] font-mono text-slate-500">Unordered</span>
              </div>
              <div className="overflow-x-auto max-h-96">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-100 text-slate-600 text-[10px] uppercase border-b">
                    <tr>
                      <th className="px-4 py-2">ID</th>
                      <th className="px-4 py-2 font-sans">Name</th>
                      <th className="px-4 py-2 font-sans">Department</th>
                      <th className="px-4 py-2 text-right">CGPA</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {sortResult.originalData.map(s => (
                      <tr key={s.id} className="hover:bg-slate-50">
                        <td className="px-4 py-2 font-bold text-slate-900">{s.student_id}</td>
                        <td className="px-4 py-2 font-sans text-slate-800">{s.name}</td>
                        <td className="px-4 py-2 font-sans text-slate-500 truncate max-w-[130px]">{s.department}</td>
                        <td className="px-4 py-2 text-right font-bold text-slate-700">{s.cgpa.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Sorted Data Table */}
            <div className="bg-white rounded-xl border border-emerald-200 shadow-xs overflow-hidden">
              <div className="px-5 py-3.5 bg-emerald-50 border-b border-emerald-200 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-950 uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Sorted Data by {sortResult.key.toUpperCase()} ({sortResult.order.toUpperCase()})</span>
                </div>
                <span className="text-[11px] font-mono text-emerald-700 font-bold">100% Sorted</span>
              </div>
              <div className="overflow-x-auto max-h-96">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-100 text-slate-600 text-[10px] uppercase border-b">
                    <tr>
                      <th className="px-4 py-2">Rank</th>
                      <th className="px-4 py-2">ID</th>
                      <th className="px-4 py-2 font-sans">Name</th>
                      <th className="px-4 py-2 text-right">CGPA</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {sortResult.sortedData.map((s, idx) => (
                      <tr key={s.id} className="hover:bg-emerald-50/40">
                        <td className="px-4 py-2 text-slate-400">#{idx + 1}</td>
                        <td className="px-4 py-2 font-bold text-slate-900">{s.student_id}</td>
                        <td className="px-4 py-2 font-sans font-medium text-slate-900">{s.name}</td>
                        <td className="px-4 py-2 text-right font-bold text-sky-700">{s.cgpa.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
