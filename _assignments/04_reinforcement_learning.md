---
layout: distill
title: Reinforcement Learning
description: Second project on Reinforcement learning
tags: cs188 project
date: 2025-04-26
due_date: 2025-05-01
description: "Assignement on Reinforcement learning"
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
  - name: MDPs
  - name: Value Iteration
  - name: Policies
  - name: Q-learning
  - name: Epsilon Greedy
  - name: Q-Learning and Pacman
  - name: Approximate Q-Learning
---

<center>
<img src="{{ site.url }}{{ site.baseurl }}/assets/img/capsule.png" alt="Girl in a jacket">
</center>

<div class="caption">
Pacman seeks reward.
Should he eat or should he run?
When in doubt, Q-learn.
</div>


## Introduction
In this project, you will implement value iteration and Q-learning. You will test your agents first on Gridworld (from class), then apply them to a simulated robot controller (Crawler) and Pacman.

As in previous projects, this project includes an autograder for you to grade your solutions on your machine. This can be run on all questions with the command:

```
python autograder.py
```
It can be run for one particular question, such as q2, by:


```
python autograder.py -q q2
```

It can be run for one particular test by commands of the form:

```
python autograder.py -t test_cases/q2/1-bridge-grid
```


The code for this project contains the following files, available as a <a href="{{ '/assets/reinforcement.zip' | relative_url }}">zip archive</a>


### Files you'll edit

| File | Description |
|:-----|:------------|
| [valueIterationAgents.py]({{ site.baseurl }}/path/to/valueIterationAgents.py) | A value iteration agent for solving known MDPs. |
| [qlearningAgents.py]({{ site.baseurl }}/path/to/qlearningAgents.py) | Q-learning agents for Gridworld, Crawler and Pacman. |
| [analysis.py]({{ site.baseurl }}/path/to/analysis.py) | A file to put your answers to questions given in the project. |

### Files you might want to look at

| File | Description |
|:-----|:------------|
| [mdp.py]({{ site.baseurl }}/path/to/mdp.py) | Defines methods on general MDPs. |
| [learningAgents.py]({{ site.baseurl }}/path/to/learningAgents.py) | Defines the base classes `ValueEstimationAgent` and `QLearningAgent`, which your agents will extend. |
| [util.py]({{ site.baseurl }}/path/to/util.py) | Utilities, including `util.Counter`, which is particularly useful for Q-learners. |
| [gridworld.py]({{ site.baseurl }}/path/to/gridworld.py) | The Gridworld implementation. |
| [featureExtractors.py]({{ site.baseurl }}/path/to/featureExtractors.py) | Classes for extracting features on (state, action) pairs. Used for the approximate Q-learning agent. |

### Supporting files you can ignore

| File | Description |
|:-----|:------------|
| [environment.py]({{ site.baseurl }}/path/to/environment.py) | Abstract class for general reinforcement learning environments. Used by `gridworld.py`. |
| [graphicsGridworldDisplay.py]({{ site.baseurl }}/path/to/graphicsGridworldDisplay.py) | Gridworld graphical display. |
| [graphicsUtils.py]({{ site.baseurl }}/path/to/graphicsUtils.py) | Graphics utilities. |
| [textGridworldDisplay.py]({{ site.baseurl }}/path/to/textGridworldDisplay.py) | Plug-in for the Gridworld text interface. |
| [crawler.py]({{ site.baseurl }}/path/to/crawler.py) | The crawler code and test harness. You will run this but not edit it. |
| [graphicsCrawlerDisplay.py]({{ site.baseurl }}/path/to/graphicsCrawlerDisplay.py) | GUI for the crawler robot. |
| [autograder.py]({{ site.baseurl }}/path/to/autograder.py) | Project autograder. |
| [testParser.py]({{ site.baseurl }}/path/to/testParser.py) | Parses autograder test and solution files. |
| [testClasses.py]({{ site.baseurl }}/path/to/testClasses.py) | General autograding test classes. |
| [test_cases/]({{ site.baseurl }}/path/to/test_cases/) | Directory containing the test cases for each question. |
| [reinforcementTestClasses.py]({{ site.baseurl }}/path/to/reinforcementTestClasses.py) | Project 3 specific autograding test classes. |




