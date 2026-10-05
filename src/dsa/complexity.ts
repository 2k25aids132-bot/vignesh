export interface AlgorithmComplexity {
  name: string;
  category: 'Searching' | 'Sorting' | 'Data Structure';
  best: string;
  average: string;
  worst: string;
  space: string;
  condition: string;
  explanation: string;
  vivaQuestion: string;
  vivaAnswer: string;
}

export const COMPLEXITY_DATA: AlgorithmComplexity[] = [
  {
    name: 'Linear Search',
    category: 'Searching',
    best: 'O(1)',
    average: 'O(n)',
    worst: 'O(n)',
    space: 'O(1)',
    condition: 'Unsorted or Sorted arrays',
    explanation: 'Sequential inspection of each element from index 0 to n-1. Best case occurs when the target element is at the very first index.',
    vivaQuestion: 'Why is Linear Search preferred over Binary Search when dataset is very small or unsorted?',
    vivaAnswer: 'Linear search does not require data to be pre-sorted. Sorting takes O(n log n), so for one-off searches in small unsorted collections, linear search O(n) is simpler and faster overall.'
  },
  {
    name: 'Binary Search',
    category: 'Searching',
    best: 'O(1)',
    average: 'O(log n)',
    worst: 'O(log n)',
    space: 'O(1)',
    condition: 'Data MUST be strictly sorted by key',
    explanation: 'Divide-and-conquer strategy repeatedly dividing the search space by half. For 1,000,000 items, binary search takes at most ~20 comparisons.',
    vivaQuestion: 'What is the prerequisite for Binary Search and what happens if data is unsorted?',
    vivaAnswer: 'Binary Search strictly requires sorted data. If applied to unsorted data, it will eliminate the wrong half and fail to find existing records.'
  },
  {
    name: 'Bubble Sort',
    category: 'Sorting',
    best: 'O(n)',
    average: 'O(n²)',
    worst: 'O(n²)',
    space: 'O(1)',
    condition: 'In-place, stable comparison sort',
    explanation: 'Compares adjacent items and swaps if out of order. With an early termination flag (swapped == false), best case for an already sorted list is O(n).',
    vivaQuestion: 'How can you optimize standard Bubble Sort from O(n²) in all cases to O(n) in best case?',
    vivaAnswer: 'By maintaining a boolean flag `swapped`. If no swaps occur in a complete inner pass, the array is guaranteed sorted and the algorithm terminates immediately.'
  },
  {
    name: 'Merge Sort',
    category: 'Sorting',
    best: 'O(n log n)',
    average: 'O(n log n)',
    worst: 'O(n log n)',
    space: 'O(n)',
    condition: 'Divide-and-conquer, stable, requires extra memory',
    explanation: 'Splits array into halves recursively down to single elements (log n levels) and then merges sorted subarrays in O(n) time per level. Guaranteed O(n log n).',
    vivaQuestion: 'Why does Merge Sort have O(n log n) worst-case whereas Bubble Sort has O(n²)?',
    vivaAnswer: 'Merge sort divides the problem into log₂n levels, doing linear O(n) merge work at each level (n × log n). Bubble sort compares each element with every other element in nested loops (n × n).'
  },
  {
    name: 'Linked List Search',
    category: 'Data Structure',
    best: 'O(1)',
    average: 'O(n)',
    worst: 'O(n)',
    space: 'O(1)',
    condition: 'Pointer traversal from Head to Tail',
    explanation: 'Singly linked list does not support random index access (no arr[i]). Pointers must be traversed node-by-node starting from HEAD until target or NULL.',
    vivaQuestion: 'Can Binary Search be efficiently applied to a Singly Linked List?',
    vivaAnswer: 'No, because linked lists lack random access O(1) to find the middle element. Finding mid in a linked list takes O(n), negating the logarithmic benefit.'
  }
];
