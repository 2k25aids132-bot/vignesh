/**
 * Manual Sorting Algorithms: Bubble Sort and Merge Sort
 * 
 * STRICT DSA CAPSTONE CONSTRAINTS:
 * - NO built-in sort(), sorted(), or library sorting routines
 * - Pure manual comparison and element swapping
 * - Manual divide-and-conquer merge algorithm
 */

import { SortKey, SortOrder, SortResult, SortStep, StudentRecord } from '../types/student';

/**
 * Compare two student records manually by key and order
 * Returns > 0 if a should come after b
 */
function compareRecords(a: StudentRecord, b: StudentRecord, key: SortKey, order: SortOrder): number {
  let valA: number | string = a[key];
  let valB: number | string = b[key];

  if (typeof valA === 'string' && typeof valB === 'string') {
    valA = valA.toLowerCase();
    valB = valB.toLowerCase();
  }

  let diff = 0;
  if (valA < valB) diff = -1;
  else if (valA > valB) diff = 1;
  else diff = 0;

  return order === 'asc' ? diff : -diff;
}

/**
 * MANUAL BUBBLE SORT
 * Iteratively compares adjacent pairs and swaps them if out of order.
 * Largest (or smallest) elements "bubble" to the end with each pass.
 * 
 * Time Complexity:
 * - Best Case (already sorted): O(n) with swapped flag check
 * - Average Case: O(n²)
 * - Worst Case (reverse sorted): O(n²)
 * Space Complexity: O(1) auxiliary (in-place)
 */
export function manualBubbleSort(
  input: StudentRecord[],
  key: SortKey = 'student_id',
  order: SortOrder = 'asc'
): SortResult {
  const startTime = performance.now();
  // Deep clone input array manually
  const arr: StudentRecord[] = [];
  for (let idx = 0; idx < input.length; idx++) {
    arr.push({ ...input[idx] });
  }

  const n = arr.length;
  let comparisons = 0;
  let swaps = 0;
  const steps: SortStep[] = [];

  // Initial step snapshot
  steps.push({
    stepIndex: 0,
    description: `Initial unsorted dataset (${n} students). Preparing Bubble Sort on "${key}" (${order.toUpperCase()}).`,
    activeIndices: [],
    swapped: false,
    arraySnapshot: arr.map(item => ({ ...item }))
  });

  let stepCounter = 1;

  for (let i = 0; i < n; i++) {
    let swappedInPass = false;

    for (let j = 0; j < n - i - 1; j++) {
      comparisons++;
      const comp = compareRecords(arr[j], arr[j + 1], key, order);

      if (comp > 0) {
        // Swap elements manually
        const temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
        swaps++;
        swappedInPass = true;

        if (steps.length < 50) {
          steps.push({
            stepIndex: stepCounter++,
            description: `Pass ${i + 1}, index [${j} <-> ${j + 1}]: Swapped ${arr[j + 1].name} (${arr[j + 1][key]}) with ${arr[j].name} (${arr[j][key]}).`,
            activeIndices: [j, j + 1],
            swapped: true,
            arraySnapshot: arr.map(item => ({ ...item }))
          });
        }
      } else {
        if (steps.length < 50 && (j % 2 === 0 || i === 0)) {
          steps.push({
            stepIndex: stepCounter++,
            description: `Pass ${i + 1}, index [${j} & ${j + 1}]: In correct order (${arr[j][key]} <= ${arr[j + 1][key]}). No swap.`,
            activeIndices: [j, j + 1],
            swapped: false,
            arraySnapshot: arr.map(item => ({ ...item }))
          });
        }
      }
    }

    // Optimization: If no elements swapped during inner loop, array is sorted
    if (!swappedInPass) {
      steps.push({
        stepIndex: stepCounter++,
        description: `Early exit triggered at Pass ${i + 1}: No swaps performed in this pass, proving array is completely sorted!`,
        activeIndices: [],
        swapped: false,
        arraySnapshot: arr.map(item => ({ ...item }))
      });
      break;
    }
  }

  // Final step
  steps.push({
    stepIndex: stepCounter,
    description: `Bubble Sort completed: Total ${comparisons} comparisons, ${swaps} swaps. Final array sorted.`,
    activeIndices: [],
    swapped: false,
    arraySnapshot: arr.map(item => ({ ...item }))
  });

  const endTime = performance.now();

  return {
    algorithm: 'Bubble Sort',
    key,
    order,
    originalData: input,
    sortedData: arr,
    comparisons,
    swaps,
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    steps,
    executionTimeMs: Math.max(0.01, Number((endTime - startTime).toFixed(3)))
  };
}

