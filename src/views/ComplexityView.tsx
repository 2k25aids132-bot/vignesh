import React from 'react';
import {
  TableProperties,
  Clock,
  HardDrive,
  CheckCircle2,
  HelpCircle,
  BookOpen
} from 'lucide-react';
import { COMPLEXITY_DATA } from '../dsa/complexity';

export const ComplexityView: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
          <span>Theoretical Computer Science</span>
          <span aria-hidden="true">·</span>
          <span>Asymptotic Analysis Matrix</span>
        </div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          Algorithm Complexity Analysis Matrix
        </h1>
        <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
          Comprehensive asymptotic complexity comparison for the five foundational DSA implementations in this capstone project. Evaluates Time Complexity (Best, Average, Worst) and Auxiliary Space.
        </p>
      </div>

      {/* Main Complexity Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Standard Asymptotic Bounds Comparison
          </h2>
          <span className="text-xs font-mono text-slate-500">
            Big-O Notation (O)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-100/70 text-slate-700 uppercase tracking-wider text-[11px] font-semibold border-b border-slate-200">
              <tr>
                <th className="px-6 py-3.5">Algorithm / Data Structure</th>
                <th className="px-6 py-3.5">Category</th>
                <th className="px-6 py-3.5 font-mono text-emerald-700">Best Case</th>
                <th className="px-6 py-3.5 font-mono text-sky-700">Average Case</th>
                <th className="px-6 py-3.5 font-mono text-rose-700">Worst Case</th>
                <th className="px-6 py-3.5 font-mono text-indigo-700">Auxiliary Space</th>
                <th className="px-6 py-3.5">Prerequisites</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {COMPLEXITY_DATA.map((item, index) => (
                <tr key={item.name} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-3.5 font-bold font-sans text-slate-900">
                    {item.name}
                  </td>
                  <td className="px-6 py-3.5 font-sans">
                    <span className="text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 font-bold text-emerald-700">
                    {item.best}
                  </td>
                  <td className="px-6 py-3.5 font-bold text-sky-700">
                    {item.average}
                  </td>
                  <td className="px-6 py-3.5 font-bold text-rose-700">
                    {item.worst}
                  </td>
                  <td className="px-6 py-3.5 text-indigo-700">
                    {item.space}
                  </td>
                  <td className="px-6 py-3.5 font-sans text-xs text-slate-600">
                    {item.condition}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Explanations Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Detailed Explanations */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-4 h-4 text-sky-600" />
            <span>Time Complexity & Asymptotic Behavior</span>
          </h3>

          <div className="space-y-3 text-xs leading-relaxed text-slate-600">
            <p>
              <strong className="text-slate-900">1. Linear Search:</strong> Inspects items one by one. In the best case, the target element is immediately at index 0 (O(1)). In the worst case, the target is at index n-1 or completely absent, requiring n checks (O(n)).
            </p>
            <p>
              <strong className="text-slate-900">2. Binary Search:</strong> Requires the dataset to be sorted by key. Halves the search space at each midpoint comparison. After k comparisons, n / 2^k elements remain, yielding a logarithmic time bound of O(log n).
            </p>
            <p>
              <strong className="text-slate-900">3. Bubble Sort:</strong> Uses adjacent element comparisons and swaps. When enhanced with a swapped flag, an already-sorted array requires only 1 pass with n-1 comparisons, achieving O(n) best-case. The average and worst case perform n(n-1)/2 comparisons, resulting in O(n²).
            </p>
            <p>
              <strong className="text-slate-900">4. Merge Sort:</strong> Consistently divides an array into halves (log₂n division levels) and merges them in linear O(n) time. Therefore, Best, Average, and Worst case runtimes are all strictly O(n log n).
            </p>
            <p>
              <strong className="text-slate-900">5. Linked List Search:</strong> Because nodes are chained dynamically via heap memory pointers rather than contiguous memory addresses, random indexing (arr[i]) is impossible. Traversal from the HEAD pointer requires O(n) linear steps.
            </p>
          </div>
        </div>

        {/* Right: Space Complexity & Viva Questions */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-emerald-600" />
            <span>Key Viva Questions for Examiners</span>
          </h3>

          <div className="space-y-4 text-xs">
            {COMPLEXITY_DATA.slice(0, 3).map((item, idx) => (
              <div key={idx} className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                <p className="font-bold text-slate-900">
                  Q: {item.vivaQuestion}
                </p>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  <span className="font-semibold text-emerald-700">Answer:</span> {item.vivaAnswer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
