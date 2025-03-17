---
layout: distill
title:  Constrained Satisfaction Problems
description: Algorithms for Constrained Satisfaction Problems
date: 2025-03-16

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
  - name: Constraint Satisfaction Problems
    subsections:
     - name: Constraint Graphs
  - name: Solving Constraint Satisfaction Problems
  - name: Filtering
  - name: Ordering
    subsections:
     - name : Structure
  - name: Local Search
    subsections:
      - name : Hill-Climbing Search
      - name : Simulated Annealing Search
      - name : Genetic Algorithms
  - name: Summary
    
---

## Constraint Satisfaction Problems

In the previous note, we learned how to find optimal solutions to search problems, a type of **planning problem**. Now, we’ll learn about solving a related class of problems, `constraint satisfaction problems` (CSPs). Unlike search problems, CSPs are a type of **identification problem**, problems in which we must simply identify whether a state is a goal state or not, with no regard to how we arrive at that goal. CSPs are defined by three factors:


1. **Variables** - CSPs possess a set of $N$ variables $X_1, \ldots, X_N$ that can each take on a single value from some defined set of values.
2. **Domain** - A set $\left[x_1, \ldots, x_n\right]$ representing all possible values that a CSP variable can take on.
3. **Constraints** - Constraints define restrictions on the values of variables, potentially with regard to other variables.

Consider the $N$-queens identification problem: given an $N\times N$ chessboard, can we find a configuration in which to place $N$ queens on the board such that no two queens attack each another?

<center>
<img src="{{ site.url }}{{ site.baseurl }}/csp/n-queens.png" alt="Girl in a jacket" width="400" height="400">
</center>


We can formulate this problem as a CSP as follows:

1. **Variables** $X_{ij}$, with $0 \leq i, j < N$
. Each $X_{i,j}$ represents a grid position on our $N \times N$ chessboard, with $i$ and $j$ specifying the row and column number respectively.
1. **Domain** - $\left\\{0,1\right\\}$. Each $X_{i,j}$ can take on either the value 0 or 1, a boolean value representing the existence of a queen at position $(i, j)$ on the board.
2. **Constraints**
 - $\forall i, j, k (X_{ij}, X{ik}) \in \\{ (0,0), (1, 0), (0, 1) \\}$ This constraint states that if two variables have the same value for $i$, only one of them can take on a value of 1. This effectively encapsulates the condition that no two queens can be in the same row.
 - $\forall i, j, k (X_{ij}, X{kj}) \in \\{ (0,0), (1, 0), (0, 1) \\}$  Almost identically to the previous constraint, this constraint states that if two variables have the same value for $j$, only one of them can take on a value of 1, encapsulating the condition that no two queens can be in the same column.
 - $\forall i, j, k (X_{ij}, X{i+k, j + k}) \in \\{ (0,0), (1, 0), (0, 1) \\}$ With similar reasoning as above, we can see that this constraint and the next represent the conditions that no two queens can be in the same major or minor diagonals, respectively.
 - $\forall i, j, k (X_{ij}, X{i+k, j - k}) \in \\{ (0,0), (1, 0), (0, 1) \\}$
 - $\sum_{i,j} X_{i,j} = N$ This constraint states that we must have exactly $N$ grid positions marked with a 1, and all others marked with a 0, capturing the requirement that there are exactly  $N$ queens on the board.

Constraint satisfaction problems are **NP-hard**, which loosely means that there exists no known algorithm for finding solutions to them in polynomial time. Given a problem with $N$ variables with domain of size $\mathcal{O}(d)$ for each variable, there are $\mathcal{O}(d^N)$ possible assignments, exponential in the number of variables. We can often get around this caveat by formulating CSPs as search problems, defining states as **partial assignments** (variable assignments to CSPs where some variables have been assigned values while others have not). Correspondingly, the successor function for a CSP state outputs all states with one new variable assigned, and the goal test verifies all variables are assigned and all constraints are satisfied in the state it’s testing. Constraint satisfaction problems tend to have significantly more structure than traditional search problems, and we can exploit this structure by combining the above formulation with appropriate heuristics to hone in on solutions in a feasible amount of time.