/**
 * MANUAL MERGE SORT
 * Divide and Conquer Algorithm:
 * 1. Divide: Split array of size n into two halves of size n/2
 * 2. Conquer: Recursively sort each half
 * 3. Combine: Merge the two sorted halves into a single sorted array
 * 
 * Time Complexity:
 * - Best Case: O(n log n)
 * - Average Case: O(n log n)
 * - Worst Case: O(n log n)
 * Space Complexity: O(n) auxiliary memory for merged subarrays
 */
export function manualMergeSort(
  input: StudentRecord[],
  key: SortKey = 'student_id',
  order: SortOrder = 'asc'
): SortResult {
  const startTime = performance.now();
  // Deep clone input manually
  const arr: StudentRecord[] = [];
  for (let idx = 0; idx < input.length; idx++) {
    arr.push({ ...input[idx] });
  }

  let comparisons = 0;
  const steps: SortStep[] = [];
  const mergeTreeSteps: { stage: string; subarrays: string[]; description: string }[] = [];
  let stepCounter = 1;

  steps.push({
    stepIndex: 0,
    description: `Starting Merge Sort with ${arr.length} student records by "${key}" (${order.toUpperCase()}). Divide phase initiates.`,
    activeIndices: [],
    arraySnapshot: arr.map(item => ({ ...item }))
  });

  /**
   * Internal recursive merge sort
   */
  function recursiveMergeSort(currentList: StudentRecord[], depth: number = 0): StudentRecord[] {
    const len = currentList.length;
    if (len <= 1) {
      return currentList;
    }

    const mid = Math.floor(len / 2);
    const leftHalf: StudentRecord[] = [];
    const rightHalf: StudentRecord[] = [];

    for (let i = 0; i < mid; i++) {
      leftHalf.push(currentList[i]);
    }
    for (let i = mid; i < len; i++) {
      rightHalf.push(currentList[i]);
    }

    if (mergeTreeSteps.length < 24) {
      mergeTreeSteps.push({
        stage: `Divide (Depth ${depth + 1})`,
        subarrays: [
          `Left [${leftHalf.map(s => s.student_id).join(', ')}]`,
          `Right [${rightHalf.map(s => s.student_id).join(', ')}]`
        ],
        description: `Dividing array of size ${len} into Left (${leftHalf.length}) and Right (${rightHalf.length}).`
      });
    }

    const sortedLeft = recursiveMergeSort(leftHalf, depth + 1);
    const sortedRight = recursiveMergeSort(rightHalf, depth + 1);

    // Merge step
    return merge(sortedLeft, sortedRight, depth);
  }

  /**
   * Manual merge procedure
   */
  function merge(left: StudentRecord[], right: StudentRecord[], depth: number): StudentRecord[] {
    const merged: StudentRecord[] = [];
    let i = 0;
    let j = 0;

    while (i < left.length && j < right.length) {
      comparisons++;
      const comp = compareRecords(left[i], right[j], key, order);

      if (comp <= 0) {
        merged.push(left[i]);
        i++;
      } else {
        merged.push(right[j]);
        j++;
      }
    }

    // Append remaining from left
    while (i < left.length) {
      merged.push(left[i]);
      i++;
    }

    // Append remaining from right
    while (j < right.length) {
      merged.push(right[j]);
      j++;
    }

    if (mergeTreeSteps.length < 24) {
      mergeTreeSteps.push({
        stage: `Merge (Depth ${depth})`,
        subarrays: [
          `Merged: [${merged.map(s => `${s.student_id}:${s[key]}`).join(', ')}]`
        ],
        description: `Merged sorted sublists of lengths ${left.length} and ${right.length} -> length ${merged.length}.`
      });
    }

    if (steps.length < 40) {
      steps.push({
        stepIndex: stepCounter++,
        description: `Merged sublists: [${left.map(s => s.student_id).join(',')}] + [${right.map(s => s.student_id).join(',')}] => [${merged.map(s => s.student_id).join(',')}].`,
        activeIndices: [],
        swapped: false,
        arraySnapshot: merged.map(item => ({ ...item }))
      });
    }

    return merged;
  }

  const sortedData = recursiveMergeSort(arr, 0);

  steps.push({
    stepIndex: stepCounter,
    description: `Merge Sort completed: Total ${comparisons} comparisons. Final dataset recombined in sorted order.`,
    activeIndices: [],
    swapped: false,
    arraySnapshot: sortedData.map(item => ({ ...item }))
  });

  const endTime = performance.now();

  return {
    algorithm: 'Merge Sort',
    key,
    order,
    originalData: input,
    sortedData,
    comparisons,
    swaps: 0, // Merge sort does not do pairwise swaps; it combines into auxiliary buffers
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(n)',
    steps,
    mergeTreeSteps,
    executionTimeMs: Math.max(0.01, Number((endTime - startTime).toFixed(3)))
  };
}
