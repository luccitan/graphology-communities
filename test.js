/**
 * Graphology Communities Unit Tests
 * ============================
 */

var assert = require('assert'),
    chai = require('chai').assert,
    Graph = require('graphology');

var louvain = require('./louvain.js'),
    modularity = require('./modularity.js'),
    parse = require('./helpers.js').parse,
    TYPE = require('./helpers.js').types;

var clique3 = require('./datasets/clique3.json'),
    complex500 = require('./datasets/complex500.json'),
    directed500 = require('./datasets/directed500.json'),
    undirected500 = require('./datasets/undirected500.json'),
    mixed1000 = require('./datasets/mixed1000.json'),
    undirected1000 = require('./datasets/undirected1000.json'),
    directed1000 = require('./datasets/directed1000.json');

describe('graphology-communities', function() {

  this.timeout(0);

  /**
   * Modularity metric unit testing
   * ***************
   */
  describe('modularity', function() {

    it('should throw if given graph is invalid.', function() {
        assert.throws(function() {
          modularity(null, []);
        }, /graphology/);
      });

    it('should throw if given communities set is invalid.', function() {
        assert.throws(function() {
          modularity(new Graph(), null);
        }, /graphology/);

        assert.throws(function() {
          modularity(new Graph(), 'foo');
        }, /graphology/);

        assert.throws(function() {
          modularity(new Graph(), []);
        }, /graphology/);
      });

    it('should throw if the given graph has no edges.', function() {
      var graph = new Graph();
      graph.addNodesFrom([1, 2]);

      assert.throws(function() {
        modularity(graph, [['1'], ['2']]);
      }, /graphology/);
    });

    it('should handle unique partitions of cliques.', function() {
      var graph = new Graph();
      graph.addNodesFrom([1, 2, 3]);
      graph.addUndirectedEdge(1, 2);
      graph.addUndirectedEdge(1, 3);
      graph.addUndirectedEdge(2, 3);

      chai.closeTo(modularity(graph, [['1', '2', '3']]), 0, 0.01);
    });

    it('should handle tiny weighted graphs (5 nodes).', function() {
      var graph = new Graph();
      graph.addNodesFrom([1, 2, 3, 4, 5]);

      graph.addUndirectedEdge(1, 2, {weight: 30});
      graph.addUndirectedEdge(1, 5);
      graph.addUndirectedEdge(2, 3, {weight: 15});
      graph.addUndirectedEdge(2, 4, {weight: 10});
      graph.addUndirectedEdge(2, 5);
      graph.addUndirectedEdge(3, 4, {weight: 5});
      graph.addUndirectedEdge(4, 5, {weight: 100});

      chai.closeTo(modularity(graph, [['1', '2', '3'], ['4', '5']]), 0.337, 0.01);
    });

    it('should handle tiny directed graphs (5 nodes).', function() {
      var graph = new Graph({type: 'directed'});
      graph.addNodesFrom([1, 2, 3, 4, 5]);
      graph.addDirectedEdge(1, 2);
      graph.addDirectedEdge(1, 5);
      graph.addDirectedEdge(2, 3);
      graph.addDirectedEdge(3, 4);
      graph.addDirectedEdge(4, 2);
      graph.addDirectedEdge(5, 1);

      chai.closeTo(modularity(graph, [['1', '5'], ['2', '3', '4']]), 0.22, 0.01);
    });

    it('should handle tiny undirected graphs (12 nodes).', function() {
      var o = parse(clique3, TYPE.UNDIRECTED);
      chai.closeTo(modularity(o.graph, o.partitioning), 0.524, 0.01);
    });

    it('should handle heavy-sized undirected graphs (500 nodes).', function() {
      var o = parse(undirected500, TYPE.UNDIRECTED);
      chai.closeTo(modularity(o.graph, o.partitioning), 0.397, 0.01);
    });

    it('should handle heavy-sized directed graphs (500 nodes).', function() {
      var o = parse(directed500, TYPE.DIRECTED);
      chai.closeTo(modularity(o.graph, o.partitioning), 0.408, 0.01);
    });

  });

  /**
   * Louvain algorithm unit testing
   * ***************
   */
  describe('louvain', function() {

    it('should throw if given graph is invalid.', function() {
      assert.throws(function() {
        louvain(null);
      }, /graphology/);
    });

    it('should throw if provided with a MultiGraph.', function() {
      assert.throws(function() {
        var graph = new Graph(null, {multi: true});
        louvain(graph);
      }, /multi/i);
    });

    it('should throw if the given graph has no edges.', function() {
      var graph = new Graph();
      graph.addNodesFrom([1, 2]);

      assert.throws(function() {
        louvain(graph);
      }, /graphology/);
    });

    it('should assign the new community on `community` attribute by default', function() {
      var o = parse(clique3, TYPE.UNDIRECTED),
          attr = 'community';
      louvain.assign(o.graph);

      assert.equal(o.graph.getNodeAttribute('0', attr), o.graph.getNodeAttribute('1', attr));
      assert.equal(o.graph.getNodeAttribute('1', attr), o.graph.getNodeAttribute('2', attr));
      assert.equal(o.graph.getNodeAttribute('2', attr), o.graph.getNodeAttribute('3', attr));

      assert.equal(o.graph.getNodeAttribute('4', attr), o.graph.getNodeAttribute('5', attr));
      assert.equal(o.graph.getNodeAttribute('5', attr), o.graph.getNodeAttribute('6', attr));
      assert.equal(o.graph.getNodeAttribute('6', attr), o.graph.getNodeAttribute('7', attr));

      assert.equal(o.graph.getNodeAttribute('8', attr), o.graph.getNodeAttribute('9', attr));
      assert.equal(o.graph.getNodeAttribute('9', attr), o.graph.getNodeAttribute('10', attr));
      assert.equal(o.graph.getNodeAttribute('10', attr), o.graph.getNodeAttribute('11', attr));
    });

    it('should assign the new community with a custom attribute name', function() {
      var o = parse(clique3, TYPE.UNDIRECTED),
          attr = 'foo';
      louvain.assign(o.graph, { attributes: {community: 'foo'}});

      assert.equal(o.graph.getNodeAttribute('0', attr), o.graph.getNodeAttribute('1', attr));
      assert.equal(o.graph.getNodeAttribute('1', attr), o.graph.getNodeAttribute('2', attr));
      assert.equal(o.graph.getNodeAttribute('2', attr), o.graph.getNodeAttribute('3', attr));

      assert.equal(o.graph.getNodeAttribute('4', attr), o.graph.getNodeAttribute('5', attr));
      assert.equal(o.graph.getNodeAttribute('5', attr), o.graph.getNodeAttribute('6', attr));
      assert.equal(o.graph.getNodeAttribute('6', attr), o.graph.getNodeAttribute('7', attr));

      assert.equal(o.graph.getNodeAttribute('8', attr), o.graph.getNodeAttribute('9', attr));
      assert.equal(o.graph.getNodeAttribute('9', attr), o.graph.getNodeAttribute('10', attr));
      assert.equal(o.graph.getNodeAttribute('10', attr), o.graph.getNodeAttribute('11', attr));
    });

    it('should handle a small undirected graph with 3 connected cliques', function() {
      var o = parse(clique3, TYPE.UNDIRECTED);
      var communities = louvain(o.graph);

      chai.closeTo(modularity(o.graph, communities), 0.524, 0.001);
      assert.deepEqual(communities.length, o.partitioning.length);
    });

    it('should handle heavy-sized complex graph\n' +
      '(undirected, weighted, with self-loops) (500 nodes, 4302 links)', function() {
      var o = parse(complex500, TYPE.UNDIRECTED);
      var communities = louvain(o.graph);

      chai.closeTo(modularity(o.graph, communities), 0.407, 0.01);
      assert.deepEqual(communities.length, o.partitioning.length);
    });

   it('should handle heavy-sized undirected graph (500 nodes, 4813 links)', function() {
      var o =  parse(undirected500, TYPE.UNDIRECTED);
      var communities = louvain(o.graph);

      chai.closeTo(modularity(o.graph, communities), 0.397, 0.01);
      assert.deepEqual(communities.length, o.partitioning.length);
    });

    it('should handle heavy-sized mixed graph (1000 nodes, 6907 links)', function() {
      var o = parse(mixed1000, TYPE.MIXED);
      var communities = louvain(o.graph);

      chai.closeTo(modularity(o.graph, communities), 0.354, 0.01);
      assert.deepEqual(communities.length, 8);
    });

    it('should handle heavy-sized undirected graph (1000 nodes, 9724 links)', function() {
      var o = parse(undirected1000, TYPE.UNDIRECTED);
      var communities = louvain(o.graph);

      chai.closeTo(modularity(o.graph, communities), 0.437, 0.01);
      assert.deepEqual(communities.length, o.partitioning.length);
    });

    it('should handle heavy-sized directed graph (1000 nodes, 10000 links)', function() {
      var o = parse(directed1000, TYPE.DIRECTED);
      var communities = louvain(o.graph);

      chai.closeTo(modularity(o.graph, communities), 0.433, 0.01);
      assert.deepEqual(communities.length, o.partitioning.length);
    });

  });

});
