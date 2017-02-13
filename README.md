# Graphology Communities

Miscellaneous metrics and algorithms around community detection to be used with [`graphology`](https://graphology.github.io).

## Installation

```
npm install graphology-communities
```

## Usage

*Metrics*

* [Modularity](#Modularity)

*Algorithms*

* [Louvain](#Louvain)

### Modularity

Compute the modularity, given the graph and a partitioning

```js
import {modularity} from 'graphology-communities';
// Alternatively, to load only the relevant code:
import modularity from 'graphology-communities/modularity';

const Q = modularity(graph, [['1', '2'], ['3', '4', '5']]);
```

*Arguments*

* **graph** *Graph*: target graph.
* **partitioning** *Nested array*: partitioning of which the leaves are nodes of the graph.

### Louvain

Execute the Louvain algorithm to detect a good partitioning of the graph in several communities.
The original publication of the algorithm can be found [there](https://arxiv.org/pdf/0803.0476v2.pdf).

```js
import {louvain} from 'graphology-communities';
// Alternatively, to load only the relevant code:
import louvain from 'graphology-communities/louvain';

const partitioning = louvain(graph);
// Return a  nested array like [ ['1', '2'], ['3', '4', '5'] ]
```

*Arguments*

* **graph** *Graph*: graph to which you want to get the best partitioning.

