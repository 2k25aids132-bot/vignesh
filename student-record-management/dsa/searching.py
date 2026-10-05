"""
MANUAL SEARCHING ALGORITHMS
DSA Capstone Project: Student Record Management System
Strict constraints:
- Linear Search: sequential inspection, O(n)
- Binary Search: midpoint division, O(log n), REQUIRES SORTED DATA
- STRICTLY NO Python index(), find(), filter(), hash tables, sets, or dict lookups
"""

def manual_linear_search(records, target, search_key='name'):
    """
    LINEAR SEARCH
    Time Complexity: Best O(1), Average O(n), Worst O(n)
    Auxiliary Space: O(1)
    """
    comparisons = 0
    target_str = str(target).strip().lower()

    for i in range(len(records)):
        comparisons += 1
        record = records[i]
        val = str(record.get(search_key, '')).strip().lower()

        if val == target_str or (search_key == 'name' and target_str in val):
            return {
                "algorithm": "Linear Search",
                "found": True,
                "student": record,
                "comparisons": comparisons,
                "time_complexity": "O(n)",
                "index": i,
                "notes": f"Found at index {i} after {comparisons} sequential comparisons."
            }

    return {
        "algorithm": "Linear Search",
        "found": False,
        "student": None,
        "comparisons": comparisons,
        "time_complexity": "O(n)",
        "notes": f"Scanned all {comparisons} records without finding target."
    }


def manual_binary_search(sorted_records, target_id):
    """
    BINARY SEARCH
    Time Complexity: Best O(1), Average O(log n), Worst O(log n)
    Auxiliary Space: O(1)
    PREREQUISITE: sorted_records MUST be ascending by student_id.
    """
    low = 0
    high = len(sorted_records) - 1
    comparisons = 0
    target_id = int(target_id)
    steps = []

    while low <= high:
        comparisons += 1
        mid = (low + high) // 2
        mid_id = int(sorted_records[mid]['student_id'])

        steps.append({
            "step": comparisons,
            "low": low,
            "high": high,
            "mid": mid,
            "mid_id": mid_id
        })

        if mid_id == target_id:
            return {
                "algorithm": "Binary Search",
                "found": True,
                "student": sorted_records[mid],
                "comparisons": comparisons,
                "time_complexity": "O(log n)",
                "steps": steps,
                "notes": f"Target ID {target_id} identified at midpoint {mid} in {comparisons} divisions."
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
        "time_complexity": "O(log n)",
        "steps": steps,
        "notes": f"Target ID {target_id} not found after {comparisons} logarithmic divisions."
    }

def is_sorted_by_id(records):
    """Verifies that records are in ascending order by student_id."""
    for i in range(len(records) - 1):
        if int(records[i]['student_id']) > int(records[i + 1]['student_id']):
            return False
    return True
