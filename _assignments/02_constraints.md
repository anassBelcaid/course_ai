---
layout: distill
title: Constraints Satisfaction Problems
description: Second project on constraints Satisfaction problems
tags: cs188 project
date: 2025-03-20
due_date: 2025-04-08
description: "Assignement on solving the NQueen using backtracking "
giscus_comments: true
featured: true
mermaid:
  enabled: true
  zoomable: true
code_diff: true
map: true
chart:
  chartjs: true
  echarts: true
  vega_lite: true
tikzjax: true
typograms: true

authors:
  - name: Anass Belcaid
    url: "https://anassbelcaid.github.io/"
    affiliations:
      name: IAD, ENSA-Te

bibliography: 2018-12-22-distill.bib

# Optionally, you can add a table of contents to your post.
# NOTES:
#   - make sure that TOC names match the actual section names
#     for hyperlinks within the post to work correctly.
#   - we may want to automate TOC generation in the future using
#     jekyll-toc plugin (https://github.com/toshimaru/jekyll-toc).
toc:
    # if a section has subsections, you can add them as follows:
    # subsections:
    #   - name: Example Child Subsection 1
    #   - name: Example Child Subsection 2
  - name: Introduction
  - name: Question 1 — Valid Board Check (4 pts)
  - name: Question 2 — Backtracking Search (6 pts)
  - name: Question 3 _ Forward checking I
  - name: Question 4 — Forward Checking II (6 pts)
  - name: Question 5 — Solving Sudoku with Forward Checking (10 pts)
  - name: Question 6 — Local Search (Min-Conflicts Heuristic) (10 pts)
---

<center>
<img src="{{ site.url }}{{ site.baseurl }}/assets/project_2.png" alt="Girl in a jacket" width="450" height="450">
</center>

<div class="caption">
    Queens don't like to fight. But drop them on a chessboard, and things get tense. Help them find peace — one smart move at a time.
</div>



## 🧠 Introduction

In this assignment, you'll explore how **Constraint Satisfaction Problems (CSPs)** can be applied to the classic **N-Queens problem** — a challenge of placing N queens on an N×N chessboard so that none attack each other.

You will implement and evaluate two fundamental approaches:

