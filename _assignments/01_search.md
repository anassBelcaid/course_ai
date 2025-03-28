---
layout: distill
title: AI Fundamentals Project 1
description: The first project on Ai fundamentals course to apply the classical search algorithms to guide pacman.
tags: cs188 project
date: 2025-03-15
due_date: 2025-03-29
description: "In this assignment, students will implement basic machine learning algorithms and explore fundamental concepts."
giscus_comments: true
date: 2025-02-9
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
  - name: Welcome to Pacman
  - name: Q1 (3 pts) Finding a fixed food dot
  - name: Q2 (3 pts) Breadth First Search
  - name: Q3 (3 pts) Varying the Cost Function
  - name: Q4 (3 pts) A* Search
  - name: Q5 (3 pts) Finding all the corners
  - name: Q6 (3 pts) Corners Problem Heuristic
  - name: Q7 (4 pts) Eating all the dots
  - name: Q8 (3 pts) Suboptimal Search

---

<div class="row mt-3">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="/assets/img/cover.png" class="img-fluid rounded z-depth-1 zoomable=true" %}
    </div>
</div>
<div class="caption">
    All those colored walls, Mazes give Pacman the blues, So teach him to search.
</div>

##  Introduction
In this project, your Pacman agent will find paths through his maze world, both to reach a particular location and to collect food efficiently. You will build general search algorithms and apply them to Pacman scenarios.

As in Project 0, this project includes an autograder for you to grade your answers on your machine. This can be run with the command:

```shell
python autograder.py
```
See the autograder tutorial in Project 0 for more information about using the autograder.

The code for this project consists of several Python files, some of which you will need to read and understand in order to complete the assignment, and some of which you can ignore. You can download all the code and supporting files as a 
<a href="{{ '/assets/img/pacman_search/search.zip' | relative_url }}">search.zip</a>


| **Category**                 | **File**                | **Description** |
|------------------------------|-------------------------|----------------|
| **Files You'll Edit**        | `search.py`            | Contains search algorithms (DFS, BFS, UCS, A*). |
|                              | `searchAgents.py`      | Contains search-based agents and heuristics. |
| **Files You Might Want to Look At** | `pacman.py`           | Main file that runs Pacman games, contains `GameState`. |
|                              | `game.py`              | Logic behind the Pacman world (e.g., `Agent`, `Direction`, `Grid`). |
|                              | `util.py`              | Useful data structures (stack, queue, priority queue). |
| **Supporting Files You Can Ignore** | `graphicsDisplay.py`   | Handles Pacman graphics. |
|                              | `graphicsUtils.py`     | Support for Pacman graphics. |
|                              | `textDisplay.py`       | ASCII-based graphics for Pacman. |
|                              | `ghostAgents.py`       | Controls ghost agents. |
|                              | `keyboardAgents.py`    | Handles keyboard input for Pacman. |
|                              | `layout.py`            | Reads and stores layout files. |
|                              | `autograder.py`        | Runs automatic grading for the project. |
|                              | `testParser.py`        | Parses test cases for grading. |
|                              | `testClasses.py`       | General test case classes. |
|                              | `test_cases/`          | Directory containing test cases. |
|                              | `searchTestClasses.py` | Specific test cases for Project 1. |


##  Welcome to Pacman
After downloading the code, unzipping it, and changing to the directory, you should be able to play a game of Pacman by typing the following at the command line:

```shell
python pacman.py
```


Pacman lives in a shiny blue world of twisting corridors and tasty round treats. Navigating this world efficiently will be Pacman’s first step in mastering his domain.

The simplest agent in `searchAgents.py` is called the `GoWestAgent`, which always goes West (a trivial reflex agent). This agent can occasionally win:

```shell
python pacman.py --layout testMaze --pacman GoWestAgent
```

But, things get ugly for this agent when turning is required:

```shell
python pacman.py --layout tinyMaze --pacman GoWestAgent
```

If Pacman gets stuck, you can exit the game by typing **CTRL-c** into your terminal.

Soon, your agent will solve not only `tinyMaze`, but any maze you want.

Note that pacman.py supports a number of options that can each be expressed in a long way (e.g., --layout) or a short way (e.g., -l). You can see the list of all options and their default values via:


```shell
python pacman.py -h
```
Also, all of the commands that appear in this project also appear in commands.txt, for easy copying and pasting. In UNIX/Mac OS X, you can even run all these commands in order with bash **commands.txt**.

