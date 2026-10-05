"""
STUDENT RECORD MANAGEMENT SYSTEM (DSA CAPSTONE PROJECT)
Backend: Python 3.x with Flask
Database: SQLite 3 (database.db)
DSA Engines: Manual Singly Linked List, Linear Search, Binary Search, Bubble Sort, Merge Sort
"""

import sqlite3
import os
from flask import Flask, render_template, request, redirect, url_for, flash, jsonify
from dsa.linked_list import StudentLinkedList
from dsa.searching import manual_linear_search, manual_binary_search, is_sorted_by_id
from dsa.sorting import manual_bubble_sort, manual_merge_sort

app = Flask(__name__)
app.secret_key = "dsa_capstone_academic_secret_key_2025"
DATABASE = 'database.db'

def get_db_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    if not os.path.exists(DATABASE):
        conn = get_db_connection()
        with open('schema.sql', 'r') as f:
            conn.executescript(f.read())
        conn.commit()
        conn.close()
        print("Initialized SQLite database.db successfully.")

# Dedicated In-Memory Linked List for DSA Lab demonstration
lab_linked_list = StudentLinkedList()

def reload_lab_linked_list():
    conn = get_db_connection()
    students = conn.execute('SELECT student_id, name, department, cgpa FROM students ORDER BY student_id ASC LIMIT 6').fetchall()
    conn.close()
    lab_linked_list.head = None
    lab_linked_list.count = 0
    for s in students:
        lab_linked_list.insert_at_tail(s['student_id'], s['name'], s['department'], s['cgpa'])

@app.before_request
def setup():
    init_db()
    if lab_linked_list.count == 0:
        reload_lab_linked_list()

# 1. LOGIN PAGE
@app.route('/')
def index():
    return redirect(url_for('login'))

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('username', '').strip()
        password = request.form.get('password', '').strip()
        u = username.lower()
        if (u == 'vicky' and password == 'vicky@123') or (u == 'admin' and password == 'admin123'):
            display_name = 'Vicky' if u == 'vicky' else 'Admin'
            flash(f'Login successful! Welcome, {display_name}.', 'success')
            return redirect(url_for('dashboard'))
        else:
            flash('Invalid credentials. Use vicky / vicky@123 or admin / admin123', 'danger')
    return render_template('login.html')

# 2. DASHBOARD
@app.route('/dashboard')
def dashboard():
    conn = get_db_connection()
    students = conn.execute('SELECT * FROM students').fetchall()
    total_students = len(students)

    departments = set([s['department'] for s in students])
    total_departments = len(departments)

    cgpa_list = [float(s['cgpa']) for s in students] if students else [0.0]
    avg_cgpa = round(sum(cgpa_list) / len(cgpa_list), 2) if cgpa_list else 0.0
    highest_cgpa = max(cgpa_list) if cgpa_list else 0.0
    lowest_cgpa = min(cgpa_list) if cgpa_list else 0.0

    recent_students = conn.execute('SELECT * FROM students ORDER BY id DESC LIMIT 5').fetchall()
    conn.close()

    return render_template(
        'dashboard.html',
        total_students=total_students,
        total_departments=total_departments,
        avg_cgpa=avg_cgpa,
        highest_cgpa=highest_cgpa,
        lowest_cgpa=lowest_cgpa,
        recent_students=recent_students
    )

