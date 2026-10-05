"""
MANUAL SINGLY LINKED LIST IMPLEMENTATION
DSA Capstone Project: Student Record Management System
Strict constraints:
- Node class storing data and next pointer
- Head pointer referencing first node
- Manual traversal (current = current.next)
- STRICTLY NO Hash Tables, NO Queues, NO Stacks
"""

class StudentNode:
    """Represents a node in the singly linked list."""
    def __init__(self, student_id, name, department, cgpa):
        self.student_id = int(student_id)
        self.name = str(name)
        self.department = str(department)
        self.cgpa = float(cgpa)
        self.next = None  # Pointer to next StudentNode (NULL initially)

class StudentLinkedList:
    """Manual Singly Linked List container."""
    def __init__(self):
        self.head = None
        self.count = 0

    def insert_at_head(self, student_id, name, department, cgpa):
        """
        O(1) Insertion:
        1. Allocate new StudentNode
        2. Set new_node.next = self.head
        3. Update self.head = new_node
        """
        new_node = StudentNode(student_id, name, department, cgpa)
        new_node.next = self.head
        self.head = new_node
        self.count += 1
        return new_node

    def insert_at_tail(self, student_id, name, department, cgpa):
        """
        O(n) Insertion:
        Traverses until current.next is None, then links new node.
        """
        new_node = StudentNode(student_id, name, department, cgpa)
        if self.head is None:
            self.head = new_node
            self.count += 1
            return new_node

        current = self.head
        while current.next is not None:
            current = current.next
        current.next = new_node
        self.count += 1
        return new_node

    def delete_by_id(self, student_id):
        """
        O(n) Deletion:
        Traverses with prev and current pointers, then unlinks node.
        """
        student_id = int(student_id)
        if self.head is None:
            return None  # Underflow: Empty list

        # Target at HEAD
        if self.head.student_id == student_id:
            deleted = self.head
            self.head = self.head.next
            self.count -= 1
            return deleted

        current = self.head
        prev = None
        while current is not None and current.student_id != student_id:
            prev = current
            current = current.next

        if current is None:
            return None  # Not found

        prev.next = current.next
        self.count -= 1
        return current

    def search_by_id(self, student_id):
        """
        O(n) Search:
        Traverses pointer sequence from HEAD to tail.
        """
        student_id = int(student_id)
        current = self.head
        comparisons = 0
        while current is not None:
            comparisons += 1
            if current.student_id == student_id:
                return {"found": True, "node": current, "comparisons": comparisons}
            current = current.next
        return {"found": False, "node": None, "comparisons": comparisons}

    def to_list(self):
        """Returns records as list of dictionaries for display."""
        records = []
        current = self.head
        while current is not None:
            records.append({
                "student_id": current.student_id,
                "name": current.name,
                "department": current.department,
                "cgpa": current.cgpa
            })
            current = current.next
        return records

    def display(self):
        """Formats linked list representation: HEAD -> [101 Arun] -> NULL"""
        nodes = []
        current = self.head
        while current is not None:
            nodes.append(f"[{current.student_id} {current.name}]")
            current = current.next
        return "HEAD -> " + " -> ".join(nodes) + " -> NULL" if nodes else "HEAD -> NULL"
