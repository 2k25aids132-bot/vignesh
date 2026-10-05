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

-- Seed initial sample records for immediate demo
INSERT OR IGNORE INTO students (student_id, name, gender, dob, department, year, section, email, phone, address, cgpa)
VALUES
(101, 'Arun Kumar', 'Male', '2004-05-14', 'Artificial Intelligence & Data Science', '3rd Year', 'A', 'arun.k@college.edu', '9845012340', '14, Gandhi Road, Salem', 8.85),
(102, 'Priya Sharma', 'Female', '2004-08-22', 'Computer Science and Engineering', '3rd Year', 'B', 'priya.s@college.edu', '9845012341', '45, Anna Nagar, Coimbatore', 9.20),
(103, 'Kavin Raj', 'Male', '2005-02-18', 'Information Technology', '2nd Year', 'A', 'kavin.r@college.edu', '9845012342', '78, Cross Cut Road, Trichy', 7.65),
(104, 'Divya Mohan', 'Female', '2003-11-05', 'Electronics & Communication', '4th Year', 'A', 'divya.m@college.edu', '9845012343', '22, Raja Street, Madurai', 9.45),
(105, 'Rahul Verma', 'Male', '2005-04-12', 'Mechanical Engineering', '2nd Year', 'B', 'rahul.v@college.edu', '9845012344', '109, Nehru Boulevard, Salem', 8.10),
(106, 'Ananya Iyer', 'Female', '2006-01-30', 'Computer Science and Engineering', '1st Year', 'A', 'ananya.i@college.edu', '9845012345', '12, Temple View, Chennai', 9.60),
(107, 'Karthik Sundar', 'Male', '2004-09-17', 'Artificial Intelligence & Data Science', '3rd Year', 'B', 'karthik.s@college.edu', '9845012346', '88, Lake View, Erode', 8.40),
(108, 'Sneha Patel', 'Female', '2003-12-08', 'Information Technology', '4th Year', 'A', 'sneha.p@college.edu', '9845012347', '33, College Road, Namakkal', 7.90);