# 3. ADD STUDENT
@app.route('/students/add', methods=['GET', 'POST'])
def add_student():
    if request.method == 'POST':
        student_id = request.form.get('student_id', '').strip()
        name = request.form.get('name', '').strip()
        gender = request.form.get('gender')
        dob = request.form.get('dob')
        department = request.form.get('department')
        year = request.form.get('year')
        section = request.form.get('section')
        email = request.form.get('email', '').strip()
        phone = request.form.get('phone', '').strip()
        address = request.form.get('address', '').strip()
        cgpa_str = request.form.get('cgpa', '').strip()

        try:
            cgpa = float(cgpa_str)
            if cgpa < 0.0 or cgpa > 10.0:
                raise ValueError("CGPA out of range")
        except ValueError:
            flash('Error: CGPA must be a valid number between 0.00 and 10.00.', 'danger')
            return render_template('add_student.html')

        conn = get_db_connection()
        # Duplicate validation
        existing = conn.execute('SELECT id FROM students WHERE student_id = ? OR email = ?', (student_id, email)).fetchone()
        if existing:
            flash(f'Error: Student ID {student_id} or Email {email} already exists in SQLite!', 'danger')
            conn.close()
            return render_template('add_student.html')

        conn.execute('''
            INSERT INTO students (student_id, name, gender, dob, department, year, section, email, phone, address, cgpa)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (student_id, name, gender, dob, department, year, section, email, phone, address, cgpa))
        conn.commit()
        conn.close()

        flash(f'Success: Student {name} (ID: {student_id}) enrolled in SQLite database.', 'success')
        return redirect(url_for('students'))

    return render_template('add_student.html')

# 4. STUDENT RECORDS
@app.route('/students')
def students():
    conn = get_db_connection()
    all_students = conn.execute('SELECT * FROM students ORDER BY student_id ASC').fetchall()
    conn.close()
    return render_template('students.html', students=all_students)

# 5. STUDENT PROFILE
@app.route('/students/<int:id>')
def profile(id):
    conn = get_db_connection()
    student = conn.execute('SELECT * FROM students WHERE id = ?', (id,)).fetchone()
    conn.close()
    if not student:
        flash('Student record not found.', 'danger')
        return redirect(url_for('students'))
    return render_template('profile.html', student=student)

# 6. EDIT STUDENT
@app.route('/students/<int:id>/edit', methods=['GET', 'POST'])
def edit_student(id):
    conn = get_db_connection()
    student = conn.execute('SELECT * FROM students WHERE id = ?', (id,)).fetchone()

    if not student:
        conn.close()
        flash('Student record not found.', 'danger')
        return redirect(url_for('students'))

    if request.method == 'POST':
        student_id = request.form.get('student_id', '').strip()
        name = request.form.get('name', '').strip()
        gender = request.form.get('gender')
        dob = request.form.get('dob')
        department = request.form.get('department')
        year = request.form.get('year')
        section = request.form.get('section')
        email = request.form.get('email', '').strip()
        phone = request.form.get('phone', '').strip()
        address = request.form.get('address', '').strip()
        cgpa = float(request.form.get('cgpa', 0.0))

        # Check unique constraint excluding self
        dup = conn.execute('SELECT id FROM students WHERE (student_id = ? OR email = ?) AND id != ?', (student_id, email, id)).fetchone()
        if dup:
            flash('Error: Student ID or Email already belongs to another student.', 'danger')
            conn.close()
            return render_template('edit_student.html', student=student)

        conn.execute('''
            UPDATE students SET
                student_id = ?, name = ?, gender = ?, dob = ?, department = ?,
                year = ?, section = ?, email = ?, phone = ?, address = ?, cgpa = ?
            WHERE id = ?
        ''', (student_id, name, gender, dob, department, year, section, email, phone, address, cgpa, id))
        conn.commit()
        conn.close()

        flash(f'Success: Record for {name} updated in SQLite database.', 'success')
        return redirect(url_for('students'))

    conn.close()
    return render_template('edit_student.html', student=student)

# DELETE STUDENT
@app.route('/students/<int:id>/delete', methods=['POST'])
def delete_student(id):
    conn = get_db_connection()
    student = conn.execute('SELECT name, student_id FROM students WHERE id = ?', (id,)).fetchone()
    if student:
        conn.execute('DELETE FROM students WHERE id = ?', (id,))
        conn.commit()
        flash(f'Student {student["name"]} (ID: {student["student_id"]}) deleted from SQLite.', 'info')
    conn.close()
    return redirect(url_for('students'))

# 7. SEARCH SYSTEM
@app.route('/search', methods=['GET', 'POST'])
def search():
    result = None
    if request.method == 'POST':
        algo = request.form.get('algorithm')
        query = request.form.get('query', '').strip()
        search_key = request.form.get('search_key', 'name')

        conn = get_db_connection()
        records = [dict(ix) for ix in conn.execute('SELECT * FROM students').fetchall()]
        conn.close()

        if algo == 'linear':
            result = manual_linear_search(records, query, search_key=search_key)
        elif algo == 'binary':
            # Binary search strictly requires sorted student_id
            sorted_records = manual_bubble_sort(records, key='student_id', order='asc')['sorted_data']
            try:
                target_id = int(query)
                result = manual_binary_search(sorted_records, target_id)
            except ValueError:
                flash('Binary search requires a numeric Student ID.', 'danger')

    return render_template('search.html', result=result)

# 8. SORTING SYSTEM
@app.route('/sorting', methods=['GET', 'POST'])
def sorting():
    result = None
    if request.method == 'POST':
        algo = request.form.get('algorithm', 'bubble')
        key = request.form.get('sort_key', 'cgpa')
        order = request.form.get('sort_order', 'desc')

        conn = get_db_connection()
        records = [dict(ix) for ix in conn.execute('SELECT * FROM students').fetchall()]
        conn.close()

        if algo == 'bubble':
            result = manual_bubble_sort(records, key=key, order=order)
        elif algo == 'merge':
            result = manual_merge_sort(records, key=key, order=order)

    return render_template('sorting.html', result=result)

# 9. LINKED LIST / DSA LAB
@app.route('/dsa', methods=['GET', 'POST'])
def dsa():
    message = None
    if request.method == 'POST':
        action = request.form.get('action')
        if action == 'insert_head':
            s_id = int(request.form.get('student_id', 115))
            name = request.form.get('name', 'Demo Student')
            dept = request.form.get('department', 'CSE')
            cgpa = float(request.form.get('cgpa', 8.5))
            lab_linked_list.insert_at_head(s_id, name, dept, cgpa)
            message = f"Inserted Node [{s_id} {name}] at HEAD (O(1))."
        elif action == 'insert_tail':
            s_id = int(request.form.get('student_id', 115))
            name = request.form.get('name', 'Demo Student')
            dept = request.form.get('department', 'CSE')
            cgpa = float(request.form.get('cgpa', 8.5))
            lab_linked_list.insert_at_tail(s_id, name, dept, cgpa)
            message = f"Inserted Node [{s_id} {name}] at TAIL (O(n))."
        elif action == 'delete':
            s_id = int(request.form.get('student_id', 0))
            deleted = lab_linked_list.delete_by_id(s_id)
            if deleted:
                message = f"Deleted Node [{s_id}] from linked list (O(n))."
            else:
                message = f"Node [{s_id}] not found in linked list."
        elif action == 'reset':
            reload_lab_linked_list()
            message = "Reset Linked List to initial sample nodes."

    nodes = lab_linked_list.to_list()
    chain_display = lab_linked_list.display()
    return render_template('dsa.html', nodes=nodes, chain_display=chain_display, message=message)

# 10. DSA COMPLEXITY SECTION
@app.route('/complexity')
def complexity():
    return render_template('complexity.html')

# 11. REPORTS
@app.route('/reports')
def reports():
    conn = get_db_connection()
    students = conn.execute('SELECT * FROM students').fetchall()
    conn.close()

    total = len(students)
    cgpa_list = [float(s['cgpa']) for s in students] if students else [0.0]
    avg_cgpa = round(sum(cgpa_list) / len(cgpa_list), 2) if cgpa_list else 0.0

    return render_template('reports.html', students=students, total=total, avg_cgpa=avg_cgpa)

# 12. ABOUT PROJECT
@app.route('/about')
def about():
    return render_template('about.html')

if __name__ == '__main__':
    init_db()
    app.run(debug=True, host='0.0.0.0', port=5000)
`
