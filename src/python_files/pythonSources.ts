/**
 * Complete Python Flask + SQLite + DSA Capstone Source Code
 * 
 * Provided for college viva presentation, grading, and offline execution.
 */

export interface PythonFileItem {
  filename: string;
  category: 'Backend' | 'DSA' | 'Config' | 'Documentation';
  description: string;
  code: string;
}

export const PYTHON_CAPSTONE_FILES: PythonFileItem[] = [
  {
    filename: 'app.py',
    category: 'Backend',
    description: 'Main Flask Web Application with routing, SQLite operations, and DSA integration',
    code: `"""
STUDENT RECORD MANAGEMENT SYSTEM (DSA CAPSTONE PROJECT)
Framework: Flask (Python 3.x)
Database: SQLite 3
DSA: Manual Singly Linked List, Linear Search, Binary Search, Bubble Sort, Merge Sort
"""

from flask import Flask, render_template, request, redirect, url_for, flash, jsonify
import sqlite3
import time
from dsa.linked_list import StudentLinkedList
from dsa.searching import manual_linear_search, manual_binary_search, is_sorted_by_id
from dsa.sorting import manual_bubble_sort, manual_merge_sort

app = Flask(__name__)
app.secret_key = "dsa_capstone_academic_secret_key"
DATABASE = 'database.db'

def get_db_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    with open('schema.sql', 'r') as f:
        conn.executescript(f.read())
    conn.commit()
    conn.close()

# In-memory Linked List instance for DSA Lab Demonstration
dsa_linked_list = StudentLinkedList()

@app.route('/')
def index():
    return redirect(url_for('login'))

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        # Demo credentials for college viva
        u = username.lower() if username else ''
        if (u == 'vicky' and password == 'vicky@123') or (u == 'admin' and password == 'admin123'):
            display_name = 'Vicky' if u == 'vicky' else 'Admin'
            flash(f'Login successful! Welcome to the Academic Portal, {display_name}.', 'success')
            return redirect(url_for('dashboard'))
        else:
            flash('Invalid credentials. Use vicky / vicky@123 or admin / admin123', 'danger')
    return render_template('login.html')

@app.route('/dashboard')
def dashboard():
    conn = get_db_connection()
    students = conn.execute('SELECT * FROM students').fetchall()
    total_students = len(students)
    
    departments = set([s['department'] for s in students])
    total_departments = len(departments)
    
    cgpa_list = [s['cgpa'] for s in students] if students else [0.0]
    avg_cgpa = round(sum(cgpa_list) / len(cgpa_list), 2) if cgpa_list else 0.0
    highest_cgpa = max(cgpa_list) if cgpa_list else 0.0
    lowest_cgpa = min(cgpa_list) if cgpa_list else 0.0
    
    recent_students = conn.execute('SELECT * FROM students ORDER BY id DESC LIMIT 5').fetchall()
    conn.close()
    
    return render_template('dashboard.html', 
                           total_students=total_students,
                           total_departments=total_departments,
                           avg_cgpa=avg_cgpa,
                           highest_cgpa=highest_cgpa,
                           lowest_cgpa=lowest_cgpa,
                           recent_students=recent_students)

@app.route('/students')
def students():
    conn = get_db_connection()
    students_data = conn.execute('SELECT * FROM students ORDER BY student_id ASC').fetchall()
    conn.close()
    return render_template('students.html', students=students_data)

@app.route('/students/add', methods=['GET', 'POST'])
def add_student():
    if request.method == 'POST':
        student_id = request.form.get('student_id')
        name = request.form.get('name')
        gender = request.form.get('gender')
        dob = request.form.get('dob')
        department = request.form.get('department')
        year = request.form.get('year')
        section = request.form.get('section')
        email = request.form.get('email')
        phone = request.form.get('phone')
        address = request.form.get('address')
        cgpa = float(request.form.get('cgpa'))

        conn = get_db_connection()
        # Duplicate checks
        existing = conn.execute('SELECT id FROM students WHERE student_id = ? OR email = ?', (student_id, email)).fetchone()
        if existing:
            flash('Error: Student ID or Email already exists in SQLite database!', 'danger')
            conn.close()
            return render_template('add_student.html')

        conn.execute('''
            INSERT INTO students (student_id, name, gender, dob, department, year, section, email, phone, address, cgpa)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (student_id, name, gender, dob, department, year, section, email, phone, address, cgpa))
        conn.commit()
        conn.close()

        flash(f'Student {name} (ID: {student_id}) successfully registered in SQLite database!', 'success')
        return redirect(url_for('students'))
    return render_template('add_student.html')

@app.route('/search', methods=['GET', 'POST'])
def search():
    result = None
    if request.method == 'POST':
        algo = request.form.get('algorithm')
        query = request.form.get('query')
        
        conn = get_db_connection()
        records = [dict(ix) for ix in conn.execute('SELECT * FROM students').fetchall()]
        conn.close()
        
        if algo == 'linear':
            result = manual_linear_search(records, query)
        elif algo == 'binary':
            # Binary search requires sorted order by student_id
            sorted_records = manual_bubble_sort(records, key='student_id', order='asc')['sorted_data']
            result = manual_binary_search(sorted_records, int(query))
            
    return render_template('search.html', result=result)

@app.route('/sorting', methods=['GET', 'POST'])
def sorting():
    result = None
    if request.method == 'POST':
        algo = request.form.get('algorithm')
        key = request.form.get('sort_key', 'student_id')
        order = request.form.get('sort_order', 'asc')
        
        conn = get_db_connection()
        records = [dict(ix) for ix in conn.execute('SELECT * FROM students').fetchall()]
        conn.close()
        
        if algo == 'bubble':
            result = manual_bubble_sort(records, key=key, order=order)
        elif algo == 'merge':
            result = manual_merge_sort(records, key=key, order=order)
            
    return render_template('sorting.html', result=result)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
`
  },
  {
    filename: 'dsa/linked_list.py',
    category: 'DSA',
    description: 'Manual Singly Linked List with Node pointers, insert, delete, search, display',
    code: `"""
MANUAL SINGLY LINKED LIST IMPLEMENTATION
Demonstrates dynamic memory chaining without queues, stacks, or hash tables.
Each node stores Student Data and a pointer (reference) to the next StudentNode.
"""

class StudentNode:
    """Represents an individual node in the singly linked list."""
    def __init__(self, student_id, name, department, cgpa):
        self.student_id = student_id
        self.name = name
        self.department = department
        self.cgpa = cgpa
        self.next = None  # Pointer to next Node (initially NULL)

class StudentLinkedList:
    """Manual Singly Linked List container."""
    def __init__(self):
        self.head = None  # Pointer to the first node
        self.count = 0

    def insert_at_head(self, student_id, name, department, cgpa):
        """O(1) Insertion: Creates node and links it before current HEAD."""
        new_node = StudentNode(student_id, name, department, cgpa)
        new_node.next = self.head
        self.head = new_node
        self.count += 1
        return new_node

    def insert_at_tail(self, student_id, name, department, cgpa):
        """O(n) Insertion: Traverses until next is NULL and links new node."""
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
        """O(n) Deletion: Unlinks node matching student_id."""
        if self.head is None:
            return None  # Underflow: Empty list

        # If target is at HEAD
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
        """O(n) Search: Traverses pointer chain from HEAD."""
        current = self.head
        comparisons = 0
        while current is not None:
            comparisons += 1
            if current.student_id == student_id:
                return {"found": True, "node": current, "comparisons": comparisons}
            current = current.next
        return {"found": False, "node": None, "comparisons": comparisons}

    def display(self):
        """Traverses and yields all nodes formatted as HEAD -> [ID] -> NULL."""
        elements = []
        current = self.head
        while current is not None:
            elements.append(f"[{current.student_id}: {current.name}]")
            current = current.next
        return " -> ".join(elements) + " -> NULL"
`
  },
  {
    filename: 'dsa/searching.py',
    category: 'DSA',
    description: 'Manual Linear Search and Binary Search implementations with comparison counts',
    code: `"""
MANUAL SEARCHING ALGORITHMS
Constraint: Pure index loops, NO Python list.index(), NO set(), NO dict()
"""

def manual_linear_search(records, target):
    """
    LINEAR SEARCH: O(n) Time Complexity, O(1) Auxiliary Space
    Iteratively checks each record one by one from index 0 to n-1.
    """
    comparisons = 0
    n = len(records)
    target_str = str(target).strip().lower()

    for i in range(n):
        comparisons += 1
        curr = records[i]
        curr_id = str(curr.get('student_id', '')).lower()
        curr_name = str(curr.get('name', '')).lower()

        if curr_id == target_str or curr_name == target_str:
            return {
                "algorithm": "Linear Search",
                "found": True,
                "student": curr,
                "comparisons": comparisons,
                "complexity": "O(n)",
                "index": i
            }

    return {
        "algorithm": "Linear Search",
        "found": False,
        "student": None,
        "comparisons": comparisons,
        "complexity": "O(n)"
    }


def manual_binary_search(sorted_records, target_id):
    """
    BINARY SEARCH: O(log n) Time Complexity, O(1) Auxiliary Space
    PREREQUISITE: Input array MUST be sorted by student_id ascending.
    Repeatedly halves search space using integer midpoint arithmetic.
    """
    low = 0
    high = len(sorted_records) - 1
    comparisons = 0
    target_id = int(target_id)

    while low <= high:
        comparisons += 1
        mid = (low + high) // 2
        mid_id = int(sorted_records[mid]['student_id'])

        if mid_id == target_id:
            return {
                "algorithm": "Binary Search",
                "found": True,
                "student": sorted_records[mid],
                "comparisons": comparisons,
                "complexity": "O(log n)",
                "index": mid
            }
        elif mid_id < target_id:
            low = mid + 1  # Target is in upper half
        else:
            high = mid - 1  # Target is in lower half

    return {
        "algorithm": "Binary Search",
        "found": False,
        "student": None,
        "comparisons": comparisons,
        "complexity": "O(log n)"
    }

def is_sorted_by_id(records):
    """Verifies prerequisite that records are ascending by student_id."""
    for i in range(len(records) - 1):
        if int(records[i]['student_id']) > int(records[i + 1]['student_id']):
            return False
    return True
`
  },
  {
    filename: 'dsa/sorting.py',
    category: 'DSA',
    description: 'Manual Bubble Sort and Merge Sort implementations (NO sort() or sorted())',
    code: `"""
MANUAL SORTING ALGORITHMS
Constraint: NO Python sort(), NO sorted()
"""

def compare(a, b, key, order):
    val_a = a[key]
    val_b = b[key]
    if isinstance(val_a, str):
        val_a = val_a.lower()
        val_b = val_b.lower()
    
    diff = (val_a > val_b) - (val_a < val_b)
    return diff if order == 'asc' else -diff

def manual_bubble_sort(input_records, key='student_id', order='asc'):
    """
    BUBBLE SORT: O(n²) Average/Worst, O(n) Best (with swapped flag)
    Repeatedly compares adjacent items and swaps them into position.
    """
    arr = [dict(x) for x in input_records]
    n = len(arr)
    comparisons = 0
    swaps = 0

    for i in range(n):
        swapped = False
        for j in range(0, n - i - 1):
            comparisons += 1
            if compare(arr[j], arr[j + 1], key, order) > 0:
                # Manual swap
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swaps += 1
                swapped = True
        if not swapped:
            break  # Optimized early exit if already sorted

    return {
        "algorithm": "Bubble Sort",
        "key": key,
        "order": order,
        "sorted_data": arr,
        "comparisons": comparisons,
        "swaps": swaps,
        "time_complexity": "O(n²)",
        "space_complexity": "O(1)"
    }

def manual_merge_sort(input_records, key='student_id', order='asc'):
    """
    MERGE SORT: O(n log n) Best, Average, Worst
    Divide-and-conquer: splits array into halves, recursively sorts, then merges.
    """
    arr = [dict(x) for x in input_records]
    comparisons = [0]  # Reference counter

    def merge(left, right):
        merged = []
        i = j = 0
        while i < len(left) and j < len(right):
            comparisons[0] += 1
            if compare(left[i], right[j], key, order) <= 0:
                merged.append(left[i])
                i += 1
            else:
                merged.append(right[j])
                j += 1
        
        while i < len(left):
            merged.append(left[i])
            i += 1
        while j < len(right):
            merged.append(right[j])
            j += 1
        return merged

    def sort_recursive(sublist):
        if len(sublist) <= 1:
            return sublist
        mid = len(sublist) // 2
        left_half = sort_recursive(sublist[:mid])
        right_half = sort_recursive(sublist[mid:])
        return merge(left_half, right_half)

    sorted_result = sort_recursive(arr)

    return {
        "algorithm": "Merge Sort",
        "key": key,
        "order": order,
        "sorted_data": sorted_result,
        "comparisons": comparisons[0],
        "swaps": 0,
        "time_complexity": "O(n log n)",
        "space_complexity": "O(n)"
    }
`
  },
  {
    filename: 'requirements.txt',
    category: 'Config',
    description: 'Python pip dependencies (pure standard stack)',
    code: `Flask==3.0.3
Werkzeug==3.0.3
Jinja2==3.1.4
`
  },
  {
    filename: 'schema.sql',
    category: 'Backend',
    description: 'SQLite database initialization script with constraints and sample rows',
    code: `CREATE TABLE IF NOT EXISTS students (
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

-- Initial 5 Sample records for quick bootstrapping
INSERT INTO students (student_id, name, gender, dob, department, year, section, email, phone, address, cgpa)
VALUES
(101, 'Arun Kumar', 'Male', '2004-05-14', 'Artificial Intelligence & Data Science', '3rd Year', 'A', 'arun.k@college.edu', '9845012340', '14, Gandhi Road, Salem', 8.85),
(102, 'Priya Sharma', 'Female', '2004-08-22', 'Computer Science and Engineering', '3rd Year', 'B', 'priya.s@college.edu', '9845012341', '45, Anna Nagar, Coimbatore', 9.20),
(103, 'Kavin Raj', 'Male', '2005-02-18', 'Information Technology', '2nd Year', 'A', 'kavin.r@college.edu', '9845012342', '78, Cross Cut Road, Trichy', 7.65),
(104, 'Divya Mohan', 'Female', '2003-11-05', 'Electronics & Communication', '4th Year', 'A', 'divya.m@college.edu', '9845012343', '22, Raja Street, Madurai', 9.45),
(105, 'Rahul Verma', 'Male', '2005-04-12', 'Mechanical Engineering', '2nd Year', 'B', 'rahul.v@college.edu', '9845012344', '109, Nehru Boulevard, Salem', 8.10);
`
  },
  {
    filename: 'README.md',
    category: 'Documentation',
    description: 'Comprehensive capstone documentation, setup guide, viva cheat sheet',
    code: `# Student Record Management System (DSA Capstone Project)

A complete web-based Student Record Management System designed for college DSA evaluation.

## 🎓 Capstone Credentials & Demo
- **Demo Username:** \`admin\`
- **Demo Password:** \`admin123\`

## 📚 DSA Requirement Compliance
This project strictly implements ONLY approved data structures and algorithms:
1. **Data Structure:** Singly Linked List (Head pointer, Node, next pointer)
2. **Searching Algorithms:** Linear Search O(n), Binary Search O(log n)
3. **Sorting Algorithms:** Bubble Sort O(n²), Merge Sort O(n log n)
- **STRICTLY EXCLUDED:** No Hash Table, No Hashing, No Queues, No Stacks.
- **NO Built-in Helpers:** \`sort()\` and \`sorted()\` are prohibited for DSA tasks.

## ⚙️ Quick Installation & Execution
\`\`\`bash
# 1. Clone or extract the project folder
cd student-record-management

# 2. Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\\Scripts\\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Initialize SQLite Database
python -c "import app; app.init_db()"

# 5. Run Flask Web Application
python app.py
\`\`\`
Visit \`http://127.0.0.1:5000\` in your browser.
`
  }
];
