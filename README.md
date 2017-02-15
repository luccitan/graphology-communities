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

const Q = modularity(graph, {'1': 0, '2': 0, '3': 1, '4': 1, '5': 1});
```

*Arguments*

* **graph** *Graph*: target graph.
* **partitioning** *Object*: object mapping a community index to a object.
* **options** *?object*: options:
  * **attributes** *?object*: attributes' names:
    * **weight** *?string* [`weight`]: name of the edges' weight attribute.

### Louvain

Execute the Louvain algorithm to detect a good partitioning of the graph in several communities.
The original publication of the algorithm can be found [there](https://arxiv.org/pdf/0803.0476v2.pdf).

```js
import {louvain} from 'graphology-communities';
// Alternatively, to load only the relevant code:
import louvain from 'graphology-communities/louvain';

const partitioning = louvain(graph); // Return a mapping object like {'1': 0, '2': 0, ..., 5: '1'}
// To directly map the result to nodes' attributes
louvain.assign(graph); // By default, assigned to the `community` attribute
lovuain.assign(graph, {attributes: {community: 'foo'}}); // Assigned to the `foo` attribute
```

*Arguments*

* **graph** *Graph*: graph to which you want to get the best partitioning.
* **options** *?object*: options:
  * **attributes** *?object*: attributes' names:
    * **weight** *?string* [`weight`]: name of the edges' weight attribute.
    * **community** *?string* [`community`]: name of the node attribute holding community information

