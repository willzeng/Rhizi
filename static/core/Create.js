(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  define([], function() {
    var Create;
    return Create = (function(_super) {

      __extends(Create, _super);

      function Create(options) {
        this.options = options;
        this.assign_properties = __bind(this.assign_properties, this);
        this.createLink = __bind(this.createLink, this);
        this.createNode = __bind(this.createNode, this);
        this.addField = __bind(this.addField, this);
        Create.__super__.constructor.call(this);
      }

      Create.prototype.init = function(instances) {
        _.extend(this, Backbone.Events);
        this.graphView = instances['GraphView'];
        this.graphModel = instances['GraphModel'];
        this.dataController = instances['local/Neo4jDataController'];
        this.layout = instances["Layout"];
        this.layout.addPlugin(this.el, this.options.pluginOrder, 'Create');
        return this.render();
      };

      Create.prototype.render = function() {
        var $container, $linkCreate, $linkCreateSelectSourceButton, $linkCreateSelectTargetButton, $linkMoreFields, $nodeCreate, $nodeMoreFields, linkInputNumber, nodeInputNumber, selectingSource, selectingTarget,
          _this = this;
        $container = $("<div id=\"NodeCreateContainer\">\n  Create Node: \n  <form id=\"NodeCreateForm\">\n  </form>\n</div>\n<div id=\"LinkCreateContainer\">\n  Create Link: \n  <form id=\"LinkCreateForm\">\n    <span id=\"LinkCreateSelectSource\"></span>\n    <span id=\"LinkCreateSourceValue\"></span><br />\n    <span id=\"LinkCreateSelectTarget\"></span>\n    <span id=\"LinkCreateTargetValue\"></span><br />\n    <input style=\"width:80px\" id=\"LinkCreateType\" placeholder=\"Type\" />\n  </form>\n</div>");
        $container.appendTo(this.$el);
        nodeInputNumber = 0;
        linkInputNumber = 0;
        $nodeMoreFields = $("<input id=\"moreNodeCreateFields\" type=\"button\" value=\"+\">").appendTo("#NodeCreateContainer");
        $nodeMoreFields.click(function() {
          if ($('.NodeCreateDiv').length === 0) {
            _this.addField(nodeInputNumber, "NodeCreate", "name", "");
          } else {
            _this.addField(nodeInputNumber, "NodeCreate");
          }
          return nodeInputNumber = nodeInputNumber + 1;
        });
        $nodeCreate = $("<input id=\"NodeCreateButton\" type=\"button\" value=\"Create node\">").appendTo("#NodeCreateContainer");
        $nodeCreate.click(this.createNode);
        $linkCreateSelectSourceButton = $("<input id=\"LinkCreateSource\" type=\"button\" value=\"Source:\" />").appendTo("#LinkCreateSelectSource");
        $linkCreateSelectSourceButton.click(function() {
          $("#LinkCreateSourceValue").replaceWith("<span id=\"LinkCreateSourceValue\" style=\"font-style:italic;\">Selecting</span>");
          return _this.selectingSource = true;
        });
        $linkCreateSelectTargetButton = $("<input id=\"LinkCreateTarget\" type=\"button\" value=\"Target:\" />").appendTo("#LinkCreateSelectTarget");
        $linkCreateSelectTargetButton.click(function() {
          $("#LinkCreateTargetValue").replaceWith("<span id=\"LinkCreateTargetValue\" style=\"font-style:italic;\">Selecting</span>");
          return _this.selectingTarget = true;
        });
        $linkMoreFields = $("<input id=\"moreLinkCreateFields\" type=\"button\" value=\"+\">").appendTo("#LinkCreateContainer");
        $linkMoreFields.click(function() {
          _this.addField(linkInputNumber, "LinkCreate");
          return linkInputNumber = linkInputNumber + 1;
        });
        $linkCreate = $("<input id=\"LinkCreateButton\" type=\"button\" value=\"Create link\">").appendTo("#LinkCreateContainer");
        $linkCreate.click(this.createLink);
        selectingSource = false;
        selectingTarget = false;
        this.graphView.on("enter:node:click", function(node) {
          if (_this.selectingSource) {
            $("#LinkCreateSourceValue").replaceWith("<span id=\"LinkCreateSourceValue\">" + _this.graphView.findText(node) + " (id: " + node["_id"] + ")</span>");
            _this.selectingSource = false;
            _this.source = node;
          }
          if (_this.selectingTarget) {
            $("#LinkCreateTargetValue").replaceWith("<span id=\"LinkCreateTargetValue\">" + _this.graphView.findText(node) + " (id: " + node["_id"] + ")</span>");
            _this.selectingTarget = false;
            return _this.target = node;
          }
        });
        this.graphView.on("view:rightclick", function() {
          var createPlugin, key, plugin, pluginsList, value, _i, _len, _ref;
          _ref = _this.layout.pluginWrappers;
          for (key in _ref) {
            if (!__hasProp.call(_ref, key)) continue;
            value = _ref[key];
            pluginsList = _this.layout.pluginWrappers[key];
          }
          for (_i = 0, _len = pluginsList.length; _i < _len; _i++) {
            plugin = pluginsList[_i];
            if (plugin.pluginName === "Create") createPlugin = plugin;
          }
          if (createPlugin.collapsed) createPlugin.close();
          if ($('.NodeCreateDiv').length === 0) {
            _this.addField(nodeInputNumber, "NodeCreate", "name", "");
            return nodeInputNumber = nodeInputNumber + 1;
          }
        });
        return this;
      };

      Create.prototype.addField = function(inputIndex, name, defaultKey, defaultValue) {
        var $row;
        if (!(defaultKey != null)) defaultKey = "propertyEx";
        if (!(defaultValue != null)) defaultValue = "valueEx";
        $row = $("<div id=\"" + name + "Div" + inputIndex + "\" class=\"" + name + "Div\">\n<input style=\"width:80px\" name=\"property" + name + inputIndex + "\" placeholder=\"" + defaultKey + "\" class=\"property" + name + "\">\n<input style=\"width:80px\" name=\"value" + name + inputIndex + "\" placeholder=\"" + defaultValue + "\" class=\"value" + name + "\">\n<input type=\"button\" id=\"remove" + name + inputIndex + "\" value=\"x\" onclick=\"this.parentNode.parentNode.removeChild(this.parentNode);\">\n</div>");
        return $("#" + name + "Form").append($row);
      };

      Create.prototype.createNode = function() {
        var nodeObject,
          _this = this;
        nodeObject = this.assign_properties("NodeCreate");
        if (nodeObject[0]) {
          $('.NodeCreateDiv').each(function(i, obj) {
            return $(this)[0].parentNode.removeChild($(this)[0]);
          });
          return this.dataController.nodeAdd(nodeObject[1], function(datum) {
            return _this.graphModel.putNode(datum);
          });
        }
      };

      Create.prototype.createLink = function() {
        var linkObject, linkProperties,
          _this = this;
        if (this.source === void 0 || this.target === void 0 || this.selectingSource || this.selectingTarget) {
          alert("Please select a source and a target.");
          return false;
        }
        if (this.dataController.is_illegal($("#LinkCreateType").val(), "Relationship type")) {
          return false;
        }
        linkObject = {
          source: this.source,
          target: this.target
        };
        linkProperties = this.assign_properties("LinkCreate");
        linkProperties[1]["name"] = $("#LinkCreateType").val();
        if (linkProperties[0]) {
          $('.LinkCreateDiv').each(function(i, obj) {
            return $(this)[0].parentNode.removeChild($(this)[0]);
          });
          $("#LinkCreateSourceValue").replaceWith("<span id=\"LinkCreateSourceValue\"></span>");
          $("#LinkCreateTargetValue").replaceWith("<span id=\"LinkCreateTargetValue\"></span>");
          this.source = void 0;
          this.target = void 0;
          $("#LinkCreateType").val("");
          $("#LinkCreateType").attr("placeholder", "Type");
          linkObject["properties"] = linkProperties[1];
          return this.dataController.linkAdd(linkObject, function(linkres) {
            var allNodes, n, newLink, _i, _j, _len, _len2;
            newLink = linkres;
            allNodes = _this.graphModel.getNodes();
            for (_i = 0, _len = allNodes.length; _i < _len; _i++) {
              n = allNodes[_i];
              if (n['_id'] === linkObject.source['_id']) newLink.source = n;
            }
            for (_j = 0, _len2 = allNodes.length; _j < _len2; _j++) {
              n = allNodes[_j];
              if (n['_id'] === linkObject.target['_id']) newLink.target = n;
            }
            return _this.graphModel.putLink(newLink);
          });
        }
      };

      Create.prototype.assign_properties = function(form_name, is_illegal) {
        var createDate, propertyObject, submitOK;
        if (is_illegal == null) is_illegal = this.dataController.is_illegal;
        submitOK = true;
        propertyObject = {};
        createDate = new Date();
        propertyObject["_Creation_Date"] = createDate;
        $("." + form_name + "Div").each(function(i, obj) {
          var property, value;
          property = $(this).children(".property" + form_name).val();
          value = $(this).children(".value" + form_name).val();
          if (is_illegal(property, "Property")) {
            return submitOK = false;
          } else if (property in propertyObject) {
            alert("Property '" + property + "' already assigned.\nFirst value: " + propertyObject[property] + "\nSecond value: " + value);
            return submitOK = false;
          } else {
            return propertyObject[property] = value.replace(/'/g, "\\'");
          }
        });
        return [submitOK, propertyObject];
      };

      return Create;

    })(Backbone.View);
  });

}).call(this);
