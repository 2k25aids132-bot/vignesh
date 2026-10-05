import React, { useState } from 'react';
import {
  Save,
  ArrowLeft,
  AlertCircle,
  Database,
  Hash,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award
} from 'lucide-react';
import { StudentRecord } from '../types/student';
import { DEPARTMENTS, YEARS, SECTIONS } from '../db/initialData';

interface EditStudentViewProps {
  student: StudentRecord;
  onUpdateStudent: (id: number, data: Omit<StudentRecord, 'id' | 'created_at'>) => { success: boolean; error?: string };
  onCancel: () => void;
  existingStudentIds: number[];
}

export const EditStudentView: React.FC<EditStudentViewProps> = ({
  student,
  onUpdateStudent,
  onCancel,
  existingStudentIds
}) => {
  const [formData, setFormData] = useState({
    student_id: student.student_id.toString(),
    name: student.name,
    gender: student.gender,
    dob: student.dob,
    department: student.department,
    year: student.year,
    section: student.section,
    email: student.email,
    phone: student.phone,
    address: student.address,
    cgpa: student.cgpa.toFixed(2)
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [serverError, setServerError] = useState<string | null>(null);

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    const numId = parseInt(formData.student_id, 10);
    if (!formData.student_id.trim()) {
      newErrors.student_id = 'Student ID is required.';
    } else if (isNaN(numId) || numId <= 0) {
      newErrors.student_id = 'Student ID must be a positive integer.';
    } else if (numId !== student.student_id && existingStudentIds.includes(numId)) {
      newErrors.student_id = `Student ID ${numId} is already in use by another record.`;
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required.';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    const phoneClean = formData.phone.trim().replace(/\D/g, '');
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required.';
    } else if (phoneClean.length < 10) {
      newErrors.phone = 'Phone number must have at least 10 digits.';
    }

    const numCgpa = parseFloat(formData.cgpa);
    if (isNaN(numCgpa)) {
      newErrors.cgpa = 'CGPA must be a valid number.';
    } else if (numCgpa < 0.0 || numCgpa > 10.0) {
      newErrors.cgpa = 'CGPA must be strictly between 0.00 and 10.00.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validate()) {
      return;
    }

    const payload = {
      student_id: parseInt(formData.student_id, 10),
      name: formData.name.trim(),
      gender: formData.gender,
      dob: formData.dob,
      department: formData.department,
      year: formData.year,
      section: formData.section,
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.trim(),
      address: formData.address.trim(),
      cgpa: parseFloat(parseFloat(formData.cgpa).toFixed(2))
    };

    const res = onUpdateStudent(student.id, payload);
    if (!res.success) {
      setServerError(res.error || 'Failed to update record in SQLite.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={onCancel}
          className="flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Records</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
          <Database className="w-3.5 h-3.5 text-emerald-600" />
          <span>Updating SQLite Record ID #{student.id}</span>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-base font-bold text-slate-900">
            Edit Student: {student.name} ({student.student_id})
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Modify the record fields below. Changes will be saved directly into SQLite.
          </p>
        </div>

        {serverError && (
          <div className="mx-6 mt-6 p-4 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Update Failed</p>
              <p className="mt-0.5">{serverError}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Student ID */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Student ID *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Hash className="w-3.5 h-3.5" />
                </div>
                <input
                  type="number"
                  value={formData.student_id}
                  onChange={e => setFormData({ ...formData, student_id: e.target.value })}
                  className={`block w-full pl-9 pr-3 py-2 text-xs font-mono border rounded-lg focus:ring-2 focus:ring-sky-500 bg-white ${
                    errors.student_id ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                  }`}
                />
              </div>
              {errors.student_id && <p className="text-[11px] text-rose-600 mt-1">{errors.student_id}</p>}
            </div>

            {/* Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Name *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-3.5 h-3.5" />
                </div>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className={`block w-full pl-9 pr-3 py-2 text-xs border rounded-lg focus:ring-2 focus:ring-sky-500 bg-white ${
                    errors.name ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                  }`}
                />
              </div>
              {errors.name && <p className="text-[11px] text-rose-600 mt-1">{errors.name}</p>}
            </div>

            {/* Gender */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Gender *
              </label>
              <select
                value={formData.gender}
                onChange={e => setFormData({ ...formData, gender: e.target.value as any })}
                className="block w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 bg-white text-slate-800"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Department */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Department *
              </label>
              <select
                value={formData.department}
                onChange={e => setFormData({ ...formData, department: e.target.value })}
                className="block w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 bg-white text-slate-800"
              >
                {DEPARTMENTS.map(dept => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            {/* Year */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Academic Year *
              </label>
              <select
                value={formData.year}
                onChange={e => setFormData({ ...formData, year: e.target.value as any })}
                className="block w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 bg-white text-slate-800"
              >
                {YEARS.map(y => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            {/* Section */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Section *
              </label>
              <select
                value={formData.section}
                onChange={e => setFormData({ ...formData, section: e.target.value as any })}
                className="block w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 bg-white text-slate-800"
              >
                {SECTIONS.map(s => (
                  <option key={s} value={s}>
                    Section {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* CGPA */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                CGPA (0.00 - 10.00) *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Award className="w-3.5 h-3.5" />
                </div>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  value={formData.cgpa}
                  onChange={e => setFormData({ ...formData, cgpa: e.target.value })}
                  className={`block w-full pl-9 pr-3 py-2 text-xs font-mono font-bold border rounded-lg focus:ring-2 focus:ring-sky-500 bg-white ${
                    errors.cgpa ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                  }`}
                />
              </div>
              {errors.cgpa && <p className="text-[11px] text-rose-600 mt-1">{errors.cgpa}</p>}
            </div>

            {/* DOB */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Date of Birth *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Calendar className="w-3.5 h-3.5" />
                </div>
                <input
                  type="date"
                  value={formData.dob}
                  onChange={e => setFormData({ ...formData, dob: e.target.value })}
                  className="block w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 bg-white text-slate-800"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Contact Phone *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Phone className="w-3.5 h-3.5" />
                </div>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className={`block w-full pl-9 pr-3 py-2 text-xs border rounded-lg focus:ring-2 focus:ring-sky-500 bg-white ${
                    errors.phone ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                  }`}
                />
              </div>
              {errors.phone && <p className="text-[11px] text-rose-600 mt-1">{errors.phone}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Academic Email Address *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-3.5 h-3.5" />
                </div>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className={`block w-full pl-9 pr-3 py-2 text-xs font-mono border rounded-lg focus:ring-2 focus:ring-sky-500 bg-white ${
                    errors.email ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                  }`}
                />
              </div>
              {errors.email && <p className="text-[11px] text-rose-600 mt-1">{errors.email}</p>}
            </div>

            {/* Address */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Residential Address *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <input
                  type="text"
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  className="block w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 bg-white text-slate-800"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-sky-600 rounded-lg hover:bg-sky-700 transition-colors shadow-xs"
            >
              <Save className="w-4 h-4" />
              <span>Update SQLite Record</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
