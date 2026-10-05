/**
 * Manual Singly Linked List Implementation
 * 
 * STRICT DSA CAPSTONE CONSTRAINTS:
 * - Only Node pointers (Head -> Node -> Node -> NULL)
 * - Manual traversal using current = current.next
 * - NO Hash Table, NO Queues, NO Stacks, NO built-in collections
 */

import { LinkedListNodeData } from '../types/student';

export class StudentNode {
  public data: LinkedListNodeData;
  public next: StudentNode | null;

  constructor(data: LinkedListNodeData) {
    this.data = data;
    this.next = null;
  }
}

export interface LinkedListTraceStep {
  stepNumber: number;
  action: 'traverse' | 'insert' | 'delete' | 'found' | 'not_found';
  currentNodeId: number | null;
  pointerDesc: string;
  listSnapshot: { student_id: number; name: string }[];
}

export class StudentLinkedList {
  public head: StudentNode | null;
  public count: number;

  constructor() {
    this.head = null;
    this.count = 0;
  }

  /**
   * Insert at Head: O(1) Time Complexity
   * 1. Create new node
   * 2. Point new_node.next = head
   * 3. Update head = new_node
   */
  public insertAtHead(data: LinkedListNodeData): { steps: LinkedListTraceStep[]; newNode: StudentNode } {
    const steps: LinkedListTraceStep[] = [];
    const newNode = new StudentNode(data);

    steps.push({
      stepNumber: 1,
      action: 'insert',
      currentNodeId: data.student_id,
      pointerDesc: `Allocated new StudentNode with ID: ${data.student_id} (${data.name}). Set newNode.next = HEAD (${this.head ? this.head.data.student_id : 'NULL'}).`,
      listSnapshot: this.toArray().map(d => ({ student_id: d.student_id, name: d.name }))
    });

    newNode.next = this.head;
    this.head = newNode;
    this.count++;

    steps.push({
      stepNumber: 2,
      action: 'insert',
      currentNodeId: data.student_id,
      pointerDesc: `Updated HEAD pointer to point to new node [${data.student_id}]. Linked list head successfully updated.`,
      listSnapshot: this.toArray().map(d => ({ student_id: d.student_id, name: d.name }))
    });

    return { steps, newNode };
  }

  /**
   * Insert at Tail: O(n) Time Complexity
   * 1. Create new node
   * 2. If list empty, head = new_node
   * 3. Else traverse until current.next is null, then current.next = new_node
   */
  public insertAtTail(data: LinkedListNodeData): { steps: LinkedListTraceStep[]; newNode: StudentNode } {
    const steps: LinkedListTraceStep[] = [];
    const newNode = new StudentNode(data);

    if (this.head === null) {
      this.head = newNode;
      this.count++;
      steps.push({
        stepNumber: 1,
        action: 'insert',
        currentNodeId: data.student_id,
        pointerDesc: `List was empty (HEAD == NULL). Set HEAD = new node [${data.student_id}].`,
        listSnapshot: this.toArray().map(d => ({ student_id: d.student_id, name: d.name }))
      });
      return { steps, newNode };
    }

    let current: StudentNode = this.head;
    let stepNum = 1;

    steps.push({
      stepNumber: stepNum++,
      action: 'traverse',
      currentNodeId: current.data.student_id,
      pointerDesc: `Starting traversal from HEAD [${current.data.student_id}] to find the last node where next == NULL.`,
      listSnapshot: this.toArray().map(d => ({ student_id: d.student_id, name: d.name }))
    });

    while (current.next !== null) {
      current = current.next;
      steps.push({
        stepNumber: stepNum++,
        action: 'traverse',
        currentNodeId: current.data.student_id,
        pointerDesc: `Advancing pointer: current = current.next -> [${current.data.student_id} ${current.data.name}].`,
        listSnapshot: this.toArray().map(d => ({ student_id: d.student_id, name: d.name }))
      });
    }

    current.next = newNode;
    this.count++;

    steps.push({
      stepNumber: stepNum,
      action: 'insert',
      currentNodeId: data.student_id,
      pointerDesc: `Reached tail node [${current.data.student_id}]. Linked current.next = [${data.student_id} ${data.name}] -> NULL.`,
      listSnapshot: this.toArray().map(d => ({ student_id: d.student_id, name: d.name }))
    });

    return { steps, newNode };
  }

