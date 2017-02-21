/**
 * Graphology Modularity
 * ======================
 * < IMPORTANT NOTES >
 * > Gephi doesn't consider directed edges :
 *   directed edges produces the same modularity as if they were undirected
 *     - if there are a->b and b->a : consider a<->b
 *     - if there is a-> only or b->a only : consider ALSO a<->b
 *     - if there are a->b , b->a with differents weights, only one is considered
 *
 * > The order chosen by Gephi is unknown, it is a sensitive case not handled
 *
 * > self-loops are not considered at all, ...
 *   ... not in the total weights, not in the computing part.
 *   (remove them and it will be the same modularity score)
 *
 * > ...
 */
var defaults = require('lodash/defaultsDeep'),
    isGraph = require('graphology-utils/is-graph');

var DEFAULTS = {attributes: {weight: 'weight'}};

/**
 * Function returning the modularity of the graph
 *
 * @param  {Graph} graph - Target graph.
 * @param {Object} communities - the set of communitites
 * @return number
 */
function modularity(graph, communities, options) {
  if (!isGraph(graph))
    throw new Error('graphology-modularity: the given graph is not a valid graphology instance.');
  if (graph.multi)
    throw new Error('graphology-louvain: MultiGraph are not handled');
  if (!communities || communities.constructor !== Object)
    throw new Error('graphology-modularity: the given communities set is not an object.');
  if (!graph.size)
    throw new Error('graphology-modularity: the graph has no edges');

  // Attributes name
  options = defaults({}, options, DEFAULTS);

  var M = 0,
      Q = 0,
      i, l1,
      internalW = {},
      totalW = {},
      edges = graph.edges(),
      bounds,
      node1, node2, edge,
      community1, community2,
      w, weight;

  for (i = 0, l1 = edges.length; i < l1; i++) {
    edge = edges[i];
    bounds = graph.extremities(edge);
    node1 = bounds[0];
    node2 = bounds[1];
    if (node1 === node2)
      continue;

    community1 = communities[node1];
    community2 = communities[node2];
    if (community1 === undefined)
      throw new Error('graphology-modularity: the node ' + node1 + ' is not in the partition.');
    if (community2 === undefined)
      throw new Error('graphology-modularity: the node ' + node2 + ' is not in the partition.');

    w = graph.getEdgeAttribute(edge, options.attributes.weight);
    weight = isNaN(w) ? 1 : w;

    totalW[community1] = (totalW[community1] || 0) + weight;
    if (graph.undirected(edge) || !graph.hasDirectedEdge(node2, node1)) {
      totalW[community2] = (totalW[community2] || 0) + weight;
      M += 2 * weight;
    }
    else
      M += weight;

    if (!graph.hasDirectedEdge(node2, node1))
      weight *= 2;

    if (community1 === community2)
      internalW[community1] = (internalW[community1] || 0) + weight;
  }

  for (community1 in totalW)
    Q += ((internalW[community1] || 0) - (totalW[community1] * totalW[community1] / M));

  return Q / M;
}

module.exports = modularity;
