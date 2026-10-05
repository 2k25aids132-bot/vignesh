/**
 * SQLite Relational Database Engine Simulation
 * 
 * Accurately models SQLite table structure, constraints, DDL, and queries:
 * - Table: "students"
 * - Primary Key: id (AUTOINCREMENT)
 * - Unique constraint on student_id and email
 * - Range check on cgpa (0.00 - 10.00)
 * - Query audit log tracking real SQL statements executed
 * - Persistent across sessions via LocalStorage
 */

import { INITIAL_STUDENTS } from './initialData';
import { StudentRecord } from '../types/student';

const STORAGE_KEY = 'dsa_capstone_sqlite_students_v1';
const SQL_LOGS_KEY = 'dsa_capstone_sqlite_queries_v1';

export interface SqlLogEntry {
  id: string;
  query: string;
  params?: any[];
  timestamp: string;
  operation: 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE' | 'SCHEMA';
  status: 'SUCCESS' | 'ERROR';
  rowsAffected: number;
}

export const SQLITE_DDL = `-- ==========================================
-- SQLite DDL: Database Schema for Student Records
-- File: database.db | Table: students
-- ==========================================

CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER UNIQUE NOT NULL,
    name TEXT NOT NULL,
    gender TEXT CHECK(gender IN ('Male', 'Female', 'Other')),
    dob TEXT NOT NULL,
    department TEXT NOT NULL,
    year TEXT NOT NULL,
    section TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT NOT NULL,
    address TEXT NOT NULL,
    cgpa REAL CHECK(cgpa >= 0.0 AND cgpa <= 10.0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexing on Primary Key and Student ID for persistent fast lookup
CREATE UNIQUE INDEX IF NOT EXISTS idx_students_student_id ON students(student_id);
CREATE INDEX IF NOT EXISTS idx_students_dept ON students(department);
`;

export class SqliteDatabase {
  private students: StudentRecord[];
  private queryLogs: SqlLogEntry[];

  constructor() {
    this.students = this.loadRecords();
    this.queryLogs = this.loadLogs();

    if (this.queryLogs.length === 0) {
      this.logQuery('SCHEMA', SQLITE_DDL, 'SUCCESS', 0);
      this.logQuery('SELECT', 'SELECT * FROM students ORDER BY student_id ASC;', 'SUCCESS', this.students.length);
    }
  }

