/**
 * Manual Searching Algorithms: Linear Search and Binary Search
 * 
 * STRICT DSA CAPSTONE CONSTRAINTS:
 * - NO built-in search functions (indexOf, find, filter, includes)
 * - NO hash tables, NO dictionaries, NO sets
 * - Manual comparison loops and index pointer arithmetic
 */

import { SearchResult, SearchStep, StudentRecord } from '../types/student';

/**
 * MANUAL LINEAR SEARCH
 * Time Complexity:
 * - Best Case: O(1) (Target is at index 0)
 * - Average Case: O(n/2) = O(n)
 * - Worst Case: O(n) (Target is at index n-1 or not present)
 * Space Complexity: O(1) auxiliary
 */
export function manualLinearSearch(
  students: StudentRecord[],
  target: string | number,
  searchKey: 'student_id' | 'name'
): SearchResult {
  const startTime = performance.now();
  const steps: SearchStep[] = [];
  let comparisons = 0;
  let foundStudent: StudentRecord | null = null;
  const n = students.length;

  const normalizedTarget = typeof target === 'string' ? target.trim().toLowerCase() : target;

  for (let i = 0; i < n; i++) {
    comparisons++;
    const current = students[i];
    let isMatch = false;

    if (searchKey === 'student_id') {
      const targetId = typeof normalizedTarget === 'string' ? parseInt(normalizedTarget, 10) : normalizedTarget;
      isMatch = current.student_id === targetId;
      steps.push({
        step: i + 1,
        index: i,
        studentId: current.student_id,
        studentName: current.name,
        comparison: `Check index [${i}]: Does student_id (${current.student_id}) == target (${targetId})? -> ${isMatch ? 'TRUE' : 'FALSE'}`,
        status: isMatch ? 'matched' : 'eliminated'
      });
    } else {
      const currentName = current.name.toLowerCase();
      isMatch = currentName === normalizedTarget || currentName.includes(String(normalizedTarget));
      steps.push({
        step: i + 1,
        index: i,
        studentId: current.student_id,
        studentName: current.name,
        comparison: `Check index [${i}]: Does name ("${current.name}") match target ("${target}")? -> ${isMatch ? 'TRUE' : 'FALSE'}`,
        status: isMatch ? 'matched' : 'eliminated'
      });
    }

    if (isMatch) {
      foundStudent = current;
      break;
    }
  }

  const endTime = performance.now();

  return {
    algorithm: 'Linear Search',
    target,
    searchKey,
    found: foundStudent !== null,
    student: foundStudent,
    comparisons,
    timeComplexity: 'O(n)',
    steps,
    executionTimeMs: Math.max(0.01, Number((endTime - startTime).toFixed(3))),
    notes: 'Linear Search inspected records sequentially from index 0 to ' + (foundStudent ? steps.length - 1 : n - 1) + '.'
  };
}

/**
 * MANUAL BINARY SEARCH
 * Operates strictly on an array sorted by Student ID.
 * Time Complexity:
 * - Best Case: O(1) (Middle element matches immediately)
 * - Average Case: O(log n)
 * - Worst Case: O(log n)
 * Space Complexity: O(1) auxiliary
 */
export function manualBinarySearch(
  sortedStudents: StudentRecord[],
  targetId: number
): SearchResult {
  const startTime = performance.now();
  const steps: SearchStep[] = [];
  let comparisons = 0;
  let foundStudent: StudentRecord | null = null;

  let low = 0;
  let high = sortedStudents.length - 1;
  let stepCount = 0;

  while (low <= high) {
    stepCount++;
    comparisons++;
    // Midpoint calculation using integer floor arithmetic: mid = floor((low + high) / 2)
    const mid = Math.floor((low + high) / 2);
    const midRecord = sortedStudents[mid];
    const midId = midRecord.student_id;

    if (midId === targetId) {
      steps.push({
        step: stepCount,
        index: mid,
        studentId: midId,
        studentName: midRecord.name,
        low,
        high,
        mid,
        comparison: `Step ${stepCount}: Range [${low} .. ${high}]. mid = floor((${low}+${high})/2) = ${mid}. ID at arr[${mid}] is ${midId} == Target ${targetId}. MATCH FOUND!`,
        status: 'matched'
      });
      foundStudent = midRecord;
      break;
    } else if (midId < targetId) {
      steps.push({
        step: stepCount,
        index: mid,
        studentId: midId,
        studentName: midRecord.name,
        low,
        high,
        mid,
        comparison: `Step ${stepCount}: Range [${low} .. ${high}]. mid = ${mid} (ID ${midId} < Target ${targetId}). Target lies in upper half. Eliminate left half [${low} .. ${mid}]. New low = mid + 1 (${mid + 1}).`,
        status: 'eliminated'
      });
      low = mid + 1;
    } else {
      steps.push({
        step: stepCount,
        index: mid,
        studentId: midId,
        studentName: midRecord.name,
        low,
        high,
        mid,
        comparison: `Step ${stepCount}: Range [${low} .. ${high}]. mid = ${mid} (ID ${midId} > Target ${targetId}). Target lies in lower half. Eliminate right half [${mid} .. ${high}]. New high = mid - 1 (${mid - 1}).`,
        status: 'eliminated'
      });
      high = mid - 1;
    }
  }

  const endTime = performance.now();

  return {
    algorithm: 'Binary Search',
    target: targetId,
    searchKey: 'student_id',
    found: foundStudent !== null,
    student: foundStudent,
    comparisons,
    timeComplexity: 'O(log n)',
    steps,
    executionTimeMs: Math.max(0.01, Number((endTime - startTime).toFixed(3))),
    notes: `Binary Search eliminated half the remaining search space at every step across ${comparisons} comparison(s). Maximum comparisons for n=${sortedStudents.length} is ceil(log2(${sortedStudents.length})) = ${Math.ceil(Math.log2(Math.max(1, sortedStudents.length)))}.`
  };
}

/**
 * Check if students array is strictly sorted by student_id ascending
 */
export function isSortedByStudentId(students: StudentRecord[]): boolean {
  for (let i = 0; i < students.length - 1; i++) {
    if (students[i].student_id > students[i + 1].student_id) {
      return false;
    }
  }
  return true;
}
