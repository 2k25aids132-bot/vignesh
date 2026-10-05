"""
MANUAL SORTING ALGORITHMS
DSA Capstone Project: Student Record Management System
Strict constraints:
- Bubble Sort: pairwise comparisons, swap counts, early exit flag O(n²)
- Merge Sort: divide-and-conquer, sublist division and merge O(n log n)
- STRICTLY NO sort(), sorted(), or library sorting algorithms
"""

def _compare(a, b, key, order):
    """Internal manual comparator."""
    val_a = a[key]
    val_b = b[key]
    if isinstance(val_a, str):
        val_a = val_a.lower()
        val_b = val_b.lower()

    if val_a < val_b:
        diff = -1
    elif val_a > val_b:
        diff = 1
    else:
        diff = 0

    return diff if order == 'asc' else -diff


def manual_bubble_sort(input_records, key='student_id', order='asc'):
    """
    BUBBLE SORT
    Time Complexity: Best O(n), Average O(n²), Worst O(n²)
    Auxiliary Space: O(1) in-place
    """
    arr = [dict(x) for x in input_records]
    n = len(arr)
    comparisons = 0
    swaps = 0

    for i in range(n):
        swapped = False
        for j in range(0, n - i - 1):
            comparisons += 1
            if _compare(arr[j], arr[j + 1], key, order) > 0:
                # Manual element swap
                temp = arr[j]
                arr[j] = arr[j + 1]
                arr[j + 1] = temp
                swaps += 1
                swapped = True

        # Optimized termination if already sorted
        if not swapped:
            break

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
    MERGE SORT (Divide and Conquer)
    Time Complexity: Best O(n log n), Average O(n log n), Worst O(n log n)
    Auxiliary Space: O(n) memory
    """
    arr = [dict(x) for x in input_records]
    comparisons = [0]
    merge_tree = []

    def merge(left, right, depth):
        merged = []
        i = j = 0

        while i < len(left) and j < len(right):
            comparisons[0] += 1
            if _compare(left[i], right[j], key, order) <= 0:
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

        merge_tree.append({
            "stage": f"Merge Level {depth}",
            "description": f"Merged {len(left)} and {len(right)} items into {len(merged)} sorted items."
        })

        return merged

    def sort_recursive(sublist, depth=0):
        if len(sublist) <= 1:
            return sublist

        mid = len(sublist) // 2
        left_half = []
        right_half = []

        for k in range(0, mid):
            left_half.append(sublist[k])
        for k in range(mid, len(sublist)):
            right_half.append(sublist[k])

        sorted_left = sort_recursive(left_half, depth + 1)
        sorted_right = sort_recursive(right_half, depth + 1)

        return merge(sorted_left, sorted_right, depth)

    sorted_result = sort_recursive(arr)

    return {
        "algorithm": "Merge Sort",
        "key": key,
        "order": order,
        "sorted_data": sorted_result,
        "comparisons": comparisons[0],
        "swaps": 0,
        "time_complexity": "O(n log n)",
        "space_complexity": "O(n)",
        "merge_tree": merge_tree
    }
