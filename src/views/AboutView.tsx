import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Code2,
  Database,
  Layers,
  Sparkles,
  HelpCircle,
  ExternalLink,
  Download,
  Copy,
  Check
} from 'lucide-react';
import { PYTHON_CAPSTONE_FILES } from '../python_files/pythonSources';

interface AboutViewProps {
  onOpenPythonCode: () => void;
  onOpenSqlConsole: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({
  onOpenPythonCode,
  onOpenSqlConsole
}) => {
  const [selectedFile, setSelectedFile] = useState(0);
  const [copied, setCopied] = useState(false);

  const file = PYTHON_CAPSTONE_FILES[selectedFile];

  const handleCopy = () => {
    navigator.clipboard.writeText(file.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const vivaQuestions = [
    {
      q: 'Why does this project exclude Hash Tables, Queues, and Stacks?',
      a: 'The project strictly enforces foundational college DSA syllabus constraints. Singly Linked Lists demonstrate dynamic node-pointer mechanics; Linear Search and Binary Search demonstrate sequential vs logarithmic search; Bubble Sort and Merge Sort contrast quadratic pairwise sorting with divide-and-conquer recursion.'
    },
    {
      q: 'Why can Binary Search NOT be used efficiently on a Singly Linked List?',
      a: 'Binary Search requires O(1) random memory indexing to calculate the midpoint element `arr[mid]`. Because a Singly Linked List only provides sequential pointers (`next`), finding the middle node requires traversing n/2 elements in O(n) time, destroying the logarithmic O(log n) efficiency advantage.'
    },
    {
      q: 'How are database operations separated from the DSA demonstration modules?',
      a: 'The SQLite database (`database.db`) is exclusively used for ACID-compliant persistent storage and CRUD. When a user requests a search or sort demonstration, the raw student data records are extracted into memory and processed by the manual DSA algorithms without relying on SQL `ORDER BY` or SQL `WHERE`.'
    },
    {
      q: 'What is the role of the `swapped` boolean flag in Bubble Sort?',
      a: 'In a standard Bubble Sort, nested loops execute in O(n²) time even if the input array is already sorted. By introducing a `swapped` flag that breaks out of the loop if no swaps occur during an entire pass, the best-case time complexity improves to O(n).'
    },
    {
      q: 'Explain the auxiliary space complexity difference between Bubble Sort and Merge Sort.',
      a: 'Bubble Sort sorts elements in-place with O(1) auxiliary memory. Merge Sort follows a divide-and-conquer approach that allocates temporary subarrays to merge the divided halves, requiring O(n) auxiliary memory.'
    }
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Overview Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
          <span>Capstone Project Documentation</span>
          <span aria-hidden="true">·</span>
          <span>Department of Computer Science & Engineering</span>
        </div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          Student Record Management System (DSA Capstone)
        </h1>
        <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed">
          An academic web application developed to bridge the gap between theoretical Data Structures & Algorithms and real-world database-driven software engineering.
        </p>
      </div>

      {/* Grid: Project Overview & DSA Concepts Used */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Project Overview */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-sky-600" />
            <span>Project Purpose & Architecture</span>
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            The primary goal of this capstone is to build a reliable student information platform while providing transparent visual instrumentation of manual DSA algorithms.
          </p>
          <div className="space-y-2 text-xs text-slate-700">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Full CRUD support with persistent SQLite storage</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Manual Singly Linked List with pointer visualizations</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Live comparison between Linear Search O(n) and Binary Search O(log n)</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Benchmarked Bubble Sort O(n²) vs Merge Sort O(n log n)</span>
            </div>
          </div>
        </div>

        {/* DSA Concepts Used */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-600" />
            <span>Approved DSA Concepts</span>
          </h2>
          <div className="space-y-2.5 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-900">1. Singly Linked List:</span>
              <p className="text-slate-600 text-[11px] mt-0.5">
                Dynamic node chaining via memory pointers (<code className="font-mono">head</code>, <code className="font-mono">node.next</code>, <code className="font-mono">NULL</code>).
              </p>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-900">2. Linear Search O(n):</span>
              <p className="text-slate-600 text-[11px] mt-0.5">
                Sequential comparison from index 0 to n-1 for unsorted student records.
              </p>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-900">3. Binary Search O(log n):</span>
              <p className="text-slate-600 text-[11px] mt-0.5">
                Midpoint divide-and-conquer arithmetic over records strictly sorted by Student ID.
              </p>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-900">4. Bubble Sort O(n²) &amp; Merge Sort O(n log n):</span>
              <p className="text-slate-600 text-[11px] mt-0.5">
                Pairwise in-place bubbling vs recursive sublist dividing and merging.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Technology Stack & Advantages */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Technology Stack */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Code2 className="w-4 h-4 text-amber-600" />
            <span>Technologies Employed</span>
          </h2>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="font-bold text-slate-800">Frontend</span>
              <p className="text-slate-500 text-[11px] mt-0.5">React 19, Tailwind CSS, Lucide</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="font-bold text-slate-800">Backend</span>
              <p className="text-slate-500 text-[11px] mt-0.5">Python 3.x, Flask, WSGI</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="font-bold text-slate-800">Database</span>
              <p className="text-slate-500 text-[11px] mt-0.5">SQLite 3 (database.db)</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="font-bold text-slate-800">DSA Layer</span>
              <p className="text-slate-500 text-[11px] mt-0.5">Manual Python/TypeScript modules</p>
            </div>
          </div>
        </div>

        {/* Future Scope */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-sky-600" />
            <span>Future Scope & Extensions</span>
          </h2>
          <ul className="space-y-2 text-xs text-slate-600">
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-sky-500" />
              <span>Automated Attendance tracking and semester attendance percentage calculation</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-sky-500" />
              <span>Internal assessment marks entry and grade point average calculator</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-sky-500" />
              <span>Automated PDF grade cards and transcript generation</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-sky-500" />
              <span>Role-based access control (RBAC) for Faculty, Students, and HOD</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-sky-500" />
              <span>Cloud deployment with automated database backups</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Viva Voce Questions & Answers Cheat Sheet */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-emerald-600" />
              <span>Viva Voce Preparation & Examiner Q&amp;A Cheat Sheet</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Anticipated technical questions commonly asked during college capstone defense.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {vivaQuestions.map((item, idx) => (
            <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
              <p className="text-xs font-bold text-slate-900">
                {idx + 1}. {item.q}
              </p>
              <p className="text-xs text-slate-700 leading-relaxed">
                <span className="font-semibold text-emerald-800">Answer:</span> {item.a}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Python Source Code Inspection Box */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Code2 className="w-4 h-4 text-slate-700" />
              <span>Python Flask &amp; DSA Backend Source Code Files</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Inspect or copy the Python source code files matching the college capstone specification.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Code'}</span>
            </button>
            <button
              onClick={onOpenPythonCode}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-xs"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Full Code Browser</span>
            </button>
          </div>
        </div>

        {/* File tabs */}
        <div className="flex items-center gap-1 p-2 bg-slate-100 border-b border-slate-200 overflow-x-auto text-xs">
          {PYTHON_CAPSTONE_FILES.map((f, i) => (
            <button
              key={f.filename}
              onClick={() => setSelectedFile(i)}
              className={`px-3 py-1.5 font-mono rounded-md whitespace-nowrap transition-colors ${
                selectedFile === i
                  ? 'bg-white text-slate-900 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              {f.filename}
            </button>
          ))}
        </div>

        {/* Code View */}
        <pre className="p-4 bg-slate-950 text-slate-200 font-mono text-xs overflow-x-auto max-h-80 leading-relaxed border-t border-slate-800">
          {file.code}
        </pre>
      </div>
    </div>
  );
};
