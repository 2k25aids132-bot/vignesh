export interface StudentRecord {
  id: number;
  student_id: number; // Numeric ID (e.g., 101, 102) for pure binary search and linked list operations
  name: string;
  gender: 'Male' | 'Female' | 'Other';
  dob: string; // YYYY-MM-DD
  department: string;
  year: '1st Year' | '2nd Year' | '3rd Year' | '4th Year';
  section: 'A' | 'B' | 'C';
  email: string;
  phone: string;
  address: string;
  cgpa: number; // 0.00 to 10.00
  created_at: string;
}

export type SortKey = 'student_id' | 'name' | 'cgpa';
export type SortOrder = 'asc' | 'desc';

export interface SearchStep {
  step: number;
  index: number;
  studentId: number;
  studentName: string;
  low?: number;
  high?: number;
  mid?: number;
  comparison: string;
  status: 'checking' | 'matched' | 'eliminated';
}

export interface SearchResult {
  algorithm: 'Linear Search' | 'Binary Search';
  target: string | number;
  searchKey: 'student_id' | 'name';
  found: boolean;
  student: StudentRecord | null;
  comparisons: number;
  timeComplexity: string;
  steps: SearchStep[];
  executionTimeMs: number;
  notes: string;
}

export interface SortStep {
  stepIndex: number;
  description: string;
  activeIndices: number[]; // currently being compared or swapped
  swapped?: boolean;
  arraySnapshot: StudentRecord[];
}

export interface SortResult {
  algorithm: 'Bubble Sort' | 'Merge Sort';
  key: SortKey;
  order: SortOrder;
  originalData: StudentRecord[];
  sortedData: StudentRecord[];
  comparisons: number;
  swaps: number;
  timeComplexity: string;
  spaceComplexity: string;
  steps: SortStep[];
  executionTimeMs: number;
  mergeTreeSteps?: {
    stage: string;
    subarrays: string[];
    description: string;
  }[];
}

export interface LinkedListNodeData {
  id: number;
  student_id: number;
  name: string;
  department: string;
  cgpa: number;
}