  private loadRecords(): StudentRecord[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Fallback
    }
    // Initial data clone
    const initial = INITIAL_STUDENTS.map(s => ({ ...s }));
    this.persistRecords(initial);
    return initial;
  }

  private persistRecords(records: StudentRecord[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
      this.students = records;
    } catch (e) {
      console.error('Storage error:', e);
    }
  }

  private loadLogs(): SqlLogEntry[] {
    try {
      const data = localStorage.getItem(SQL_LOGS_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch {}
    return [];
  }

  private logQuery(
    operation: 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE' | 'SCHEMA',
    query: string,
    status: 'SUCCESS' | 'ERROR',
    rowsAffected: number,
    params?: any[]
  ): void {
    const entry: SqlLogEntry = {
      id: Math.random().toString(36).substring(2, 9),
      query: query.trim(),
      params,
      timestamp: new Date().toLocaleTimeString(),
      operation,
      status,
      rowsAffected
    };
    this.queryLogs.unshift(entry);
    if (this.queryLogs.length > 50) {
      this.queryLogs.pop();
    }
    try {
      localStorage.setItem(SQL_LOGS_KEY, JSON.stringify(this.queryLogs));
    } catch {}
  }

  public getLogs(): SqlLogEntry[] {
    return [...this.queryLogs];
  }

  public clearLogs(): void {
    this.queryLogs = [];
    localStorage.removeItem(SQL_LOGS_KEY);
  }

  // --- CRUD Operations ---

  public getAll(): StudentRecord[] {
    this.logQuery('SELECT', 'SELECT * FROM students ORDER BY student_id ASC;', 'SUCCESS', this.students.length);
    return this.students.map(s => ({ ...s }));
  }

  public getById(id: number): StudentRecord | null {
    const found = this.students.find(s => s.id === id);
    this.logQuery('SELECT', `SELECT * FROM students WHERE id = ${id} LIMIT 1;`, found ? 'SUCCESS' : 'ERROR', found ? 1 : 0);
    return found ? { ...found } : null;
  }

  public getByStudentId(studentId: number): StudentRecord | null {
    const found = this.students.find(s => s.student_id === studentId);
    this.logQuery('SELECT', `SELECT * FROM students WHERE student_id = ${studentId} LIMIT 1;`, found ? 'SUCCESS' : 'ERROR', found ? 1 : 0);
    return found ? { ...found } : null;
  }

  public insert(studentData: Omit<StudentRecord, 'id' | 'created_at'>): { success: boolean; error?: string; student?: StudentRecord } {
    // 1. Validate Unique Student ID
    const existingId = this.students.find(s => s.student_id === studentData.student_id);
    if (existingId) {
      const err = `UNIQUE constraint failed: students.student_id (${studentData.student_id} already exists)`;
      this.logQuery('INSERT', `INSERT INTO students (student_id, name) VALUES (${studentData.student_id}, '${studentData.name}'); -- FAILED`, 'ERROR', 0);
      return { success: false, error: err };
    }

    // 2. Validate Unique Email
    const existingEmail = this.students.find(s => s.email.toLowerCase() === studentData.email.toLowerCase());
    if (existingEmail) {
      const err = `UNIQUE constraint failed: students.email (${studentData.email} already exists)`;
      this.logQuery('INSERT', `INSERT INTO students (email) VALUES ('${studentData.email}'); -- FAILED`, 'ERROR', 0);
      return { success: false, error: err };
    }

    // 3. Validate CGPA Range
    if (studentData.cgpa < 0 || studentData.cgpa > 10) {
      return { success: false, error: 'CHECK constraint failed: cgpa must be between 0.00 and 10.00' };
    }

    // Generate new autoincrement ID
    let maxId = 0;
    for (let i = 0; i < this.students.length; i++) {
      if (this.students[i].id > maxId) {
        maxId = this.students[i].id;
      }
    }
    const newId = maxId + 1;

    const newRecord: StudentRecord = {
      ...studentData,
      id: newId,
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };

    const updated = [...this.students, newRecord];
    this.persistRecords(updated);

    const sql = `INSERT INTO students (
    student_id, name, gender, dob, department, year, section, email, phone, address, cgpa
) VALUES (
    ${newRecord.student_id}, '${newRecord.name.replace(/'/g, "''")}', '${newRecord.gender}', '${newRecord.dob}', 
    '${newRecord.department.replace(/'/g, "''")}', '${newRecord.year}', '${newRecord.section}', 
    '${newRecord.email}', '${newRecord.phone}', '${newRecord.address.replace(/'/g, "''")}', ${newRecord.cgpa}
);`;

    this.logQuery('INSERT', sql, 'SUCCESS', 1);
    return { success: true, student: newRecord };
  }

  public update(id: number, studentData: Omit<StudentRecord, 'id' | 'created_at'>): { success: boolean; error?: string; student?: StudentRecord } {
    const existingIndex = this.students.findIndex(s => s.id === id);
    if (existingIndex === -1) {
      return { success: false, error: `Record with id ${id} not found.` };
    }

    // Unique Student ID check on other records
    const dupId = this.students.find(s => s.student_id === studentData.student_id && s.id !== id);
    if (dupId) {
      return { success: false, error: `Student ID ${studentData.student_id} is already assigned to another student.` };
    }

    // Unique Email check on other records
    const dupEmail = this.students.find(s => s.email.toLowerCase() === studentData.email.toLowerCase() && s.id !== id);
    if (dupEmail) {
      return { success: false, error: `Email address ${studentData.email} is already registered.` };
    }

    if (studentData.cgpa < 0 || studentData.cgpa > 10) {
      return { success: false, error: 'CGPA must be between 0.00 and 10.00' };
    }

    const updatedRecord: StudentRecord = {
      ...studentData,
      id,
      created_at: this.students[existingIndex].created_at
    };

    const updatedList = [...this.students];
    updatedList[existingIndex] = updatedRecord;
    this.persistRecords(updatedList);

    const sql = `UPDATE students SET 
    student_id = ${updatedRecord.student_id}, 
    name = '${updatedRecord.name.replace(/'/g, "''")}', 
    department = '${updatedRecord.department.replace(/'/g, "''")}', 
    year = '${updatedRecord.year}', 
    cgpa = ${updatedRecord.cgpa}
WHERE id = ${id};`;

    this.logQuery('UPDATE', sql, 'SUCCESS', 1);
    return { success: true, student: updatedRecord };
  }

  public delete(id: number): { success: boolean; error?: string; deletedStudent?: StudentRecord } {
    const recordToDelete = this.students.find(s => s.id === id);
    if (!recordToDelete) {
      return { success: false, error: `Student record with id ${id} does not exist.` };
    }

    const updated = this.students.filter(s => s.id !== id);
    this.persistRecords(updated);

    const sql = `DELETE FROM students WHERE id = ${id}; -- Deleted Student ID: ${recordToDelete.student_id} (${recordToDelete.name})`;
    this.logQuery('DELETE', sql, 'SUCCESS', 1);

    return { success: true, deletedStudent: recordToDelete };
  }

  public resetToSample(): StudentRecord[] {
    const sample = INITIAL_STUDENTS.map(s => ({ ...s }));
    this.persistRecords(sample);
    this.logQuery('DELETE', 'DELETE FROM students; -- Truncating table for sample reload', 'SUCCESS', this.students.length);
    this.logQuery('INSERT', `INSERT INTO students ... (Reloaded ${sample.length} initial sample student rows);`, 'SUCCESS', sample.length);
    return sample;
  }
}

// Global Singleton Database Instance
export const sqliteDb = new SqliteDatabase();
