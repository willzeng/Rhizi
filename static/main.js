
/* This is the main file that constructs the client-side application
*/

(function() {

  requirejs.config({
    baseUrl: "/core/",
    paths: {
      local: "."
    }
  });

  /*
  
  You need only require the Celestrium plugin.
  NOTE: it's module loads the globally defined standard js libraries
        like jQuery, underscore, etc...
  */

  require(["Celestrium"], function(Celestrium) {
    /*
    
      This dictionary defines which plugins are to be included
      and what their arguments are.
    
      The key is the requirejs path to the plugin.
      The value is passed to its constructor.
    */
    var plugins;
    plugins = {
      KeyListener: document.querySelector("body"),
      GraphModel: {
        nodeHash: function(node) {
          return node['_id'];
        },
        linkHash: function(link) {
          if (link['_id'] != null) {
            return link['_id'];
          } else {
            return 0;
          }
        }
      },
      GraphView: {},
      "local/Neo4jDataController": {},
      "local/WikiNetsDataProvider": {},
      NodeSelection: {},
      LinkSelection: {},
      "local/VisualSearch": {},
      "local/SimpleSearchBox": {},
      "local/NodeEdit": {},
      "local/AddNode": {},
      "local/LinkEdit": {},
      "local/ToolBox": {},
      "local/TopBarCreate": {},
      DropdownMenu: {},
      Expander: {},
      LinkHover: {},
      MiniMap: {},
      "Sliders": {},
      "ForceSliders": {},
      "local/NodeCreationPopout": {},
      "local/LinkCreationPopout": {}
    };
    return Celestrium.init(plugins, function(instances) {
      var loadEverything;
      loadEverything = function(nodes) {
        var node, _i, _len, _results;
        _results = [];
        for (_i = 0, _len = nodes.length; _i < _len; _i++) {
          node = nodes[_i];
          _results.push(instances["GraphModel"].putNode(node));
        }
        return _results;
      };
      $.get('/get_default_nodes', loadEverything);
      return instances["GraphView"].getLinkFilter().set("threshold", 0);
    });
  });

}).call(this);
