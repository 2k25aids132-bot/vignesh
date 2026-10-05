import React, { useState, useMemo } from 'react';
import {
  Network,
  Plus,
  Trash2,
  Search,
  RotateCcw,
  ArrowRight,
  Info,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Play
} from 'lucide-react';
import { StudentRecord, LinkedListNodeData } from '../types/student';
import { StudentLinkedList, LinkedListTraceStep } from '../dsa/linkedList';

interface DsaLabViewProps {
  students: StudentRecord[];
}

export const DsaLabView: React.FC<DsaLabViewProps> = ({ students }) => {
  // Initialize linked list from current students (taking first 6-8 for clear visual presentation)
  const [linkedList] = useState<StudentLinkedList>(() => {
    const list = new StudentLinkedList();
    const initialSlice = students.slice(0, 6).map(s => ({
      id: s.id,
      student_id: s.student_id,
      name: s.name,
      department: s.department,
      cgpa: s.cgpa
    }));
    list.populateFromArray(initialSlice);
    return list;
  });

  // State triggers to force re-render when list changes
  const [listVersion, setListVersion] = useState(0);
  const [lastActionLog, setLastActionLog] = useState<LinkedListTraceStep[]>([]);
  const [actionTitle, setActionTitle] = useState<string>('Linked List initialized with sample student nodes');

  // Input forms
  const [insertMode, setInsertMode] = useState<'head' | 'tail' | 'position'>('head');
  const [insertId, setInsertId] = useState('115');
  const [insertName, setInsertName] = useState('Siddharth Rao');
  const [insertDept, setInsertDept] = useState('Computer Science');
  const [insertCgpa, setInsertCgpa] = useState('9.10');
  const [insertPosition, setInsertPosition] = useState('1');

  const [deleteId, setDeleteId] = useState('102');
  const [searchId, setSearchId] = useState('103');

  // Active highlighted node during search or traversal
  const [highlightedNodeId, setHighlightedNodeId] = useState<number | null>(null);

  // Get current node array
  const currentNodes = useMemo(() => {
    // Reference listVersion to update on change
    if (listVersion < 0) return [];
    return linkedList.toArray();
  }, [linkedList, listVersion]);

  // Insert Handler
  const handleInsert = (e: React.FormEvent) => {
    e.preventDefault();
    const sId = parseInt(insertId.trim(), 10);
    const cg = parseFloat(insertCgpa.trim()) || 8.0;

    if (isNaN(sId) || !insertName.trim()) {
      alert('Please provide valid Student ID and Name.');
      return;
    }

    const nodeData: LinkedListNodeData = {
      id: Date.now(),
      student_id: sId,
      name: insertName.trim(),
      department: insertDept,
      cgpa: cg
    };

    if (insertMode === 'head') {
      const res = linkedList.insertAtHead(nodeData);
      setLastActionLog(res.steps);
      setActionTitle(`Inserted Node [${sId} ${nodeData.name}] at HEAD (O(1))`);
    } else if (insertMode === 'tail') {
      const res = linkedList.insertAtTail(nodeData);
      setLastActionLog(res.steps);
      setActionTitle(`Inserted Node [${sId} ${nodeData.name}] at TAIL (O(n))`);
    } else {
      const pos = parseInt(insertPosition, 10);
      const res = linkedList.insertAtPosition(nodeData, isNaN(pos) ? 0 : pos);
      setLastActionLog(res.steps);
      setActionTitle(`Inserted Node [${sId} ${nodeData.name}] at Position ${pos}`);
    }

    setHighlightedNodeId(sId);
    setTimeout(() => setHighlightedNodeId(null), 3000);
    setListVersion(v => v + 1);
  };

  // Delete Handler
  const handleDelete = (e: React.FormEvent) => {
    e.preventDefault();
    const sId = parseInt(deleteId.trim(), 10);
    if (isNaN(sId)) return;

    const res = linkedList.deleteById(sId);
    setLastActionLog(res.steps);
    setActionTitle(
      res.success
        ? `Deleted Node [${sId}] from Linked List (O(n))`
        : `Deletion Failed: Node [${sId}] not found in Linked List`
    );
    setHighlightedNodeId(null);
    setListVersion(v => v + 1);
  };

  // Search Handler
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const sId = parseInt(searchId.trim(), 10);
    if (isNaN(sId)) return;

    const res = linkedList.searchById(sId);
    setLastActionLog(res.steps);
    setActionTitle(
      res.found
        ? `Search Found: Node [${sId} ${res.node?.name}] in ${res.comparisons} pointer hops (O(n))`
        : `Search Completed: Node [${sId}] not in Linked List after ${res.comparisons} comparisons`
    );

    if (res.found) {
      setHighlightedNodeId(sId);
      setTimeout(() => setHighlightedNodeId(null), 4000);
    } else {
      setHighlightedNodeId(null);
    }
  };

  // Display Traversal
  const handleTraverse = () => {
    let current = linkedList.head;
    const steps: LinkedListTraceStep[] = [];
    let count = 0;

    steps.push({
      stepNumber: 1,
      action: 'traverse',
      currentNodeId: null,
      pointerDesc: `Starting pointer traversal at HEAD -> ${current ? current.data.student_id : 'NULL'}.`,
      listSnapshot: linkedList.toArray().map(d => ({ student_id: d.student_id, name: d.name }))
    });

    while (current !== null) {
      count++;
      steps.push({
        stepNumber: count + 1,
        action: 'traverse',
        currentNodeId: current.data.student_id,
        pointerDesc: `Traversing node ${count}: ID = ${current.data.student_id}, Name = "${current.data.name}". Next pointer -> ${current.next ? current.next.data.student_id : 'NULL'}.`,
        listSnapshot: linkedList.toArray().map(d => ({ student_id: d.student_id, name: d.name }))
      });
      current = current.next;
    }

    setLastActionLog(steps);
    setActionTitle(`Completed full traversal: Visited ${count} student node(s) (O(n))`);
  };

  // Reset List
  const handleReset = () => {
    const initialSlice = students.slice(0, 6).map(s => ({
      id: s.id,
      student_id: s.student_id,
      name: s.name,
      department: s.department,
      cgpa: s.cgpa
    }));
    linkedList.populateFromArray(initialSlice);
    setLastActionLog([
      {
        stepNumber: 1,
        action: 'insert',
        currentNodeId: null,
        pointerDesc: `Reset Singly Linked List with ${initialSlice.length} initial student nodes.`,
        listSnapshot: initialSlice.map(d => ({ student_id: d.student_id, name: d.name }))
      }
    ]);
    setActionTitle('Reset Linked List to initial 6 student records');
    setHighlightedNodeId(null);
    setListVersion(v => v + 1);
  };

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <span>DSA Module 03</span>
              <span aria-hidden="true">·</span>
              <span>Data Structure Lab</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Singly Linked List Interactive Visualizer
            </h1>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
              A dynamic linear data structure composed of discrete nodes chained via pointers. Each node contains Student Data and a Next reference pointer. Demonstrates pure pointer manipulation without stacks, queues, or hash maps.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleTraverse}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-xs"
            >
              <Play className="w-3.5 h-3.5 text-sky-600" />
              <span>Display / Traverse</span>
            </button>
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset List</span>
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Visual Chain Representation */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 shadow-md text-white space-y-6 overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Network className="w-4 h-4 text-sky-400" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Live Memory Node Graph
            </h2>
          </div>
          <div className="flex items-center gap-3 font-mono text-xs text-slate-400">
            <span>Size: <strong className="text-white">{currentNodes.length}</strong> nodes</span>
            <span>·</span>
            <span>Head: <strong className="text-sky-400">{currentNodes.length > 0 ? currentNodes[0].student_id : 'NULL'}</strong></span>
          </div>
        </div>

        {/* Node Pointer Visual Chain */}
        <div className="overflow-x-auto py-6 px-2">
          <div className="flex items-center min-w-max gap-3">
            {/* HEAD Pointer Tag */}
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-mono font-bold text-sky-400 uppercase tracking-widest mb-1">
                Pointer
              </span>
              <div className="px-3 py-2 rounded-lg bg-sky-950 border border-sky-600 text-sky-300 font-mono text-xs font-bold shadow-md">
                HEAD
              </div>
            </div>

            {/* Initial Pointer Arrow */}
            <div className="flex items-center text-sky-400">
              <ArrowRight className="w-5 h-5 stroke-[2.5]" />
            </div>

            {/* List Nodes */}
            {currentNodes.length === 0 ? (
              <div className="px-6 py-4 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-400 font-mono text-xs">
                List is Empty (HEAD points to NULL)
              </div>
            ) : (
              currentNodes.map((node, index) => {
                const isHighlighted = highlightedNodeId === node.student_id;

                return (
                  <React.Fragment key={node.student_id}>
                    {/* The Node Box */}
                    <div
                      className={`rounded-xl border transition-all duration-300 shadow-md ${
                        isHighlighted
                          ? 'border-emerald-400 bg-emerald-950/60 ring-2 ring-emerald-500 scale-105'
                          : 'border-slate-700 bg-slate-800/90'
                      }`}
                    >
                      {/* Node Header */}
                      <div className="px-3 py-1.5 bg-slate-750 border-b border-slate-700/80 rounded-t-xl flex items-center justify-between text-[10px] font-mono text-slate-400">
                        <span>Node [{index}]</span>
                        <span className="text-slate-300 font-semibold">{node.department.split(' ')[0]}</span>
                      </div>

                      {/* Node Body: Data Block + Pointer Block */}
                      <div className="p-3 flex items-center gap-3">
                        {/* Data Partition */}
                        <div className="space-y-0.5 min-w-[110px]">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] text-slate-400 uppercase font-mono">ID:</span>
                            <span className="font-mono font-bold text-white text-sm">
                              {node.student_id}
                            </span>
                          </div>
                          <p className="text-xs font-medium text-slate-200 truncate max-w-[120px]">
                            {node.name}
                          </p>
                          <p className="text-[11px] font-mono text-sky-400">
                            CGPA {node.cgpa.toFixed(2)}
                          </p>
                        </div>

                        {/* Divider between Data and Pointer */}
                        <div className="w-px h-10 bg-slate-700" />

                        {/* Pointer Partition */}
                        <div className="text-center px-1">
                          <span className="text-[9px] uppercase font-mono text-slate-400 block">
                            *next
                          </span>
                          <span className="text-[11px] font-mono font-bold text-sky-400">
                            {index < currentNodes.length - 1 ? currentNodes[index + 1].student_id : 'NULL'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Arrow to Next Node */}
                    <div className="flex items-center text-slate-500">
                      <ArrowRight className="w-5 h-5 stroke-[2]" />
                    </div>
                  </React.Fragment>
                );
              })
            )}

            {/* NULL Terminator */}
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-1">
                Terminator
              </span>
              <div className="px-3 py-2 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-300 font-mono text-xs font-bold shadow-md">
                NULL
              </div>
            </div>
          </div>
        </div>

        {/* Action Title / Status */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
          <span className="text-emerald-400 font-mono flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{actionTitle}</span>
          </span>
          <span className="text-slate-500 font-mono text-[11px]">
            Pointer integrity verified
          </span>
        </div>
      </div>

      {/* Control Panels: Insert, Delete, Search */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Panel 1: Insert Node */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5 text-sky-600" />
              <span>Insert Node</span>
            </h3>
            <span className="text-[10px] font-mono text-slate-500">O(1) Head / O(n) Tail</span>
          </div>

          <form onSubmit={handleInsert} className="space-y-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Insertion Strategy
              </label>
              <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-lg text-xs">
                <button
                  type="button"
                  onClick={() => setInsertMode('head')}
                  className={`py-1 rounded font-medium transition-colors ${
                    insertMode === 'head' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Head O(1)
                </button>
                <button
                  type="button"
                  onClick={() => setInsertMode('tail')}
                  className={`py-1 rounded font-medium transition-colors ${
                    insertMode === 'tail' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Tail O(n)
                </button>
                <button
                  type="button"
                  onClick={() => setInsertMode('position')}
                  className={`py-1 rounded font-medium transition-colors ${
                    insertMode === 'position' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Position
                </button>
              </div>
            </div>

            {insertMode === 'position' && (
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  0-based Position Index
                </label>
                <input
                  type="number"
                  min="0"
                  max={currentNodes.length}
                  value={insertPosition}
                  onChange={e => setInsertPosition(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs font-mono border border-slate-300 rounded-lg bg-white"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Student ID
                </label>
                <input
                  type="number"
                  value={insertId}
                  onChange={e => setInsertId(e.target.value)}
                  placeholder="115"
                  className="w-full px-2.5 py-1.5 text-xs font-mono border border-slate-300 rounded-lg bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  CGPA
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={insertCgpa}
                  onChange={e => setInsertCgpa(e.target.value)}
                  placeholder="9.10"
                  className="w-full px-2.5 py-1.5 text-xs font-mono border border-slate-300 rounded-lg bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Student Name
              </label>
              <input
                type="text"
                value={insertName}
                onChange={e => setInsertName(e.target.value)}
                placeholder="Student Name"
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 px-3 text-xs font-semibold text-white bg-sky-600 rounded-lg hover:bg-sky-700 transition-colors shadow-xs"
            >
              Insert into Linked List
            </button>
          </form>
        </div>

        {/* Panel 2: Delete Node */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Trash2 className="w-3.5 h-3.5 text-rose-600" />
              <span>Delete Node</span>
            </h3>
            <span className="text-[10px] font-mono text-slate-500">O(n) by ID</span>
          </div>

          <p className="text-xs text-slate-500">
            Traverses the chain with <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">prev</code> and <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">curr</code> pointers and relinks: <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">prev.next = curr.next</code>.
          </p>

          <form onSubmit={handleDelete} className="space-y-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Target Student ID to Delete
              </label>
              <input
                type="number"
                value={deleteId}
                onChange={e => setDeleteId(e.target.value)}
                placeholder="e.g. 102"
                className="w-full px-2.5 py-1.5 text-xs font-mono border border-slate-300 rounded-lg bg-white"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 px-3 text-xs font-semibold text-white bg-rose-600 rounded-lg hover:bg-rose-700 transition-colors shadow-xs"
            >
              Unlink & Delete Node
            </button>
          </form>
        </div>

        {/* Panel 3: Search Node */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-indigo-600" />
              <span>Search Node</span>
            </h3>
            <span className="text-[10px] font-mono text-slate-500">O(n) Sequential</span>
          </div>

          <p className="text-xs text-slate-500">
            Traverses pointer chain starting from HEAD, comparing each node&apos;s data until found or NULL.
          </p>

          <form onSubmit={handleSearch} className="space-y-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Student ID to Search
              </label>
              <input
                type="number"
                value={searchId}
                onChange={e => setSearchId(e.target.value)}
                placeholder="e.g. 103"
                className="w-full px-2.5 py-1.5 text-xs font-mono border border-slate-300 rounded-lg bg-white"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 px-3 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-xs"
            >
              Search Node by ID
            </button>
          </form>
        </div>
      </div>

      {/* Real-time Pointer Trace Log */}
      {lastActionLog.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Step-by-Step Pointer Execution Log
            </h3>
            <span className="text-xs font-mono text-slate-500">
              {lastActionLog.length} pointer operations logged
            </span>
          </div>

          <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto">
            {lastActionLog.map(step => (
              <div key={step.stepNumber} className="px-6 py-3 text-xs font-mono flex items-start gap-3">
                <span className="text-slate-400 font-bold shrink-0">#{step.stepNumber}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold shrink-0 ${
                  step.action === 'insert' ? 'bg-sky-100 text-sky-800' :
                  step.action === 'delete' ? 'bg-rose-100 text-rose-800' :
                  step.action === 'found' ? 'bg-emerald-100 text-emerald-800' :
                  'bg-slate-100 text-slate-600'
                }`}>
                  {step.action}
                </span>
                <span className="text-slate-700 font-sans text-xs leading-relaxed">
                  {step.pointerDesc}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Theoretical Viva Explanations Section */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
          DSA Theory & Viva Conceptual Notes: Singly Linked List
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-xs">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
            <p className="font-bold text-slate-900">Node</p>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              The fundamental building block containing the Student Data cargo and a pointer address reference to the next node.
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
            <p className="font-bold text-slate-900">Data Cargo</p>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              Stores verified student entity fields: Student ID, Name, Department, and CGPA.
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
            <p className="font-bold text-slate-900">Next Pointer (*next)</p>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              Memory reference pointing directly to the succeeding StudentNode in heap space.
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
            <p className="font-bold text-slate-900">HEAD Pointer</p>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              Entry point to the linked list. If HEAD == NULL, the list is recognized as empty.
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
            <p className="font-bold text-slate-900">NULL</p>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              Sentinel reference terminating the chain, indicating no further nodes exist.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
