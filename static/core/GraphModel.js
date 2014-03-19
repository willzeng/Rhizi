// Generated by CoffeeScript 1.6.3
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define([], function() {
    var GraphModel, _ref;
    return GraphModel = (function(_super) {
      __extends(GraphModel, _super);

      function GraphModel() {
        _ref = GraphModel.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      GraphModel.prototype.init = function() {};

      GraphModel.prototype.initialize = function() {
        this.set("nodes", []);
        this.set("links", []);
        return this.set("nodeSet", {});
      };

      GraphModel.prototype.getNodes = function() {
        return this.get("nodes");
      };

      GraphModel.prototype.getLinks = function() {
        return this.get("links");
      };

      GraphModel.prototype.putNode = function(node) {
        if (this.get("nodeSet")[this.get("nodeHash")(node)]) {
          return;
        }
        this.get("nodeSet")[this.get("nodeHash")(node)] = true;
        this.trigger("add:node", node);
        return this.pushDatum("nodes", node);
      };

      GraphModel.prototype.putLink = function(link) {
        if (link.strength == null) {
          link.strength = 1;
        }
        if (link.strength !== 0) {
          this.pushDatum("links", link);
          return this.trigger("add:link", link);
        }
      };

      GraphModel.prototype.pushDatum = function(attr, datum) {
        var data;
        data = this.get(attr);
        data.push(datum);
        this.set(attr, data);
        /*
        QA: this is not already fired because of the rep-exposure of get.
        `data` is the actual underlying object
        so even though set performs a deep search to detect changes,
        it will not detect any because it's literally comparing the same object.
        
        Note: at least we know this will never be a redundant trigger
        */

        this.trigger("change:" + attr);
        return this.trigger("change");
      };

      GraphModel.prototype.filterNodes = function(filter) {
        var linkFilter, nodeWasRemoved, removed, wrappedFilter,
          _this = this;
        nodeWasRemoved = function(node) {
          return _.some(removed, function(n) {
            return _.isEqual(n, node);
          });
        };
        linkFilter = function(link) {
          return !nodeWasRemoved(link.source) && !nodeWasRemoved(link.target);
        };
        removed = [];
        wrappedFilter = function(d) {
          var decision;
          decision = filter(d);
          if (!decision) {
            removed.push(d);
            delete _this.get("nodeSet")[_this.get("nodeHash")(d)];
          }
          return decision;
        };
        this.filterAttribute("nodes", wrappedFilter);
        return this.filterLinks(linkFilter);
      };

      GraphModel.prototype.filterLinks = function(filter) {
        return this.filterAttribute("links", filter);
      };

      GraphModel.prototype.filterAttribute = function(attr, filter) {
        var filteredData;
        filteredData = _.filter(this.get(attr), filter);
        return this.set(attr, filteredData);
      };

      return GraphModel;

    })(Backbone.Model);
  });

}).call(this);
