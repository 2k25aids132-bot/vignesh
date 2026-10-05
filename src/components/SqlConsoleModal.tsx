import React, { useState } from 'react';
import { Database, Terminal, RefreshCw, Copy, Check, ShieldCheck } from 'lucide-react';
import { Modal } from './Modal';
import { sqliteDb, SQLITE_DDL, SqlLogEntry } from '../db/sqliteSimulation';
import { StudentRecord } from '../types/student';

interface SqlConsoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataReset: () => void;
  students: StudentRecord[];
}

export const SqlConsoleModal: React.FC<SqlConsoleModalProps> = ({
  isOpen,
  onClose,
  onDataReset,
  students
}) => {
  const [activeTab, setActiveTab] = useState<'queries' | 'schema' | 'rawTable'>('queries');
  const [copied, setCopied] = useState(false);
  const logs = sqliteDb.getLogs();

  const handleCopySchema = () => {
    navigator.clipboard.writeText(SQLITE_DDL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="SQLite Database Console & Audit Log"
      size="xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>SQLite Engine Active · Storage: LocalStorage Persistent Relational Model</span>
          </div>
          <button
            onClick={() => {
              if (confirm('Reset SQLite database to original sample student records?')) {
                sqliteDb.resetToSample();
                onDataReset();
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reload Sample Records
          </button>
        </div>
      }
    >
      {/* Navigation tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 mb-4">
        <button
          onClick={() => setActiveTab('queries')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
            activeTab === 'queries'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          SQL Execution Log ({logs.length})
        </button>
        <button
          onClick={() => setActiveTab('schema')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
            activeTab === 'schema'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          SQLite Schema (DDL)
        </button>
        <button
          onClick={() => setActiveTab('rawTable')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
            activeTab === 'rawTable'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Raw Table Rows ({students.length})
        </button>
      </div>

      {/* Tab: Queries */}
      {activeTab === 'queries' && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Real-time audit log of SQLite statements triggered by user actions:</span>
            <button
              onClick={() => sqliteDb.clearLogs()}
              className="text-xs text-slate-500 hover:text-slate-800 underline"
            >
              Clear Log
            </button>
          </div>
          <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
            {logs.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-8">No SQL queries executed yet.</p>
            ) : (
              logs.map((log: SqlLogEntry) => (
                <div
                  key={log.id}
                  className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-slate-200 font-mono text-xs"
                >
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1 border-b border-slate-800 pb-1">
                    <span className="flex items-center gap-2">
                      <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                        log.operation === 'INSERT' ? 'bg-emerald-900/60 text-emerald-300' :
                        log.operation === 'DELETE' ? 'bg-rose-900/60 text-rose-300' :
                        log.operation === 'UPDATE' ? 'bg-amber-900/60 text-amber-300' :
                        'bg-sky-900/60 text-sky-300'
                      }`}>
                        {log.operation}
                      </span>
                      <span>{log.timestamp}</span>
                    </span>
                    <span className="text-slate-400">
                      {log.rowsAffected} row(s) affected · {log.status}
                    </span>
                  </div>
                  <pre className="overflow-x-auto whitespace-pre-wrap text-emerald-400 mt-1">
                    {log.query}
                  </pre>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab: Schema */}
      {activeTab === 'schema' && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-600 font-medium">SQLite Table Definition (database.db):</span>
            <button
              onClick={handleCopySchema}
              className="flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy DDL'}</span>
            </button>
          </div>
          <pre className="p-4 bg-slate-950 text-slate-200 rounded-lg font-mono text-xs overflow-x-auto border border-slate-800 leading-relaxed">
            {SQLITE_DDL}
          </pre>
        </div>
      )}

      {/* Tab: Raw Table */}
      {activeTab === 'rawTable' && (
        <div className="overflow-x-auto max-h-[50vh] border border-slate-200 rounded-lg">
          <table className="w-full text-left text-xs border-collapse font-mono">
            <thead className="bg-slate-100 text-slate-700 uppercase tracking-wider text-[10px] sticky top-0">
              <tr>
                <th className="p-2.5 border-b">id</th>
                <th className="p-2.5 border-b">student_id</th>
                <th className="p-2.5 border-b">name</th>
                <th className="p-2.5 border-b">gender</th>
                <th className="p-2.5 border-b">department</th>
                <th className="p-2.5 border-b">year</th>
                <th className="p-2.5 border-b">cgpa</th>
                <th className="p-2.5 border-b">email</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {students.map(s => (
                <tr key={s.id} className="hover:bg-slate-50">
                  <td className="p-2.5 text-slate-500">{s.id}</td>
                  <td className="p-2.5 font-bold text-slate-900">{s.student_id}</td>
                  <td className="p-2.5 text-slate-800">{s.name}</td>
                  <td className="p-2.5 text-slate-600">{s.gender}</td>
                  <td className="p-2.5 text-slate-600">{s.department}</td>
                  <td className="p-2.5 text-slate-600">{s.year}</td>
                  <td className="p-2.5 font-bold text-sky-700">{s.cgpa.toFixed(2)}</td>
                  <td className="p-2.5 text-slate-500 truncate max-w-[140px]">{s.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Modal>
  );
};