## MDPs

To get started, run Gridworld in manual control mode, which uses the arrow keys:


```
python gridworld.py -m
```

You will see the two-exit layout from class. The blue dot is the agent. Note that when you press up, the agent only actually moves north 80% of the time. Such is the life of a Gridworld agent!

You can control many aspects of the simulation. A full list of options is available by running:

```
python gridworld.py -h
```

The default agent moves randomly

```
python gridworld.py -g MazeGrid
```

You should see the random agent bounce around the grid until it happens upon an exit. Not the finest hour for an AI agent.

> Note: The Gridworld MDP is such that you first must enter a pre-terminal state (the double boxes shown in the GUI) and then take the special ‘exit’ action before the episode actually ends (in the true terminal state called `TERMINAL_STATE`, which is not shown in the GUI). If you run an episode manually, your total return may be less than you expected, due to the discount rate (-d to change; 0.9 by default).

Look at the console output that accompanies the graphical output (or use -t for all text). You will be told about each transition the agent experiences (to turn this off, use -q).

As in Pacman, positions are represented by $(x, y)$ Cartesian coordinates and any arrays are indexed by [x][y], with 'north' being the direction of increasing y, etc. By default, most transitions will receive a reward of zero, though you can change this with the living reward option (-r).


## Value Iteration


Recall the value iteration state update equation:

$$
V_{k+1}(s) \leftarrow \max_a \sum_{s'} T(s, a, s') \left[ R(s, a, s') + \gamma V_k(s') \right]
$$

Write a value iteration agent in `ValueIterationAgent`, which has been partially specified for you in [valueIterationAgents.py]({{ site.baseurl }}/path/to/valueIterationAgents.py).


Your value iteration agent is an **offline planner**, not a reinforcement learning agent, and so the relevant training option is the number of iterations of value iteration it should run (`-i`) during its initial planning phase.  

`ValueIterationAgent` takes an MDP on construction and runs value iteration for the specified number of iterations before the constructor returns.

Value iteration computes \(k\)-step estimates of the optimal values, $V_k$.  
In addition to `runValueIteration`, implement the following methods for `ValueIterationAgent` using $V_k$:

- `computeActionFromValues(state)` — computes the best action according to the value function given by `self.values`.
- `computeQValueFromValues(state, action)` — returns the Q-value of the (state, action) pair given by the value function given by `self.values`.

These quantities are displayed in the GUI:
- **Values** are numbers in squares,
- **Q-values** are numbers in square quarters,
- **Policies** are arrows pointing out from each square.


### Important Notes

- **Batch Value Iteration**:  
  Use the "batch" version where each vector $V_k$ is computed from a fixed vector $V_{k-1}$ (like in lecture), not the "online" version where a single weight vector is updated in place.  
  This means when updating a state's value during iteration $k$, always use the values from iteration $k-1$, even if some successor states were already updated in iteration $k$.

- This distinction is discussed in **Sutton & Barto**, Chapter 4.1 (page 91).

- **Policy Depth**:  
  A policy synthesized from values of depth $k$ will reflect the next $k+1$ rewards (i.e., you return $\pi_{k+1}$), and the Q-values will similarly reflect one more reward than the values.

- **Hint**:  
  You may optionally use the `util.Counter` class from [util.py]({{ site.baseurl }}/path/to/util.py), which is a dictionary with default value 0.  
  Be careful with `argMax`: the actual best key may not be explicitly stored if its value is zero.

- **No Available Actions**:  
  Make sure to correctly handle states with **no available actions** (think about what this means for future rewards).


To test your implementation, run the autograder:

```
python autograder.py -q q1
```

The following command loads your ValueIterationAgent, which will compute a policy and execute it 10 times. Press a key to cycle through values, Q-values, and the simulation. You should find that the value of the start state (V(start), which you can read off of the GUI) and the empirical resulting average reward (printed after the 10 rounds of execution finish) are quite close.

```
python gridworld.py -a value -i 100 -k 10
```

> Hint: On the default BookGrid, running value iteration for 5 iterations should give you this output:

```
python gridworld.py -a value -i 5
```

<center>
<img src="{{ site.url }}{{ site.baseurl }}/assets/img/value_iter_diagram.png" alt="Girl in a jacket">
</center>


## Policies

Consider the DiscountGrid layout, shown below. This grid has two terminal states with positive payoff (in the middle row), a close exit with payoff +1 and a distant exit with payoff +10. The bottom row of the grid consists of terminal states with negative payoff (shown in red); each state in this “cliff” region has payoff -10. The starting state is the yellow square. We distinguish between two types of paths: (1) paths that “risk the cliff” and travel near the bottom row of the grid; these paths are shorter but risk earning a large negative payoff, and are represented by the red arrow in the figure below. (2) paths that “avoid the cliff” and travel along the top edge of the grid. These paths are longer but are less likely to incur huge negative payoffs. These paths are represented by the green arrow in the figure below.


<center>
<img src="{{ site.url }}{{ site.baseurl }}/assets/img/value_2_paths.png"  width="400" height = "400" alt="Girl in a jacket">
</center>


In this question, you will choose settings of the discount, noise, and living reward parameters for this MDP to produce optimal policies of several different types. **Your setting of the parameter values for each part should have the property that, if your agent followed its optimal policy without being subject to any noise, it would exhibit the given behavior**. If a particular behavior is not achieved for any setting of the parameters, assert that the policy is impossible by returning the string 'NOT POSSIBLE'.

Here are the optimal policy types you should attempt to produce:

- Prefer the close exit (+1), risking the cliff (-10)
- Prefer the close exit (+1), but avoiding the cliff (-10)
- Prefer the distant exit (+10), risking the cliff (-10)
- Prefer the distant exit (+10), avoiding the cliff (-10)
- Avoid both exits and the cliff (so an episode should never terminate)
- 
To see what behavior a set of numbers ends up in, run the following command to see a GUI:


```
python gridworld.py -g DiscountGrid -a value --discount [YOUR_DISCOUNT] --noise [YOUR_NOISE] --livingReward [YOUR_LIVING_REWARD]
```

To check your answers, run the autograder:

```
python autograder.py -q q2
```

## Q-Learning


Note that your value iteration agent does **not** actually learn from experience.  
Rather, it **ponders its MDP model** to arrive at a complete policy before ever interacting with a real environment.  
When it does interact with the environment, it simply follows the precomputed policy (e.g., it becomes a reflex agent).  
This distinction may be subtle in a simulated environment like Gridworld, but it’s **very important in the real world**, where the real MDP is **not available**.

You will now write a **Q-learning agent**, which does very little on construction but instead **learns by trial and error** from interactions with the environment through its `update(state, action, nextState, reward)` method.  

A stub of a Q-learner is provided in [QLearningAgent]({{ site.baseurl }}/path/to/qlearningAgents.py), and you can select it with the option `-a q`.  

For this question, you must implement the following methods:

- `update`
- `computeValueFromQValues`
- `getQValue`
- `computeActionFromQValues`


### Important Notes

- **Random Tie-Breaking**:  
  For `computeActionFromQValues`, you should **break ties randomly** for better behavior.  
  The `random.choice()` function will help.

- **Unseen Actions**:  
  In any state, actions your agent hasn’t seen before still have a Q-value (specifically, **zero**).  
  If all known actions have negative Q-values, an unseen action may be optimal.

- **Access Q-Values Correctly**:  
  In both `computeValueFromQValues` and `computeActionFromQValues`, **only access Q-values by calling `getQValue`**.  
  This abstraction will be useful later (e.g., for Question 10 when you override `getQValue` to use features).


With the Q-learning update in place, you can watch your Q-learner learn under manual control, using the keyboard:

```
python gridworld.py -a q -k 5 -m
```

Recall that -k will control the number of episodes your agent gets to learn. Watch how the agent learns about the state it was just in, not the one it moves to, and “leaves learning in its wake.” Hint: to help with debugging, you can turn off noise by using the --noise 0.0 parameter (though this obviously makes Q-learning less interesting). If you manually steer Pacman north and then east along the optimal path for four episodes, you should see the following Q-values:


<center>
<img src="{{ site.url }}{{ site.baseurl }}/assets/img/q_learning.png"  width="400" height = "400" alt="Girl in a jacket">
</center>

Finally to check your code run the autograder on question 3.

```
python autograder.py -q q3
```

## Epsilon Greedy

Complete your Q-learning agent by implementing epsilon-greedy action selection in `getAction`, meaning it chooses random actions an epsilon fraction of the time, and follows its current best Q-values otherwise. Note that choosing a random action may result in choosing the best action - that is, you should not choose a random sub-optimal action, but rather any random legal action.

You can choose an element from a list uniformly at random by calling the `random.choice` function. You can simulate a binary variable with probability p of success by using `util.flipCoin(p)`, which returns True with probability $p$ and False with probability $1-p$.

After implementing the getAction method, observe the following behavior of the agent in GridWorld (with epsilon = 0.3).

```
python gridworld.py -a q -k 100
```

Your final Q-values should resemble those of your value iteration agent, especially along well-traveled paths. However, your average returns will be lower than the Q-values predict because of the random actions and the initial learning phase.

You can also observe the following simulations for different epsilon values. Does that behavior of the agent match what you expect?

```
python gridworld.py -a q -k 100 --noise 0.0 -e 0.1
```

```
python gridworld.py -a q -k 100 --noise 0.0 -e 0.9
```

To test your implementation, run the autograder:

```
python autograder.py -q q4
```

With no additional code, you should now be able to run a Q-learning crawler robot:


```
python crawler.py
```

If this doesn’t work, you’ve probably written some code too specific to the GridWorld problem and you should make it more general to all MDPs.

This will invoke the crawling robot from class using your Q-learner. Play around with the various learning parameters to see how they affect the agent’s policies and actions. Note that the step delay is a parameter of the simulation, whereas the learning rate and epsilon are parameters of your learning algorithm, and the discount factor is a property of the environment.


## Q-Learning and Pacman
Time to play some Pacman! Pacman will play games in two phases. In the first phase, training, Pacman will begin to learn about the values of positions and actions. Because it takes a very long time to learn accurate Q-values even for tiny grids, Pacman’s training games run in quiet mode by default, with no GUI (or console) display. Once Pacman’s training is complete, he will enter testing mode. When testing, Pacman’s `self.epsilon` and `self.alpha` will be set to 0.0, effectively stopping Q-learning and disabling exploration, in order to allow Pacman to exploit his learned policy. Test games are shown in the GUI by default. Without any code changes you should be able to run Q-learning Pacman for very tiny grids as follows:

```
python pacman.py -p PacmanQAgent -x 2000 -n 2010 -l smallGrid
```

Note that PacmanQAgent is already defined for you in terms of the QLearningAgent you’ve already written. PacmanQAgent is only different in that it has default learning parameters that are more effective for the Pacman problem `(epsilon=0.05, alpha=0.2, gamma=0.8)`. You will receive full credit for this question if the command above works without exceptions and your agent wins at least 80% of the time. The autograder will run 100 test games after the 2000 training games.

**Hint**: If your QLearningAgent works for gridworld.py and crawler.py but does not seem to be learning a good policy for Pacman on smallGrid, it may be because your getAction and/or computeActionFromQValues methods do not in some cases properly consider unseen actions. In particular, because unseen actions have by definition a Q-value of zero, if all of the actions that have been seen have negative Q-values, an unseen action may be optimal. Beware of the argMax function from util.Counter!

To grade your answer, run:

```
python autograder -q q5
```


Note: If you want to experiment with learning parameters, you can use the option -a, for example `-a epsilon=0.1,alpha=0.3,gamma=0.7`. These values will then be accessible as `self.epsilon`, `self.gamma` and `self.alpha` inside the agent.

Note: While a total of 2010 games will be played, the first 2000 games will not be displayed because of the option `-x 2000`, which designates the first 2000 games for training (no output). Thus, you will only see Pacman play the last 10 of these games. The number of training games is also passed to your agent as the option `numTraining`.