  /**
   * Insert at specific 0-based position: O(p) where p is index
   */
  public insertAtPosition(data: LinkedListNodeData, position: number): { success: boolean; steps: LinkedListTraceStep[] } {
    const steps: LinkedListTraceStep[] = [];

    if (position < 0 || position > this.count) {
      steps.push({
        stepNumber: 1,
        action: 'not_found',
        currentNodeId: null,
        pointerDesc: `Invalid position ${position}. Must be between 0 and ${this.count}.`,
        listSnapshot: this.toArray().map(d => ({ student_id: d.student_id, name: d.name }))
      });
      return { success: false, steps };
    }

    if (position === 0) {
      const res = this.insertAtHead(data);
      return { success: true, steps: res.steps };
    }

    const newNode = new StudentNode(data);
    let current: StudentNode = this.head!;
    let currentIdx = 0;

    while (currentIdx < position - 1 && current.next !== null) {
      steps.push({
        stepNumber: currentIdx + 1,
        action: 'traverse',
        currentNodeId: current.data.student_id,
        pointerDesc: `Traversing index ${currentIdx}: pointer at node [${current.data.student_id}].`,
        listSnapshot: this.toArray().map(d => ({ student_id: d.student_id, name: d.name }))
      });
      current = current.next;
      currentIdx++;
    }

    newNode.next = current.next;
    current.next = newNode;
    this.count++;

    steps.push({
      stepNumber: currentIdx + 2,
      action: 'insert',
      currentNodeId: data.student_id,
      pointerDesc: `Inserted node [${data.student_id}] at position ${position}. Updated links: prev.next = newNode, newNode.next = oldNext.`,
      listSnapshot: this.toArray().map(d => ({ student_id: d.student_id, name: d.name }))
    });

    return { success: true, steps };
  }

