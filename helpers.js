/**
 * Graphology Communities helpers
 * ******************
 */

var Graph = require('graphology');

var T = {
  UNDIRECTED: 1,
  DIRECTED: 2,
  MIXED: 3,
};

/**
 * Parsing function to retrieve graph datasets
 * for unit testing
 */
exports.parse = function(dataset, type) {
   var graph = new Graph(),
      nodes = dataset.nodes,
      edges = dataset.edges,
      community, partitioning = [];

  var node,
      i, l,
      keys, mapper = {};

  for (i = 0, l = nodes.length; i < l; i++) {
    node = nodes[i];
    graph.addNode(node.id);
    community = node.attributes['Modularity Class'];
    if (mapper[community] === undefined)
      mapper[community] = [node.id];
    else
      mapper[community].push(node.id);
  }

  for (i = 0, l = edges.length; i < l; i++) {
    if (graph.hasEdge(edges[i].source, edges[i].target))
      continue;

    if (type === T.DIRECTED || (type === T.MIXED && edges[i].attributes.Orientation === 'directed'))
      graph.addDirectedEdge(edges[i].source, edges[i].target);
    else
      graph.addUndirectedEdge(edges[i].source, edges[i].target);
  }

  keys = Object.keys(mapper);
  for (i = 0, l = keys.length; i < l; i++)
    partitioning.push(mapper[i]);

return {graph: graph, partitioning: partitioning};
};

exports.types = T;