##  Q1 (3 pts) Finding a fixed food dot

In `searchAgents.py`, you’ll find a fully implemented `SearchAgent`, which plans out a path through Pacman’s world and then executes that path step-by-step. The search algorithms for formulating a plan **are not implemented** – that’s your job.

First, test that the `SearchAgent` is working correctly by running:

```shell
python pacman.py -l tinyMaze -p SearchAgent -a fn=tinyMazeSearch
```

The command above tells the `SearchAgent` to use tinyMazeSearch as its search algorithm, which is implemented in `search.py`. Pacman should navigate the maze successfully.

Now it’s time to write full-fledged generic search functions to help Pacman plan routes! Pseudocode for the search algorithms you’ll write can be found in the lecture slides. Remember that a search node must contain not only a state but also the information necessary to **reconstruct the path (plan)** which gets to that state.

**Important note**: All of your search functions need to return a list of actions that will lead the agent from the start to the goal. These actions all have to be legal moves (valid directions, no moving through walls).

**Important note**: Make sure to use the Stack, Queue and PriorityQueue data structures provided to you in `util.py`! These data structure implementations have particular properties which are required for compatibility with the autograder.

> Hint: Each algorithm is very similar. Algorithms for DFS, BFS, UCS, and A* differ only in the details of how the fringe is managed. So, concentrate on getting DFS right and the rest should be relatively straightforward. Indeed, one possible implementation requires only a single generic search method which is configured with an algorithm-specific queuing strategy. (Your implementation need not be of this form to receive full credit).


Implement the **depth-first search (DFS)** algorithm in the depthFirstSearch function in `search.py`. To make your algorithm complete, write the graph search version of DFS, which avoids expanding any already visited states.

Your code should quickly find a solution for:

```shell
python pacman.py -l tinyMaze -p SearchAgent
python pacman.py -l mediumMaze -p SearchAgent
python pacman.py -l bigMaze -z .5 -p SearchAgent
```
The Pacman board will show an overlay of the states explored, and the order in which they were explored (brighter red means earlier exploration). Is the exploration order what you would have expected? 

> Does Pacman actually go to all the explored squares on his way to the goal?

**Hint**: If you use a Stack as your data structure, the solution found by your DFS algorithm for mediumMaze should have a length of 130 (provided you push successors onto the fringe in the order provided by getSuccessors; you might get 246 if you push them in the reverse order). Is this a least cost solution? If not, think about what depth-first search is doing wrong.

**Grading**: Please run the below command to see if your implementation passes all the autograder test cases.

```shell
python autograder.py -q q1
```


##  Q2 (3 pts) Breadth First Search

Implement the **breadth-first search (BFS) algorithm in the breadthFirstSearch function in search.py. Again, write a graph search algorithm that avoids expanding any already visited states. Test your code the same way you did for depth-first search.

```shell
python pacman.py -l mediumMaze -p SearchAgent -a fn=bfs
python pacman.py -l bigMaze -p SearchAgent -a fn=bfs -z .5
```

Does BFS find a least cost solution? If not, check your implementation.

**Hint**: If Pacman moves too slowly for you, try the option –frameTime 0.

**Note*: If you’ve written your search code generically, your code should work equally well for the eight-puzzle search problem without any changes.

```shell
python eightpuzzle.py
```

**Grading**: Please run the below command to see if your implementation passes all the autograder test cases.


```shell
python autograder -q q2
```


##  Q3 (3 pts) Varying the Cost Function

While BFS will find a fewest-actions path to the goal, we might want to find paths that are **best** in other senses. Consider mediumDottedMaze and mediumScaryMaze.

By changing the cost function, we can encourage Pacman to find different paths. For example, we can charge more for dangerous steps in ghost-ridden areas or less for steps in food-rich areas, and a rational Pacman agent should adjust its behavior in response.

Implement the **uniform-cost** graph search algorithm in the uniformCostSearch function in search.py. We encourage you to look through `util.py` for some data structures that may be useful in your implementation. You should now observe successful behavior in all three of the following layouts, where the agents below are all UCS agents that differ only in the cost function they use (the agents and cost functions are written for you):


```shell
python pacman.py -l mediumMaze -p SearchAgent -a fn=ucs
python pacman.py -l mediumDottedMaze -p StayEastSearchAgent
python pacman.py -l mediumScaryMaze -p StayWestSearchAgent
```