### Constraint Graphs

Let’s introduce a second CSP example: map coloring. Map coloring solves the problem where we’re given a set of colors and must color a map such that no two adjacent states or regions have the same color.

<center>
<img src="{{ site.url }}{{ site.baseurl }}/csp/map-coloring-comic.png" alt="Girl in a jacket" width="700" height="500">
</center>

Constraint satisfaction problems are often represented as constraint graphs, where nodes represent variables and edges represent constraints between them. There are many different types of constraints, and each is handled slightly differently:

- **Unary Constraints** - Unary constraints involve a single variable in the CSP. They are not represented in constraint graphs, instead simply being used to prune the domain of the variable they constrain when necessary.
- **Binary Constraints** - Binary constraints involve two variables. They’re represented in constraint graphs as traditional graph edges.
- **Higher-order Constraints** - Constraints involving three or more variables can also be represented with edges in a CSP graph, they just look slightly unconventional.

Consider map coloring the map of Australia:

<center>
<img src="{{ site.url }}{{ site.baseurl }}/csp/australia-map.png" alt="Girl in a jacket" width="700" height="500">
</center>

The constraints in this problem are simply that no two adjacent states can be the same color. As a result, by drawing an edge between every pair of states that are adjacent to one another, we can generate the constraint graph for the map coloring of Australia as follows:


<center>
<img src="{{ site.url }}{{ site.baseurl }}/csp/australia-graph.png" alt="Girl in a jacket" width="700" height="500">
</center>

The value of constraint graphs is that we can use them to extract valuable information about the structure of the CSPs we are solving. By **analyzing the graph of a CSP**, we can determine things about it like whether it’s sparsely or densely connected/constrained and whether or not it’s tree-structured. We’ll cover this more in depth as we discuss solving constraint satisfaction problems in more details.

## Solving Constraint Satisfaction Problems

Constraint satisfaction problems are traditionally solved using a search algorithm known as backtracking search. **[Backtracking search](https://en.wikipedia.org/wiki/Backtracking)** is an optimization on depth-first search used specifically for the problem of constraint satisfaction, with improvements coming from two main principles:

1. Fix an *ordering* for variables, and select values for variables in this order. Because assignments are commutative (e.g. assigning WA=Red, NT=Green) is identical to NT=Green,WA=Red), this is valid.

2. When selecting values for a variable, only select values that don’t conflict with any previously assigned values. If no such values exist, backtrack and return to the previous variable, changing its value.

The pseudocode for how recursive backtracking works is presented below:


<center>
<img src="{{ site.url }}{{ site.baseurl }}/csp/backtracking-search-pseudo.png" alt="Girl in a jacket" width="700" height="500">
</center>
<div class="caption">
Pseudo code for the backtracking search algorithm
</div>

For a visualization of how this process works, consider the partial search trees for both depth-first search and backtracking search in map coloring:



<center>
<img src="{{ site.url }}{{ site.baseurl }}/csp/dfs-vs-backtracking.png" alt="Girl in a jacket" width="700" height="500">
</center>
<div class = "caption">
Note how DFS regretfully colors everything red before ever realizing the need for change, and even then doesn’t move too far in the right direction towards a solution. On the other hand, backtracking search only assigns a value to a variable if that value violates no constraints, leading to significantly less backtracking. Though backtracking search is a vast improvement over the brute-forcing of depth-first search, we can get more gains in speed still with further improvements through filtering, variable/value ordering, and structural exploitation
</div>

### Filtering

The first improvement to CSP performance we’ll consider is **filtering**, which checks if we can prune the domains of unassigned variables ahead of time by removing values we know will result in backtracking. A naïve method for filtering is **forward checking**, which whenever a value is assigned to a variable $X_i$, prunes the domains of unassigned variables that share a constraint with $X_i$ that would violate the constraint if assigned. Whenever a new variable is assigned, we can run forward checking and prune the domains of unassigned variables adjacent to the newly assigned variable in the constraint graph. Consider our map coloring example, with unassigned variables and their potential values:


