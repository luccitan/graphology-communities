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
var defaults = require('lodash/defaultsDeep'),
    isGraph = require('graphology-utils/is-graph');

/**
 * Function returning the modularity of the graph
 *
 * @param  {Graph} graph - Target graph.
 * @param {Nested Array} communities - the set of communitites
 * @return number
 */
function modularity(graph, communities, options) {
  if (!isGraph(graph))
    throw new Error('graphology-modularity: the given graph is not a valid graphology instance.');
  if (graph.multi)
    throw new Error('graphology-louvain: MultiGraph are not handled');
  if (!Array.isArray(communities) || communities.length === 0)
    throw new Error('graphology-modularity: the given communities set is invalid.');
  if (!graph.size)
    throw new Error('graphology-modularity: the graph has no edges');

  // Attributes name
  options = defaults(options, {attributes: {weight: 'weight'}});

  var M = 0,
      Q = 0,
      belongings = {},
      internalW = {},
      totalW = {},
      i, l1,
      j, l2,
      edges = graph.edges(),
      community1, community2,
      bounds,
      edge,
      w, weight;

  for (i = 0, l1 = communities.length; i < l1; i++) {
    internalW[i] = 0;
    totalW[i] = 0;
    for (j = 0, l2 = communities[i].length; j < l2; j++)
      belongings[communities[i][j]] = i;
  }

  for (i = 0, l1 = edges.length; i < l1; i++) {
    edge = edges[i];
    bounds = graph.extremities(edge);
    if (bounds[0] === bounds[1])
      continue;

    community1 = belongings[bounds[0]];
    community2 = belongings[bounds[1]];
    w = graph.getEdgeAttribute(edge, options.attributes.weight);
    weight = isNaN(w) ? 1 : w;

    totalW[community1] = (totalW[community1] || 0) + weight;
    if (graph.undirected(edge) || !graph.hasDirectedEdge(bounds[1], bounds[0])) {
      totalW[community2] = (totalW[community2] || 0) + weight;
      M += 2 * weight;
    }
    else
      M += weight;

    if (!graph.hasDirectedEdge(bounds[1], bounds[0]))
      weight *= 2;

    if (community1 === community2)
      internalW[community1] = (internalW[community1] || 0) + weight;
  }

  for (i = 0, l1 = communities.length; i < l1; i++)
    Q += internalW[i] - (totalW[i] * totalW[i] / M);
  return Q / M;
}

module.exports = modularity;