- ✨ **Backtracking Search**: A depth-first strategy that places queens row by row while ensuring the board remains valid.
- 🔁 **Local Search with [Min-Conflicts](https://en.wikipedia.org/wiki/Min-conflicts_algorithm)**: A heuristic method that starts with a complete assignment and iteratively resolves conflicts until a solution emerges.
- 🧩 **Sudoku Solver with [Forward Checking](https://en.wikipedia.org/wiki/Constraint_satisfaction_problem#Constraint_propagation)**: You’ll implement a CSP-based solver that fills in Sudoku puzzles by looking ahead and pruning invalid choices before they’re made.

By the end, you'll not only solidify your understanding of **CSPs and heuristics**, but also visualize how these algorithms behave in real time.

> _Can queens find harmony on the board? That’s your mission._ 👑



Here is the <a href="{{ site.url }}{{ site.baseurl }}/_assignments/csp_homework.zip"> starter code </a> for the project.

## Question 1 — Valid Board Check (4 pts)

Before solving the N-Queens problem, we need a way to verify whether a given board configuration is valid — that is, no two queens are attacking each other.

In this question, your task is to **implement the function `is_valid(queens)`** located in the `cps.py` file.

The function should return `True` if the current queen positions do not conflict (no queens share the same column, row, or diagonal), and `False` otherwise.

You'll be working with a dictionary where the keys are row indices and the values are column positions of queens. For example:

```python
queens = {
    0: 1,
    1: 3,
    2: 0,
    3: 2
}
```

This represents 4 queens placed on a 4×4 board.

### ✅ Your Task

- Open the file: `cps.py`
- Locate the function: `is_valid(queens)`
- Complete the implementation so it correctly checks for conflicts.

### 🧪 To Test Your Code

We’ve provided a test file with unit tests for this function.

To run only the tests related to `is_valid`, use the following command:

```bash
pytest -m is_valid
```

> ✔️ Make sure your implementation passes all test cases before moving on.


## Question 2 — Backtracking Search (6 pts)

One of the classical approaches to solving the **N-Queens problem** is using **backtracking search**. This algorithm attempts to place queens on the board **row by row**, choosing one column at a time, and backtracks whenever a placement leads to an invalid configuration.

The idea is simple:  
- For each row, try placing a queen in every column.
- After placing a queen, check if the board remains valid (i.e., no queens attacking each other).
- If valid, move to the next row.
- If no valid column exists for the current row, backtrack to the previous one and try a different placement.

This process continues recursively until all queens are successfully placed, or no solution is found.

### ✅ Your Task

Implement the function `backtracking(board, row=0)` in the file `csp.py`. This function should:
- Try placing one queen per row.
- Use the `is_valid()` method from Question 1 to ensure validity.
- Use recursion to proceed row by row.
- Use backtracking when a dead-end is reached.

### 🧩 Board Methods Available

The board object passed into your function is an instance of the `ChessBoard` class. You can use the following methods:

| Method                         | Description                              |
|-------------------------------|------------------------------------------|
| `board.place_queen(row, col)` | Place a queen at `(row, col)`            |
| `board.remove_queen(row, col)`| Remove a queen from `(row, col)`         |
| `board.root.update()`         | **Important**: Refreshes the board view  |

> ⚠️ **Attention**: You must call `board.root.update()` after placing or removing a queen to visualize the changes on the board.


### 🧪 To Test Your Code

To test your implementation on a board of size `n` (e.g., 8), use the following command:

```bash
python run_solver.py 8 backtracking
```

This will visually show your backtracking algorithm solving the N-Queens problem on an 8×8 board. You can change the size to any value you like (e.g., 4, 10, 12).

##  Question 3 _ Forward checking I

To enhance the efficiency of solving the N-Queens problem, we now move to a **constraint propagation** technique called **forward checking**.

### 🧠 What Is Forward Checking?

Instead of blindly placing queens and then checking validity, forward checking proactively eliminates choices by identifying **which squares are no longer available** after placing a queen.

To do this, we must compute — at any point in the algorithm — which squares are **forbidden** (i.e., they are attacked by at least one existing queen).


### ✅ Your Task

Implement the function `get_forbidden_squares(queens, board_size)` in the file `csp.py`.

#### Function Signature:

```python
def get_forbidden_squares(queens, board_size):
    ...
```

#### Parameters:
- `queens`: a dictionary of `{row: col}` where each queen is currently placed.
- `board_size`: the size of the board (N).

#### Returns:
- A set of `(row, col)` tuples representing all squares that are under attack by **any** queen currently on the board.


### 📌 Reminder:
A square is considered **forbidden** if it shares:
- The **same column** with another queen.
- The **same diagonal** (positive or negative slope) with another queen.
- The **same row** is automatically excluded by design (we place one queen per row).


### 🧪 To Test Your Code

We’ve included a dedicated test suite for this function. Once implemented, run the following command to test only this part:

```bash
pytest -m get_forbidden
```

<center>
<img src="{{ site.url }}{{ site.baseurl }}/assets/forbidden_squares.png" alt="Girl in a jacket" width="450" height="450">
</center>


## Question 4 — Forward Checking II (6 pts)

Now that you’ve implemented `get_forbidden_squares()`, you’re ready to build a smarter N-Queens solver using **forward checking**.

### 🧠 What Will Your Algorithm Do?

Unlike simple backtracking, this version will:
- Place one queen per row (as before),
- But **before** placing the next queen,
  - It will use `get_forbidden_squares()` to identify all attacked positions,
  - And **only consider valid (non-forbidden)** positions for the next row,
- If no valid columns are left in the next row, it backtracks.

This form of **constraint propagation** helps prune the search space early — making the algorithm significantly faster and more efficient.


### ✅ Your Task

Implement the function `forward_search(board, row=0)` in the file `csp.py`.

#### Requirements:
- Use `get_forbidden_squares()` to determine the current forbidden positions.
- Only attempt placements in columns that are **not forbidden**.
- Recursively move to the next row if a queen is placed successfully.
- Backtrack if a dead-end is reached.


### 🧩 Board Methods Available

As with backtracking, you can use:

| Method                          | Description                              |
|--------------------------------|------------------------------------------|
| `board.place_queen(row, col)`  | Place a queen at `(row, col)`            |
| `board.remove_queen(row, col)` | Remove a queen from `(row, col)`         |
| `board.clear_not_possible()`   | Clear red markers                        |
| `board.mark_not_possible(r,c)` | Mark `(r,c)` as a forbidden (red) square |
| `board.root.update()`          | Refreshes the view (call after updates)  |

> ⚠️ **Important**: Use `board.root.update()` to visualize each step and `mark_not_possible()` to highlight forbidden squares on the board.


### 🧪 To Test Your Implementation

Run the following command to launch your visual solver with forward checking:

```bash
python run_solver.py 8 forward_search
```

You should see:
- Queens being placed row by row,
- Forbidden squares marked in red after each move,
- And a full solution visualized when successful.

> 🎯 Try experimenting with larger board sizes (e.g., 12, 16) to see how forward checking improves performance.


## Question 5 — Solving Sudoku with Forward Checking (10 pts)

Sudoku is another **Constraint Satisfaction Problem (CSP)** where we must assign numbers to a **9×9 grid** while ensuring that:  
- Each **row** contains digits 1-9 exactly once.  
- Each **column** contains digits 1-9 exactly once.  
- Each **3×3 block** contains digits 1-9 exactly once.  

In this question, you will complete a **Sudoku solver using Forward Checking** by implementing two key functions.


## 🧠 **Your Task**

You are given a partially implemented **Sudoku solver**. The GUI, board setup, and visualization methods have been provided. However, you must complete the two most important **CSP methods**:

### 1️⃣ `get_possible_values(board, row, col)`

This function should return a **set of valid numbers** that can be placed at `(row, col)` without violating Sudoku constraints.  

**Implementation Details:**
- A number is valid **if it doesn’t already appear** in:
  - The same **row**.
  - The same **column**.
  - The **3×3 block** the cell belongs to.

#### 🔧 Function Signature (in `soduko_solver.py`):
```python
def get_possible_values(board, row, col):
    ...
```

**Example Usage:**
```python
valid_numbers = get_possible_values(board, 2, 4)
print(valid_numbers)  # Output: {1, 3, 5, 6, 9} (depends on board state)
```

### 2️⃣ `solve_with_forward_checking(board)`

This function should implement **Sudoku solving using Forward Checking**:
- **Find the next empty cell** (row, col).
- **Use `get_possible_values()`** to determine valid numbers for that position.
- **Try placing a valid number**, then recursively solve the rest of the board.
- **Backtrack if needed** when no valid numbers remain.

#### 🔧 Function Signature (in `soduko_solver.py`):
```python
def solve_with_forward_checking(board):
    ...
```


## 🧩 **What’s Already Provided?**
You **do not** need to worry about:
- The **Sudoku board visualization** (it’s already coded).
- The **GUI updates** (handled automatically).
- The **Sudoku grid setup** (a test puzzle is included).

Your focus is **only on implementing these two methods**.

### 🧪 **To Test Your Code**

Once implemented, run the following command to test your solver:

```bash
python sudoku_solver.py
```

<center>
<img src="{{ site.url }}{{ site.baseurl }}/assets/soduko.png" alt="Girl in a jacket" width="450" height="450">
</center>

- First, you will see the **original puzzle**.
- After **3 seconds**, the board should **fill in the solution** if your functions are correct.
- If the solution is incorrect or doesn’t appear, debug your `get_possible_values()` function.


## 💡 **Hints**
- To extract all numbers in a row: `board[row]`
- To extract all numbers in a column: `[board[r][col] for r in range(9)]`
- To find the **3×3 block’s starting row/col**, use:
  ```python
  start_row, start_col = 3 * (row // 3), 3 * (col // 3)
  ```

> 🚀 **Challenge:** Try solving a **16×16 Sudoku** (instead of 9×9) by modifying the board size!  


## Question 6 — Local Search (Min-Conflicts Heuristic) (10 pts)

To wrap up the assignment, you’ll implement a **local search strategy** for solving the N-Queens problem using the powerful **Min-Conflicts heuristic**.

This approach is particularly effective for **high-dimensional boards** (N > 100), where traditional backtracking or forward checking would struggle.


Local search starts with a **complete but possibly invalid assignment** — placing one queen per row, even if there are conflicts. Then, it repeatedly improves the solution by:

1. Selecting a queen that's in conflict.
2. Moving it within its row to the column that causes the **fewest conflicts**.
3. Repeating this process until the board is conflict-free or a max number of steps is reached.

This is known as the **Min-Conflicts Algorithm**.  
It’s fast, efficient, and surprisingly effective — even for large boards like 1000×1000.


You will implement the following three functions in the file `csp.py`.

### 1️⃣ `count_conflicts(queens, row, col)`

This function returns the number of queens that would be attacking a queen if it were placed at position `(row, col)`.

**Hints:**
- Count queens already placed in the same column or on the same diagonal.
- Do not count the queen in the same row (since only one queen per row is placed).

### 2️⃣ `get_conflicted_rows(queens)`

Returns a list of all row indices where the queen is **currently in conflict** with another queen.

This helps us identify which queen to move during each iteration of local search.


### 3️⃣ `min_conflicts(board, max_steps=1000)`

The main solver. It should:
- Start with a random initial placement (1 queen per row).
- For up to `max_steps`, do:
  - Pick a row with a conflicted queen.
  - Move the queen in that row to the column with the **fewest conflicts**.
  - Update the board visually using `board.place_queen(...)` and `board.remove_queen(...)`.

If a solution is found (no conflicts remain), return `True`.  
If `max_steps` is reached and conflicts still exist, return `False`.

### 🧪 To Test Your Implementation

Try running your local search algorithm on a **large board** to see how fast it performs:

```bash
python run_solver.py 100 min_conflicts
```

You should see a solution computed quickly — even for 100×100 boards!

> 🧠 Try increasing N to 200, 500, or even 1000 to explore the scalability of local search.


<center>
<img src="{{ site.url }}{{ site.baseurl }}/assets/nqueens_conflicts.png" alt="Girl in a jacket" width="450" height="450">
</center>


### 🚀 Bonus Challenge (No Extra Points)
- Add a **random restart** if a solution isn’t found after `max_steps`.
- Track and display the number of steps taken or conflicts resolved.