<center>
<img src="{{ site.url }}{{ site.baseurl }}/csp/forward-checking.png" alt="Girl in a jacket" width="900" height="250">
</center>
<div class = "caption">
Illustration for filtering using forward search. Each time a variable is assigned we will remove all the inconsistent values from its neighbors.
</div>

Note how as we assign WA=red and then Q=green, the size of the domains for NT, NSW, and SA
(states adjacent to WA, Q, or both) decrease in size as values are eliminated.

> The idea of forward checking can be generalized into the principle of **arc consistency**. For arc consistency, we interpret each undirected edge of the constraint graph for a CSP as two directed edges pointing in opposite directions. Each of these directed edges is called an **arc**. The arc consistency algorithm works as follows:

1. Begin by storing all arcs in the constraint graph for the CSP in a queue Q.
2. Iteratively remove arcs from Q and enforce the condition that in each removed arc $X_i \rightarrow X_j$ , for every remaining value $v$ for the tail variable $X_i$, there is at least one remaining value $w$ for the head variable $X_j$ such that $X_i=v$, $X_j =w$ does not violate any constraints. If some value $v$ for $X_i$ would not work with any of the remaining values for 
$X_j$, we remove $v$ from the set of possible values for $X_i$.
3. If at least one value is removed for $X_i$ when enforcing arc consistency for an arc $X_i \rightarrow X_j$
, add arcs of the form $X_k \rightarrow X_i$ to $Q$ , for all unassigned variables  $X_k$. If an arc 
$X_k\rightarrow X_i$ is already in $Q$ during this step, it doesn’t need to be added again.
4. Continue until $Q$ is empty, or the domain of some variable is empty and triggers a backtrack.


<center>
<img src="{{ site.url }}{{ site.baseurl }}/csp/arc-consistency-ex-1.png" alt="Girl in a jacket" width="800" height="150">
</center>

We begin by adding all arcs between unassigned variables sharing a constraint to a queue 
Q
, which gives us:

$$
Q = [\text{SA}\rightarrow \text{V}, \text{V}\rightarrow \text{SA},\text{SA}\rightarrow \text{NSW}, \text{NSW}\rightarrow \text{SA},\text{SA}\rightarrow \text{NT}, \text{NT}\rightarrow \text{SA}, \text{V}\rightarrow \text{NSW}, \text{NSW}\rightarrow \text{V}]
$$

For our first arc, $\text{SA}\rightarrow \text{V}$ , we see that for every value in the domain of SA, $\\{\text{blue},\\}$
, there is at least one value in the domain of V = $\\{ \text{red}, \text{green}, \text{blue}\\}
, that **violates no constraints**, and so no values need to be pruned from SA’s domain. However, for our next arc 
$\text{V}\rightarrow \text{SA}$ , if we set $V=\text{blue}$ we see that SA will have no remaining values that violate no constraints, and so we prune blue from V’s domain.

<center>
<img src="{{ site.url }}{{ site.baseurl }}/csp/arc-consistency-ex-2.png" alt="Girl in a jacket" width="800" height="150">
</center>

Because we pruned a value from the domain of V, we need to enqueue all arcs with V at the head - $\text{SA}\rightarrow \text{V}$
, $\text{NSW}\rightarrow \text{V}$. Since $\text{NSW} \rightarrow \text{V}$ is already in $Q$, we only need to add 
$\text{SA}\rightarrow \text{V}$, leaving us with our updated queue:

$$
Q = [\text{SA}\rightarrow \text{NSW}, \text{NSA}\rightarrow \text{SA},\text{SA}\rightarrow \text{NT}, \text{NT}\rightarrow \text{SA}, \text{V}\rightarrow \text{NSW}, \text{NSW}\rightarrow \text{V},\text{SA}\rightarrow \text{V}]
$$