**Note**: You should get very low and very high path costs for the StayEastSearchAgent and StayWestSearchAgent respectively, due to their exponential cost functions (see searchAgents.py for details).

**Grading**: Please run the below command to see if your implementation passes all the autograder test cases.

```shell
python autograder.py -q q3
```

##  Q4 (3 pts) A* Search

Implement **A* search** in the empty function aStarSearch in `search.py`. A* takes a **heuristic function** as an argument. Heuristics take two arguments: a state in the search problem (the main argument), and the problem itself (for reference information). The nullHeuristic heuristic function in search.py is a trivial example.

You can test your A* implementation on the original problem of finding a path through a maze to a fixed position using the Manhattan distance heuristic (implemented already as manhattanHeuristic in searchAgents.py).

**Hint**: In addition to keeping track of the visited state, you may also want to keep track of the best path cost to that state so far. Some nodes may need to be expanded more than once to find the optimal path.

```shell
python pacman.py -l bigMaze -z .5 -p SearchAgent -a fn=astar,heuristic=manhattanHeuristic
```

You should see that A* finds the optimal solution slightly faster than uniform cost search (about 549 vs. 620 search nodes expanded in our implementation, but ties in priority may make your numbers differ slightly). What happens on openMaze for the various search strategies?

**Grading**: Please run the below command to see if your implementation passes all the autograder test cases.

```shell
python autograder.py -q q4
```

##  Q5 (3 pts) Finding all the corners

The real power of A* will only be apparent with a more **challenging search** problem. Now, it’s time to formulate a new problem and design a heuristic for it.

In corner mazes, there are four dots, one in each corner. Our new search problem is to find the shortest path through the maze that touches all four corners (whether the maze actually has food there or not). Note that for some mazes like tinyCorners, the shortest path does not always go to the closest food first! Hint: the shortest path through tinyCorners takes 28 steps.

**Note**: Make sure to complete Question 2 before working on Question 5, because Question 5 builds upon your answer for Question 2.

Implement the `CornersProblem` search problem in `searchAgents.py`. You will need to choose a state representation that encodes all the information necessary to detect whether all four corners have been reached. Now, your search agent should solve:


```shell
python pacman.py -l tinyCorners -p SearchAgent -a fn=bfs,prob=CornersProblem
python pacman.py -l mediumCorners -p SearchAgent -a fn=bfs,prob=CornersProblem
```

To receive full credit, you need to define an abstract state representation that **does not encode irrelevant information** (like the position of ghosts, where extra food is, etc.). In particular, do not use a Pacman GameState as a search state. Your code will be very, very slow if you do (and also wrong).

An instance of the CornersProblem class represents an entire search problem, not a particular state. Particular states are returned by the functions you write, and your functions return a data structure of your choosing (e.g. tuple, set, etc.) that represents a state.

Furthermore, while a program is running, remember that many states simultaneously exist, all on the queue of the search algorithm, and they should be independent of each other. In other words, you should not have only one state for the entire CornersProblem object; your class should be able to generate many different states to provide to the search algorithm.

**Hint 1**: The only parts of the game state you need to reference in your implementation are the starting Pacman position and the location of the four corners.

**Hint 2**: When coding up getSuccessors, make sure to add children to your successors list with a cost of 1.

Our implementation of breadthFirstSearch expands just under 2000 search nodes on mediumCorners. However, heuristics (used with A* search) can reduce the amount of searching required.

**Grading**: Please run the below command to see if your implementation passes all the autograder test cases.

```shell
python autograder.py -q q5
```

##  Q6 (3 pts) Corners Problem Heuristic

Note: Make sure to complete Question 4 before working on Question 6, because Question 6 builds upon your answer for Question 4.

Implement a non-trivial heuristic for the CornersProblem in cornersHeuristic.


```shell
python pacman.py -l mediumCorners -p AStarCornersAgent -z 0.5
```

**Note**: AStarCornersAgent is a shortcut for

```shell
-p SearchAgent -a fn=aStarSearch,prob=CornersProblem,heuristic=cornersHeuristic
```

**Admissibility**:
> Remember, heuristics are just functions that take search states and return numbers that estimate the cost to a nearest goal. More effective heuristics will return values closer to the actual goal costs. To be admissible, the heuristic values must be lower bounds on the actual shortest path cost to the nearest goal (and non-negative).

