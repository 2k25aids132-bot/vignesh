import React from 'react';
import {
  ArrowLeft,
  Edit2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  Hash,
  GraduationCap,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { StudentRecord } from '../types/student';

interface StudentProfileViewProps {
  student: StudentRecord;
  onEdit: (student: StudentRecord) => void;
  onBack: () => void;
}

export const StudentProfileView: React.FC<StudentProfileViewProps> = ({
  student,
  onEdit,
  onBack
}) => {
  // Academic classification based on CGPA
  let classification = 'Pass';
  let classColor = 'text-slate-600 bg-slate-50 border-slate-200';
  if (student.cgpa >= 9.0) {
    classification = 'First Class with Distinction (Honors)';
    classColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
  } else if (student.cgpa >= 7.5) {
    classification = 'First Class';
    classColor = 'text-sky-700 bg-sky-50 border-sky-200';
  } else if (student.cgpa >= 6.0) {
    classification = 'Second Class';
    classColor = 'text-amber-700 bg-amber-50 border-amber-200';
  }

  // Initials for avatar
  const initials = student.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top action bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Records</span>
        </button>

        <button
          onClick={() => onEdit(student)}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-sky-600 rounded-lg hover:bg-sky-700 transition-colors shadow-xs"
        >
          <Edit2 className="w-3.5 h-3.5" />
          <span>Edit Profile</span>
        </button>
      </div>

      {/* Main Profile Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Banner with avatar */}
        <div className="bg-slate-900 px-8 py-6 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold text-xl font-mono shadow-md border-2 border-white/20">
              {initials}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight">{student.name}</h1>
                <span className="font-mono text-xs text-sky-300 bg-sky-950/80 px-2 py-0.5 rounded border border-sky-800">
                  ID: {student.student_id}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 flex items-center gap-2">
                <span>{student.department}</span>
                <span aria-hidden="true">·</span>
                <span>{student.year} (Section {student.section})</span>
              </p>
            </div>
          </div>

          <div className="bg-white/10 rounded-xl p-3 border border-white/10 text-right sm:text-right shrink-0">
            <p className="text-[10px] uppercase tracking-wider text-slate-300 font-semibold">Cumulative GPA</p>
            <p className="text-3xl font-bold font-mono text-sky-400 tabular-nums">
              {student.cgpa.toFixed(2)}
            </p>
            <span className="text-[10px] text-slate-300">Out of 10.00 Scale</span>
          </div>
        </div>

        {/* Status band */}
        <div className="px-8 py-3 bg-slate-50 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-500">Academic Standing:</span>
            <span className={`px-2.5 py-0.5 rounded-full font-medium border text-[11px] ${classColor}`}>
              {classification}
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-500 font-mono text-[11px]">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Enrolled: {student.created_at}</span>
            </span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>SQLite ID #{student.id}</span>
            </span>
          </div>
        </div>

        {/* Profile Details Grid */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Column 1: Academic & Institutional Info */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100">
              Academic & Enrollment Details
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-start justify-between py-1">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Hash className="w-3.5 h-3.5 text-slate-400" />
                  <span>Student ID</span>
                </span>
                <span className="font-mono font-bold text-slate-900">{student.student_id}</span>
              </div>

              <div className="flex items-start justify-between py-1 border-t border-slate-50">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                  <span>Department</span>
                </span>
                <span className="font-medium text-slate-900 text-right max-w-xs">{student.department}</span>
              </div>

              <div className="flex items-start justify-between py-1 border-t border-slate-50">
                <span className="text-slate-500">Year & Section</span>
                <span className="font-medium text-slate-900">{student.year} · Section {student.section}</span>
              </div>

              <div className="flex items-start justify-between py-1 border-t border-slate-50">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-slate-400" />
                  <span>CGPA</span>
                </span>
                <span className="font-mono font-bold text-sky-700">{student.cgpa.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Column 2: Personal & Contact Information */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100">
              Personal & Contact Information
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-start justify-between py-1">
                <span className="text-slate-500">Gender</span>
                <span className="font-medium text-slate-900">{student.gender}</span>
              </div>

              <div className="flex items-start justify-between py-1 border-t border-slate-50">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Date of Birth</span>
                </span>
                <span className="font-mono text-slate-900">{student.dob}</span>
              </div>

              <div className="flex items-start justify-between py-1 border-t border-slate-50">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>Academic Email</span>
                </span>
                <span className="font-mono text-slate-900">{student.email}</span>
              </div>

              <div className="flex items-start justify-between py-1 border-t border-slate-50">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>Phone Number</span>
                </span>
                <span className="font-mono text-slate-900">{student.phone}</span>
              </div>

              <div className="flex items-start justify-between py-1 border-t border-slate-50">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>Permanent Address</span>
                </span>
                <span className="text-slate-900 text-right max-w-xs">{student.address}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
