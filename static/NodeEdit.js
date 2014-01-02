// Generated by CoffeeScript 1.6.3
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define([], function() {
    var NodeEdit;
    return NodeEdit = (function(_super) {
      __extends(NodeEdit, _super);

      function NodeEdit(options) {
        this.options = options;
        NodeEdit.__super__.constructor.call(this);
      }

      NodeEdit.prototype.init = function(instances) {
        var _this = this;
        this.selection = instances["NodeSelection"];
        this.selection.on("change", this.update.bind(this));
        this.listenTo(instances["KeyListener"], "down:80", function() {
          return _this.$el.toggle();
        });
        instances["Layout"].addPlugin(this.el, this.options.pluginOrder, 'Node Edit');
        this.$el.toggle();
        return this.Create = instances['local/Create'];
      };

      NodeEdit.prototype.update = function() {
        var $container, blacklist, selectedNodes,
          _this = this;
        this.$el.empty();
        selectedNodes = this.selection.getSelectedNodes();
        $container = $("<div class=\"node-profile-helper\"/>").appendTo(this.$el);
        blacklist = ["index", "x", "y", "px", "py", "fixed", "selected", "weight"];
        return _.each(selectedNodes, function(node) {
          var $nodeDiv, $nodeEdit;
          $nodeDiv = $("<div class=\"node-profile\"/>").appendTo($container);
          $("<div class=\"node-profile-title\">" + node['text'] + "</div>").appendTo($nodeDiv);
          _.each(node, function(value, property) {
            var makeLinks;
            if (blacklist.indexOf(property) < 0) {
              makeLinks = value.replace(/((https?|ftp|dict):[^'">\s]+)/gi, "<a href=\"$1\">$1</a>");
              return $("<div class=\"node-profile-property\">" + property + ":  " + makeLinks + "</div>").appendTo($nodeDiv);
            }
          });
          $nodeEdit = $("<input id=\"NodeEditButton" + node['_id'] + "\" class=\"NodeEditButton\" type=\"button\" value=\"Edit this node\">").appendTo($nodeDiv);
          return $nodeEdit.click(function() {
            return _this.editNode(node, $nodeDiv, blacklist);
          });
        });
      };

      NodeEdit.prototype.editNode = function(node, nodeDiv, blacklist) {
        var $nodeCancel, $nodeCreate, $nodeDelete, $nodeMoreFields, nodeInputNumber,
          _this = this;
        console.log("Editing node: " + node['_id']);
        nodeInputNumber = 0;
        nodeDiv.html("<div class=\"node-profile-title\">Editing " + node['text'] + " (id: " + node['_id'] + ")</div><form id=\"Node" + node['_id'] + "EditForm\"></form>");
        _.each(node, function(value, property) {
          if (blacklist.indexOf(property) < 0 && ["_id", "text"].indexOf(property) < 0) {
            $("<div id=\"Node" + node['_id'] + "EditDiv" + nodeInputNumber + "\" class=\"Node" + node['_id'] + "EditDiv\"><input style=\"width:80px\" id=\"Node" + node['_id'] + "EditProperty" + nodeInputNumber + "\" value=\"" + property + "\" /> <input style=\"width:80px\" id=\"Node" + node['_id'] + "EditValue" + nodeInputNumber + "\" value=\"" + value + "\" /> <input type=\"button\" id=\"removeNode" + node['_id'] + "Edit" + nodeInputNumber + "\" value=\"x\" onclick=\"this.parentNode.parentNode.removeChild(this.parentNode);\"></div>").appendTo("#Node" + node['_id'] + "EditForm");
            return nodeInputNumber = nodeInputNumber + 1;
          }
        });
        $nodeMoreFields = $("<input id=\"moreNode" + node['_id'] + "EditFields\" type=\"button\" value=\"+\">").appendTo(nodeDiv);
        $nodeMoreFields.click(function() {
          _this.Create.addField(nodeInputNumber, "Node" + node['_id'] + "Edit");
          return nodeInputNumber = nodeInputNumber + 1;
        });
        $nodeCreate = $("<input name=\"NodeCreateButton\" type=\"button\" value=\"Save\">").appendTo(nodeDiv);
        $nodeCreate.click(function() {
          return console.log("Save Node requested");
        });
        $nodeDelete = $("<input name=\"NodeDeleteButton\" type=\"button\" value=\"Delete\">").appendTo(nodeDiv);
        $nodeDelete.click(function() {
          return console.log("Deletion requested");
        });
        $nodeCancel = $("<input name=\"NodeCancelButton\" type=\"button\" value=\"Cancel\">").appendTo(nodeDiv);
        return $nodeCancel.click(function() {
          var $nodeEdit;
          nodeDiv.html("<div class=\"node-profile-title\">" + node['text'] + "</div>");
          _.each(node, function(value, property) {
            if (blacklist.indexOf(property) < 0) {
              return $("<div class=\"node-profile-property\">" + property + ":  " + value + "</div>").appendTo(nodeDiv);
            }
          });
          $nodeEdit = $("<input id=\"NodeEditButton" + node['_id'] + "\" class=\"NodeEditButton\" type=\"button\" value=\"Edit this node\">").appendTo(nodeDiv);
          return $nodeEdit.click(function() {
            return _this.editNode(node, nodeDiv, blacklist);
          });
        });
      };

      return NodeEdit;

    })(Backbone.View);
  });

}).call(this);