We can continue this process until we eventually remove the arc $\text{SA}\rightarrow \text{NT$ from Q. Enforcing arc consistency on this arc removes **blue** from SA’s domain, leaving it empty and triggering a backtrack. Note that the arc $\text{NSW}\rightarrow \text{SA}$ appears before $\text{SA}\rightarrow \text{NT}$ in $Q$ and that enforcing consistency on this arc removes 
blue from the domain of NSW.


<center>
<img src="{{ site.url }}{{ site.baseurl }}/csp/arc-consistency-ex-3.png" alt="Girl in a jacket" width="800" height="150">
</center>

Arc consistency is typically implemented with the AC-3 algorithm (Arc Consistency Algorithm #3), for which the pseudocode is as follow


<center>
<img src="{{ site.url }}{{ site.baseurl }}/csp/arc-consistency-pseudo.png" alt="Girl in a jacket" width="700" height="500">
</center>

The AC-3 algorithm has a worst-case time complexity of $\mathcal{O}(ed^3)$, where e is the number of arcs (directed edges) and d
is the size of the largest domain. Overall, arc consistency is more holistic of a domain pruning technique than forward checking and leads to fewer backtracks, but requires running significantly more computation in order to enforce. Accordingly, it’s important to take into account this tradeoff when deciding which filtering technique to implement for the CSP you’re attempting to solve.

As an interesting parting note about consistency, arc consistency is a subset of a more generalized notion of consistency known as **k-consistency**, which when enforced guarantees that for any set of $k$ nodes in the CSP, a consistent assignment to any subset of $k−1$ nodes guarantees that the $k^{\text{th}}$ node will have at least one consistent value. This idea can be further extended through the idea of strong k-consistency. A graph that is strong $k$-consistent possesses the property that any subset of k nodes is not only k-consistent but also $k−1$,$k−2$,$\ldots$, 1-consistent as well. Not surprisingly, imposing a higher degree of consistency on a CSP is more expensive to compute. Under this generalized definition for consistency, we can see that arc consistency is equivalent to 2-consistency.

## Ordering

We’ve delineated that when solving a CSP, we fix some ordering for both the variables and values involved. In practice, it’s often much more effective to compute the next variable and corresponding value “on the fly” with two broad principles, **minimum remaining** values and **least constraining value**:


- *Minimum Remaining Values (MRV)* - When selecting which variable to assign next, using an MRV policy chooses whichever unassigned variable has the fewest valid remaining values (the most constrained variable). This is intuitive in the sense that the most constrained variable is most likely to run out of possible values and result in backtracking if left unassigned, and so it’s best to assign a value to it sooner than later.
- *Least Constraining Value (LCV)* - Similarly, when selecting which$ value to assign next, a good policy to implement is to select the value that prunes the fewest values from the domains of the remaining unassigned values. Notably, this requires additional computation (e.g. rerunning arc consistency/forward checking or other filtering methods for each value to find the LCV), but can still yield speed gains depending on usage.

### Structure

A final class of improvements to solving constraint satisfaction problems are those that exploit their structure. In particular, if we’re trying to solve a tree-structured CSP (one that has no loops in its constraint graph), we can reduce the runtime for finding a solution from $\mathcal{O}(d^N)$ all the way to $\mathcal{O}j(nd^2)$, linear in the number of variables. This can be done with the tree-structured CSP algorithm, outlined below:

1. First, pick an arbitrary node in the constraint graph for the CSP to serve as the root of the tree (it doesn’t matter which one because basic graph theory tells us any node of a tree can serve as a root).
2. Convert all undirected edges in the tree to directed edges that point away from the root. Then **linearize** (or **topologically sort**) the resulting directed acyclic graph. In simple terms, this just means ordering the nodes of the graph such that all edges point rightwards. Noting that we select node A to be our root and direct all edges to point away from A, this process results in the following conversion for the CSP presented below:


<center>
<img src="{{ site.url }}{{ site.baseurl }}/csp/tree-structured-alg.png" alt="Girl in a jacket" width="800" height="150">
</center>

3. Perform a backwards pass of arc consistency. Iterating from $i=n$ down to $i=2$, enforce arc consistency for all arcs $\text{Parent}(X_i)\rightarrow X_i$. For the linearized CSP from above, this domain pruning will eliminate a few values, leaving us with the following:


<center>
<img src="{{ site.url }}{{ site.baseurl }}/csp/pruned-tree.png" alt="Girl in a jacket" width="600" height="150">
</center>

1. Finally, perform a **forward assignment**. Starting from $X_1$ and going to $X_n$, assign each $X_i$ a value consistent with that of its parent. Because we’ve enforced arc consistency on all of these arcs, no matter what value we select for any node, we know that its children will each have at least one consistent value. Hence, this iterative assignment guarantees a correct solution, a fact which can be proven inductively without difficulty.

The tree-structured algorithm can be extended to CSPs that are reasonably close to being tree-structured with cutset conditioning. **Cutset conditioning** involves first finding the smallest subset of variables in a constraint graph such that their removal results in a tree (such a subset is known as a **cutset** for the graph). For example, in our map coloring example, South Australia (SA) is the smallest possible cutset:


<center>
<img src="{{ site.url }}{{ site.baseurl }}/csp/cutset.png" alt="Girl in a jacket" width="700" height="550">
</center>

Once the smallest cutset is found, we assign all variables in it and prune the domains of all neighboring nodes. What’s left is a tree-structured CSP, upon which we can solve with the tree-structured CSP algorithm from above! The initial assignment to a cutset of size $c$ may leave the resulting tree-structured CSP(s) with no valid solution after pruning, so we may still need to backtrack up to $d^c$ times. Since removal of the cutset leaves us with a tree-structured CSP with $(n−c)$
 variables, we know this can be solved (or determined that no solution exists) in $\mathcal{O}((n−c)d^2)$. Hence, the runtime of cutset conditioning on a general CSP in $\mathcal{O}(d^c(n−c)d^2)$
, very good for small c.


## Local Search

As a final topic of interest, backtracking search is not the only algorithm that exists for solving constraint satisfaction problems. Another widely used algorithm is **local search**, for which the idea is childishly simple but remarkably useful. Local search works by iterative improvement—start with some random assignment to values, then iteratively select a random conflicted variable and reassign its value to the one that violates the fewest constraints until no more constraint violations exist (a policy known as the **min-conflicts heuristic**). Under such a policy, constraint satisfaction problems like N-queens become both very time-efficient and space-efficient to solve. For example, in the following example with 4 queens, we arrive at a solution after only 2 iterations:


<center>
<img src="{{ site.url }}{{ site.baseurl }}/csp/four-queens.png" alt="Girl in a jacket" width="600" height="200">
</center>

In fact, local search appears to run in almost constant time and have a high probability of success not only for N-queens with arbitrarily large N, but also for any randomly generated CSP! However, despite these advantages, local search is both incomplete and suboptimal and so won’t necessarily converge to an optimal solution. Additionally, there is a critical ratio around which using local search becomes extremely expensive:

$$
R = \dfrac{\text{Number of Constraints}}{\text{Number of Variables}}
$$



### Hill-Climbing Search 

<center>
<img src="{{ site.url }}{{ site.baseurl }}/csp/maxima_global_local.png" alt="Girl in a jacket" width="800" height="400">
</center>

The hill-climbing search algorithm (or **steepest-ascent**) moves from the current state toward a neighboring state that increases the objective value. The algorithm does not maintain a search tree but only the states and the corresponding values of the objective. The “greediness” of hill-climbing makes it vulnerable to being trapped in **local maxima** (see figure below), as locally those points appear as global maxima to the algorithm, and plateaux. Plateaux can be categorized into “flat” areas at which no direction leads to improvement (“flat local maxima”) or flat areas from which progress can be slow (“shoulders”). Variants of hill-climbing, like stochastic hill-climbing, which selects an action randomly among the uphill moves, have been proposed. This version of hill-climbing has been shown in practice to converge to higher maxima at the cost of more iterations.


<center>
<img src="{{ site.url }}{{ site.baseurl }}/csp/hill_climb-1.png" alt="Girl in a jacket" width="600" height="200">
</center>

The pseudocode of hill-climbing can be seen above. As the name suggests, the algorithm iteratively moves to a state with a higher objective value until no such progress is possible. **Hill-climbing is incomplete**. Random-Restart hill-climbing, on the other hand, conducts a number of hill-climbing searches, each time from a randomly chosen initial state, and is trivially complete, as at some point the randomly chosen initial state will coincide with the global maximum.

### Simulated Annealing Search

The second local search algorithm we will cover is simulated annealing. Simulated annealing aims to combine random walk (randomly moving to nearby states) and hill-climbing to obtain a complete and efficient search algorithm. In simulated annealing, we allow moves to states that can decrease the objective. More specifically, the algorithm at each state chooses a random move. If the move leads to a higher objective, it is always accepted. If, on the other hand, it leads to smaller objectives, then the move is accepted with some probability. This probability is determined by the temperature parameter, which initially is high (more “bad” moves allowed) and decreases according to some schedule. If the temperature is decreased slowly enough, then the simulated annealing algorithm will reach the global maximum with a probability approaching 1.


<center>
<img src="{{ site.url }}{{ site.baseurl }}/csp/sim_ann-1.png" alt="Girl in a jacket" width="600" height="300">
</center>

### Genetic Algorithms

Finally, we present **genetic algorithms**, which are a variant of local beam search and are also extensively used in many optimization tasks. Genetic algorithms begin as beam search with k randomly initialized states called the **population**. States (or **individuals**) are represented as a string over a finite alphabet. To understand the topic better, let’s revisit the 8-Queens problem presented in class. For the 8-Queens problem, we can represent each of the eight individuals with a number that ranges from 1–8, representing the location of each queen in the column (column (a) in Fig. 4.6). Each individual is evaluated using an evaluation function (**fitness function**), and they are ranked according to the values of that function. For the 8-Queens problem, this is the number of non-attacking pairs of queens.

<center>
<img src="{{ site.url }}{{ site.baseurl }}/csp/gen2-1.png" alt="Girl in a jacket" width="600" height="300">
</center>

The probability of choosing a state to “reproduce” is proportional to the value of that state. We proceed to select pairs of states to reproduce according to these probabilities (column (c) in Fig. 4.6). Offspring are generated by crossing over the parent strings at the crossover point. That crossover point is chosen randomly for each pair. Finally, each offspring is susceptible to some random mutation with independent probability. The pseudocode of the genetic algorithm can be seen in the following picture.


<center>
<img src="{{ site.url }}{{ site.baseurl }}/csp/genetic-1.png" alt="Girl in a jacket" width="650" height="600">
</center>

Genetic algorithms try to move uphill while exploring the state space and exchanging information between threads. Their main advantage is the use of crossovers since this allows for large blocks of letters, that have evolved and lead to high valuations, to be combined with other such blocks and produce a solution with a high total score.

## Summary

It’s important to remember that constraint satisfaction problems in general do not have an efficient algorithm which solves them in polynomial time with respect to the number of variables involved. However, by using various heuristics, we can often find solutions in an acceptable amount of time:

- **Filtering** - Filtering handles pruning the domains of unassigned variables ahead of time to prevent unnecessary backtracking. The two important filtering techniques we’ve covered are forward checking and arc consistency.
- **Ordering** - Ordering handles selection of which variable or value to assign next to make backtracking as unlikely as possible. For variable selection, we learned about a MRV policy and for value selection we learned about a LCV policy.
- **Structure** - If a CSP is tree-structured or close to tree-structured, we can run the tree-structured CSP algorithm on it to derive a solution in linear time. Similarly, if a CSP is close to tree-structured, we can use cutset conditioning to transform the CSP into one or more independent tree-structured CSPs and solve each of these separately.