**Non-Trivial Heuristics**:
> The trivial heuristics are the ones that return zero everywhere (UCS) and the heuristic which computes the true completion cost. The former won’t save you any time, while the latter will timeout the autograder. You want a heuristic which reduces total compute time, though for this assignment the autograder will only check node counts (aside from enforcing a reasonable time limit).

**Grading**: Your heuristic must be a non-trivial non-negative heuristic to receive any points. Make sure that your heuristic returns 0 at every goal state and never returns a negative value. Depending on how few nodes your heuristic expands, you’ll be graded:

| **Number of Nodes Expanded** | **Grade**  |
|-----------------------------|------------|
| More than 2000             | 0/3        |
| At most 2000               | 1/3        |
| At most 1600               | 2/3        |
| At most 1200               | 3/3        |


**Grading**: Please run the below command to see if your implementation passes all the autograder test cases.

```shell
python autograder.py -q q6
```

##  Q7 (4 pts) Eating all the dots

Now we’ll solve a hard search problem: eating all the Pacman food in as few steps as possible. For this, we’ll need a new search problem definition which formalizes the food-clearing problem: FoodSearchProblem in searchAgents.py (implemented for you). A solution is defined to be a path that collects all of the food in the Pacman world. For the present project, solutions do not take into account any ghosts or power pellets; solutions only depend on the placement of walls, regular food and Pacman. (Of course ghosts can ruin the execution of a solution! We’ll get to that in the next project.) If you have written your general search methods correctly, A* with a null heuristic (equivalent to uniform-cost search) should quickly find an optimal solution to testSearch with no code change on your part (total cost of 7).


```shell
python pacman.py -l testSearch -p AStarFoodSearchAgent
```

**Note**: AStarFoodSearchAgent is a shortcut for

```shell
-p SearchAgent -a fn=astar,prob=FoodSearchProblem,heuristic=foodHeuristic
```

You should find that UCS starts to slow down even for the seemingly simple tinySearch. As a reference, our implementation takes 2.5 seconds to find a path of length 27 after expanding 5057 search nodes.

**Note**: Make sure to complete Question 4 before working on Question 7, because Question 7 builds upon your answer for Question 4.

Fill in `foodHeuristic` in `searchAgents.py` with a heuristic for the FoodSearchProblem. Try your agent on the trickySearch board:

```shell
python pacman.py -l trickySearch -p AStarFoodSearchAgent
```

Our **UCS** agent finds the optimal solution in about 13 seconds, exploring over 16,000 nodes.

Any non-trivial non-negative heuristic will receive 1 point. Make sure that your heuristic returns 0 at every goal state and never returns a negative value. Depending on how few nodes your heuristic expands, you’ll get additional points:


| **Number of Nodes Expanded** | **Grade**  |
|-----------------------------|------------|
| More than 15,000            | 1/4        |
| At most 15,000              | 2/4        |
| At most 12,000              | 3/4        |
| At most 9,000               | 4/4 (full credit; medium) |
| At most 7,000               | 5/4 (optional extra credit; hard) |


**Grading**: Please run the below command to see if your implementation passes all the autograder test cases.

```shell
python autograder.py -q q7
```


##  Q8 (3 pts) Suboptimal Search

Sometimes, even with A* and a good heuristic, finding the optimal path through all the dots is hard. In these cases, we’d still like to find a reasonably good path, quickly. In this section, you’ll write an agent that always greedily eats the closest dot. ClosestDotSearchAgent is implemented for you in searchAgents.py, but it’s missing a key function that finds a path to the closest dot.

Implement the function `findPathToClosestDot` in `searchAgents.py`. Our agent solves this maze (suboptimally!) in under a second with a path cost of 350:

```shell
python pacman.py -l bigSearch -p ClosestDotSearchAgent -z .5
```

**Hint**: The quickest way to complete findPathToClosestDot is to fill in the AnyFoodSearchProblem, which is missing its goal test. Then, solve that problem with an appropriate search function. The solution should be very short!

Your `ClosestDotSearchAgent` won’t always find the shortest possible path through the maze. Make sure you understand why and try to come up with a small example where repeatedly going to the closest dot does not result in finding the shortest path for eating all the dots.

**Grading**: Please run the below command to see if your implementation passes all the autograder test cases.


```shell
python autograder.py -q q8
```


