import React, { useState } from 'react';
import { Code2, Copy, Check, Download, FileText, CheckCircle2 } from 'lucide-react';
import { Modal } from './Modal';
import { PYTHON_CAPSTONE_FILES } from '../python_files/pythonSources';

interface PythonCodeViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PythonCodeViewerModal: React.FC<PythonCodeViewerModalProps> = ({
  isOpen,
  onClose
}) => {
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const currentFile = PYTHON_CAPSTONE_FILES[selectedFileIndex];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([currentFile.code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = currentFile.filename.split('/').pop() || currentFile.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Python Flask & DSA Backend Source Code (For College Viva)"
      size="xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Strict DSA Compliance: Pure manual implementations (No hash tables, stacks, queues, or sort() built-ins)</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy File'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              Download {currentFile.filename.split('/').pop()}
            </button>
          </div>
        </div>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* File List Navigation */}
        <div className="md:col-span-1 border-r border-slate-100 pr-2 space-y-1">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
            Project Files
          </p>
          {PYTHON_CAPSTONE_FILES.map((file, idx) => (
            <button
              key={file.filename}
              onClick={() => setSelectedFileIndex(idx)}
              className={`w-full text-left px-2.5 py-2 rounded-lg text-xs font-mono transition-colors flex items-center justify-between ${
                selectedFileIndex === idx
                  ? 'bg-sky-50 text-sky-950 font-semibold border-l-2 border-sky-600'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-1.5 truncate">
                <FileText className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                <span className="truncate">{file.filename}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Code Content */}
        <div className="md:col-span-3 min-w-0">
          <div className="flex items-center justify-between bg-slate-100 px-3 py-2 rounded-t-lg border-b border-slate-200">
            <div>
              <span className="font-mono text-xs font-bold text-slate-800">{currentFile.filename}</span>
              <span className="text-[11px] text-slate-500 ml-2">({currentFile.category})</span>
            </div>
            <p className="text-xs text-slate-500 truncate max-w-xs">{currentFile.description}</p>
          </div>

          <pre className="p-4 bg-slate-950 text-slate-200 font-mono text-xs overflow-x-auto rounded-b-lg border border-slate-800 max-h-[50vh] leading-relaxed select-all">
            {currentFile.code}
          </pre>
        </div>
      </div>
    </Modal>
  );
};
