# Student Record Management System (DSA Capstone Project)

A complete, professional, web-based academic Student Record Management System built with Python, Flask, and SQLite, featuring manual, unassisted implementations of foundational Data Structures and Algorithms.

---

## 📌 Project Overview
The **Student Record Management System** is designed as a college capstone project demonstrating practical applications of Data Structures and Algorithms in academic administration. The system manages student records persistently in SQLite while separating database queries from manual DSA implementations (Singly Linked List, Linear Search, Binary Search, Bubble Sort, and Merge Sort).

---

## 🔑 Demo Credentials
For viva voce evaluation and immediate demonstration:
- **URL:** `http://127.0.0.1:5000` (or `http://localhost:3000` in the Web preview)
- **Faculty/Student Admin:** `vicky` / `vicky@123`
- **Default Evaluator Admin:** `admin` / `admin123`

---

## ⚙️ Strict DSA Compliance Rules
As mandated by the capstone requirements:
- **ONLY Approved DSA:**
  1. **Data Structure:** Singly Linked List (`StudentNode`, `StudentLinkedList`)
  2. **Searching Algorithms:** Linear Search, Binary Search
  3. **Sorting Algorithms:** Bubble Sort, Merge Sort
- **STRICTLY EXCLUDED:**
  - ❌ No Hash Tables / Hash Maps
  - ❌ No Queues
  - ❌ No Stacks
  - ❌ No built-in `sort()` or `sorted()`
  - ❌ No built-in search routines (`find`, `indexOf`, `set`, etc.)

---

## 🚀 Key Features

1. **Academic Authentication Portal:**
   - Pre-configured demo login for evaluation.
2. **Dashboard Overview:**
   - Real-time summary cards: Total Students, Total Departments, Average CGPA, Highest CGPA, Lowest CGPA.
   - Recently added students and department-wise visual bars.
3. **Student Record Management (CRUD):**
   - Full student profile registration with comprehensive field validations.
   - Unique constraints enforced on Student ID and Academic Email.
   - Edit, delete, and view profiles.
4. **Search System (Linear vs Binary):**
   - **Linear Search:** Sequential inspection, comparisons count, O(n) runtime.
   - **Binary Search:** Operates strictly on data sorted by Student ID, midpoint calculations, step-by-step halving trace, O(log n) runtime.
5. **Sorting System (Bubble vs Merge):**
   - Sort by Student ID, Name, or CGPA in Ascending or Descending order.
   - **Bubble Sort:** Pairwise comparisons, swap counters, early-exit optimization, O(n²) runtime.
   - **Merge Sort:** Recursive divide-and-conquer sublists, merge steps trace, guaranteed O(n log n) runtime.
6. **DSA Lab (Linked List Visualizer):**
   - Interactive visual chain: `HEAD -> [101 Arun] -> [102 Priya] -> [103 Kavin] -> NULL`
   - Insert at Head O(1), Insert at Tail O(n), Insert at Position, Delete by ID, Search by ID, Display list.
   - Visual inspection of Node cargo and next pointer.
7. **Complexity Matrix & Viva Voce Guide:**
   - Big-O analysis comparison table (Best, Average, Worst, Auxiliary Space).
   - Examiner Q&A cheat sheet.
8. **Reports & Exports:**
   - Department and year-wise breakdown.
   - Print-ready academic transcript format (`window.print()`).
   - One-click CSV export.

---

## 🗄️ Database Design (SQLite)
File: `database.db`
Table: `students`

```sql
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
```

---

## 📂 Project Directory Structure

```text
student-record-management/
├── app.py                     # Flask application entry point and routes
├── schema.sql                 # SQLite schema initialization script
├── database.db                # SQLite database (auto-generated)
├── requirements.txt           # Python package dependencies
├── README.md                  # Project documentation & viva guide
│
├── dsa/                       # Manual, separated DSA implementations
│   ├── linked_list.py         # Singly Linked List (Node, Head, Next)
│   ├── searching.py           # Linear Search & Binary Search
│   └── sorting.py             # Bubble Sort & Merge Sort
│
├── templates/                 # Jinja2 HTML templates
│   ├── login.html
│   ├── dashboard.html
│   ├── add_student.html
│   ├── students.html
│   ├── profile.html
│   ├── edit_student.html
│   ├── search.html
│   ├── sorting.html
│   ├── dsa.html
│   ├── complexity.html
│   ├── reports.html
│   └── about.html
│
└── static/
    ├── css/
    │   └── style.css          # Clean academic styling
    └── js/
        └── script.js          # Client-side helpers
```

---

## 🛠️ Installation & Running the Flask Application

### 1. Prerequisites
- Python 3.8 or above installed on your system.

### 2. Setup Virtual Environment
```bash
# Navigate to the project directory
cd student-record-management

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate
```

### 3. Install Required Packages
```bash
pip install -r requirements.txt
```

### 4. Run the Application
```bash
python app.py
```
Open your browser and navigate to:
`http://127.0.0.1:5000`

---

## 📊 Summary of DSA Complexities

| Algorithm / Structure | Best Case | Average Case | Worst Case | Space Complexity | Prerequisite |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Linear Search** | O(1) | O(n) | O(n) | O(1) | None |
| **Binary Search** | O(1) | O(log n) | O(log n) | O(1) | Sorted by Student ID |
| **Bubble Sort** | O(n) | O(n²) | O(n²) | O(1) | None |
| **Merge Sort** | O(n log n) | O(n log n) | O(n log n) | O(n) | None |
| **Linked List Search** | O(1) | O(n) | O(n) | O(1) | Pointer Traversal |

---

## 🎓 Viva Voce Key Questions & Answers

1. **Why does this project avoid Hash Tables?**
   - To emphasize deep mechanical understanding of pointer-based Singly Linked Lists and array-based divide-and-conquer algorithms without relying on high-level dictionary abstractions.

2. **Why does Binary Search fail on an unsorted array?**
   - Binary Search eliminates half the array by assuming elements to the left are strictly smaller and elements to the right are strictly larger. If unsorted, the target may be eliminated incorrectly.

3. **Why does Singly Linked List take O(1) for Head insertion but O(n) for Tail insertion?**
   - Head insertion only requires setting `newNode.next = head` and `head = newNode`. Tail insertion requires traversing all n nodes until `current.next == None`.
