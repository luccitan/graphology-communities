/**
 * Graphology Modularity
 * ======================
 * /!\ NOTES /!\
 * Gephi doesn't consider directed edges
 * directed edges produces the same modularity as if they were undirected
 * if there are a->b and b->a : consider a<->b
 * if there is a-> only or b->a only : consider ALSO a<->b
 * if there are a->b , b->a with differents weights, only one is considered
 * the order chosen by Gephi is unkown, it is a sensitive case not handled
 * +
 * SELF-LOOPS ARE NOT CONSIDERED AT ALL.
 * Not in the total weights, not in the computing part
 * (remove them and it will be the same modularity score)
 *  ============================
 */
var isGraph = require('graphology-utils/is-graph');

/**
 * Function returning the modularity of the graph
 *
 * @param  {Graph} graph - Target graph.
 * @param {Nested Array} communitites - the set of communitites
 * @return number
 */
function modularity(graph, communities) {
  if (!isGraph(graph))
    throw new Error('graphology-modularity: the given graph is not a valid graphology instance.');

  if (!Array.isArray(communities) || communities.length === 0)
    throw new Error('graphology-modularity: the given communities set is invalid.');

  if (!graph.size)
    throw new Error('graphology-modularity: the graph has no edges');

  var A,
      M = 0,
      Q = 0,
      i, j, l1, l2,
      nodes = graph.nodes(),
      belongings = {},
      weights = {},
      degree = {},
      edge, w, weight,
      node1, node2,
      community;

  for (i = 0, l1 = communities.length; i < l1; i++)
    for (j = 0, l2 = communities[i].length; j < l2; j++)
      belongings[communities[i][j]] = i;

  /**
   * Initializing the Map of
   * total weight from|to a node
   */
  for (i = 0, l1 = nodes.length; i < l1; i++) {
    node1 = nodes[i];
    for (j = 0, l2 = nodes.length; j < l2; j++) {
      node2 = nodes[j];

      if (node1 === node2) continue;

      edge = graph.getEdge(node1, node2) || graph.getEdge(node2, node1);
      if (edge === undefined) continue;

      w = graph.getEdgeAttribute(edge, 'weight');
      weight = isNaN(w) ? 1 : w;
      weights[edge] = weight;

      degree[node1] = (degree[node1] || 0) + weight;
      M += weight;
    }
  }

  /**
   * Computing Q
   * *************
   */
  for (i = 0, l1 = nodes.length; i < l1; i++) {
    node1 = nodes[i];
    community = belongings[node1];
    if (community === undefined)
      continue;

    for (j = 0, l2 = nodes.length; j < l2; j++) {
      node2 = nodes[j];
      if (belongings[node2] !== community)
        continue;

      if (node1 === node2)
        edge = undefined;
      else
        edge = graph.getEdge(node1, node2) || graph.getEdge(node2, node1);
      A = edge === undefined ? 0 : weights[edge];
      Q += A - ((degree[node1] || 0) * (degree[node2] || 0) / M);
    }
  }

  Q /= M;
  return Q;
}

module.exports = modularity;