  /**
   * Delete by Student ID: O(n) Time Complexity
   * 1. If head matches, head = head.next
   * 2. Else traverse with prev and current pointers
   * 3. Relink: prev.next = current.next
   */
  public deleteById(studentId: number): { success: boolean; steps: LinkedListTraceStep[]; deletedNode: LinkedListNodeData | null } {
    const steps: LinkedListTraceStep[] = [];

    if (this.head === null) {
      steps.push({
        stepNumber: 1,
        action: 'not_found',
        currentNodeId: null,
        pointerDesc: 'Underflow: Cannot delete from an empty linked list (HEAD is NULL).',
        listSnapshot: []
      });
      return { success: false, steps, deletedNode: null };
    }

    // Case 1: Head node deletion
    if (this.head.data.student_id === studentId) {
      const deleted = this.head.data;
      steps.push({
        stepNumber: 1,
        action: 'delete',
        currentNodeId: this.head.data.student_id,
        pointerDesc: `Target [${studentId}] is at HEAD. Unlinking: HEAD = HEAD.next (${this.head.next ? this.head.next.data.student_id : 'NULL'}).`,
        listSnapshot: this.toArray().map(d => ({ student_id: d.student_id, name: d.name }))
      });

      this.head = this.head.next;
      this.count--;

      steps.push({
        stepNumber: 2,
        action: 'delete',
        currentNodeId: null,
        pointerDesc: `Successfully deleted node [${studentId}]. Garbaged collected unreferenced node.`,
        listSnapshot: this.toArray().map(d => ({ student_id: d.student_id, name: d.name }))
      });

      return { success: true, steps, deletedNode: deleted };
    }

    // Case 2: Traversing to find node
    let current: StudentNode | null = this.head;
    let prev: StudentNode | null = null;
    let stepNum = 1;

    while (current !== null && current.data.student_id !== studentId) {
      steps.push({
        stepNumber: stepNum++,
        action: 'traverse',
        currentNodeId: current.data.student_id,
        pointerDesc: `Comparing target ${studentId} with current node ID ${current.data.student_id}: No match. Advancing pointers (prev = current, current = current.next).`,
        listSnapshot: this.toArray().map(d => ({ student_id: d.student_id, name: d.name }))
      });
      prev = current;
      current = current.next;
    }

    if (current === null || prev === null) {
      steps.push({
        stepNumber: stepNum,
        action: 'not_found',
        currentNodeId: null,
        pointerDesc: `Reached end of list (current == NULL). Student with ID ${studentId} not found in linked list.`,
        listSnapshot: this.toArray().map(d => ({ student_id: d.student_id, name: d.name }))
      });
      return { success: false, steps, deletedNode: null };
    }

    const deleted = current.data;
    steps.push({
      stepNumber: stepNum++,
      action: 'delete',
      currentNodeId: current.data.student_id,
      pointerDesc: `Found student [${studentId} ${deleted.name}]. Unlinking node: prev.next (${prev.data.student_id}) = current.next (${current.next ? current.next.data.student_id : 'NULL'}).`,
      listSnapshot: this.toArray().map(d => ({ student_id: d.student_id, name: d.name }))
    });

    prev.next = current.next;
    this.count--;

    steps.push({
      stepNumber: stepNum,
      action: 'delete',
      currentNodeId: null,
      pointerDesc: `Node [${studentId}] successfully unlinked and removed. Current size: ${this.count}.`,
      listSnapshot: this.toArray().map(d => ({ student_id: d.student_id, name: d.name }))
    });

    return { success: true, steps, deletedNode: deleted };
  }

  /**
   * Search by Student ID: O(n) Time Complexity
   * Traversing pointer from head to end
   */
  public searchById(studentId: number): { found: boolean; node: LinkedListNodeData | null; comparisons: number; steps: LinkedListTraceStep[] } {
    const steps: LinkedListTraceStep[] = [];
    let current: StudentNode | null = this.head;
    let comparisons = 0;
    let stepNum = 1;

    while (current !== null) {
      comparisons++;
      const isMatch = current.data.student_id === studentId;

      steps.push({
        stepNumber: stepNum++,
        action: isMatch ? 'found' : 'traverse',
        currentNodeId: current.data.student_id,
        pointerDesc: `Step ${comparisons}: Inspecting Node [ID: ${current.data.student_id}, Name: ${current.data.name}]. Target: ${studentId}. ${isMatch ? 'MATCH FOUND!' : 'Mismatch, moving to current.next.'}`,
        listSnapshot: this.toArray().map(d => ({ student_id: d.student_id, name: d.name }))
      });

      if (isMatch) {
        return { found: true, node: current.data, comparisons, steps };
      }

      current = current.next;
    }

    steps.push({
      stepNumber: stepNum,
      action: 'not_found',
      currentNodeId: null,
      pointerDesc: `Search exhausted after ${comparisons} comparison(s). Node with ID ${studentId} does not exist in the linked list.`,
      listSnapshot: this.toArray().map(d => ({ student_id: d.student_id, name: d.name }))
    });

    return { found: false, node: null, comparisons, steps };
  }

  /**
   * Traverse & Convert list to array representation
   */
  public toArray(): LinkedListNodeData[] {
    const result: LinkedListNodeData[] = [];
    let current = this.head;
    while (current !== null) {
      result.push({ ...current.data });
      current = current.next;
    }
    return result;
  }

  /**
   * Populate linked list from an array
   */
  public populateFromArray(items: LinkedListNodeData[]): void {
    this.head = null;
    this.count = 0;
    for (let i = 0; i < items.length; i++) {
      this.insertAtTail(items[i]);
    }
  }

  public clear(): void {
    this.head = null;
    this.count = 0;
  }
}