Note: If you want to watch 10 training games to see what’s going on, use the command:

```
python pacman.py -p PacmanQAgent -n 10 -l smallGrid -a numTraining=10
```

During training, you will see output every 100 games with statistics about how Pacman is faring. Epsilon is positive during training, so Pacman will play poorly even after having learned a good policy: this is because he occasionally makes a random exploratory move into a ghost. As a benchmark, it should take between 1000 and 1400 games before Pacman’s rewards for a 100 episode segment becomes positive, reflecting that he’s started winning more than losing. By the end of training, it should remain positive and be fairly high (between 100 and 350).

Make sure you understand what is happening here: the MDP state is the exact board configuration facing Pacman, with the now complex transitions describing an entire ply of change to that state. The intermediate game configurations in which Pacman has moved but the ghosts have not replied are not MDP states, but are bundled in to the transitions.

Once Pacman is done training, he should win very reliably in test games (at least 90% of the time), since now he is exploiting his learned policy.

However, you will find that training the same agent on the seemingly simple mediumGrid does not work well. In our implementation, Pacman’s average training rewards remain negative throughout training. At test time, he plays badly, probably losing all of his test games. Training will also take a long time, despite its ineffectiveness.

Pacman fails to win on larger layouts because each board configuration is a separate state with separate Q-values. He has no way to generalize that running into a ghost is bad for all positions. Obviously, this approach will not scale.

## Approximate Q-Learning

Implement an approximate Q-learning agent that learns weights for features of states, where many states might share the same features. Write your implementation in `ApproximateQAgent` class in `qlearningAgents.py`, which is a subclass of `PacmanQAgent`.


*Note*: Approximate Q-learning assumes the existence of a feature function $f(s,a)$ over state and action pairs, which yields a vector $[f_1(s,a),\ldots,f_i(s,a),\ldots,f_n(s,a)]$ of feature values. We provide feature functions for you in `featureExtractors.py`. Feature vectors are `util.Counter` (like a dictionary) objects containing the non-zero pairs of features and values; all omitted features have value zero. So, instead of an vector where the index in the vector defines which feature is which, we have the keys in the dictionary define the idenity of the feature.

The approximate Q-function takes the following form:

$$Q(s,a)=\sum_{i=1}^n f_i(s,a) w_i$$

where each weight $w_i$ is associated with a particular feature $f_i(s,a)$. In your code, you should implement the weight vector as a dictionary mapping features (which the feature extractors will return) to weight values. You will update your weight vectors similarly to how you updated Q-values:

$$w_i \leftarrow w_i + \alpha \cdot \text{difference} \cdot f_i(s,a)$$

$$\text{difference} = (r + \gamma \max_{a'} Q(s', a')) - Q(s,a)$$

Note that the $\text{difference}$ term is the same as in normal Q-learning, and $r$ is the experienced reward.

By default, `ApproximateQAgent` uses the `IdentityExtractor`, which assigns a single feature to every `(state,action)` pair. With this feature extractor, your approximate Q-learning agent should work identically to `PacmanQAgent`. You can test this with the following command:

```
python pacman.py -p ApproximateQAgent -x 2000 -n 2010 -l smallGrid
```


**Important**: `ApproximateQAgent` is a subclass of QLearningAgent, and it therefore shares several methods like getAction. Make sure that your methods in QLearningAgent call getQValue instead of accessing Q-values directly, so that when you override `getQValue` in your approximate agent, the new approximate q-values are used to compute actions.

Once you’re confident that your approximate learner works correctly with the identity features, run your approximate Q-learning agent with our custom feature extractor, which can learn to win with ease:

```
python pacman.py -p ApproximateQAgent -a extractor=SimpleExtractor -x 50 -n 60 -l mediumGrid
```
Even much larger layouts should be no problem for your `ApproximateQAgent` (warning: this may take a few minutes to train):

```
python pacman.py -p ApproximateQAgent -a extractor=SimpleExtractor -x 50 -n 60 -l mediumClassic
```

If you have no errors, your approximate Q-learning agent should win almost every time with these simple features, even with only 50 training games.

To test your code.

```
python autograder.py -q q6
```
