(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  define([], function() {
    var TopBarCreate;
    return TopBarCreate = (function(_super) {

      __extends(TopBarCreate, _super);

      function TopBarCreate(options) {
        this.options = options;
        this.buildLink = __bind(this.buildLink, this);
        this.createNode = __bind(this.createNode, this);
        this.assign_properties = __bind(this.assign_properties, this);
        this.addField = __bind(this.addField, this);
        TopBarCreate.__super__.constructor.call(this);
      }

      TopBarCreate.prototype.init = function(instances) {
        _.extend(this, Backbone.Events);
        this.keyListener = instances['KeyListener'];
        this.graphView = instances['GraphView'];
        this.graphModel = instances['GraphModel'];
        this.dataController = instances['local/Neo4jDataController'];
        this.buildingLink = false;
        this.tempLink = {};
        this.sourceSet = false;
        this.render();
        this.selection = instances["NodeSelection"];
        return this.linkSelection = instances["LinkSelection"];
      };

      TopBarCreate.prototype.render = function() {
        var $container, $createNodeButton, $linkHolder, $linkInputForm, $linkMoreFields, $linkSide, $linkingInstructions, $nodeHolder, $nodeInputForm, $nodeMoreFields, $nodeSide, $openPopoutButton, linkInputNumber, nodeInputNumber,
          _this = this;
        $container = $('<div id="topbarcreate">').appendTo($('#buildbar'));
        $nodeSide = $('<div id="nodeside">').appendTo($container);
        $nodeHolder = $('<textarea placeholder="Add Node" id="nodeHolder" name="textin" rows="1" cols="35"></textarea>').appendTo($nodeSide);
        this.$nodeWrapper = $('<div id="NodeCreateContainer">').appendTo($nodeSide);
        this.$nodeInputName = $('<textarea id="NodeCreateName" placeholder=\"Node Name [optional]\" rows="1" cols="35"></textarea><br>').appendTo(this.$nodeWrapper);
        this.$nodeInputUrl = $('<textarea id="NodeCreateUrl" placeholder="Url [optional]" rows="1" cols="35"></textarea><br>').appendTo(this.$nodeWrapper);
        this.$nodeInputDesc = $('<textarea id="NodeCreateDesc" placeholder="Description [optional]" rows="1" cols="35"></textarea><br>').appendTo(this.$nodeWrapper);
        $nodeInputForm = $('<form id="NodeCreateForm"></form>').appendTo(this.$nodeWrapper);
        nodeInputNumber = 0;
        $nodeMoreFields = $("<input id=\"moreNodeCreateFields\" type=\"button\" value=\"+\">").appendTo(this.$nodeWrapper);
        $nodeMoreFields.click(function() {
          _this.addField(nodeInputNumber, "NodeCreate");
          return nodeInputNumber = nodeInputNumber + 1;
        });
        $createNodeButton = $('<input id="queryform" type="button" value="Create Node">').appendTo(this.$nodeWrapper);
        $createNodeButton.click(this.createNode);
        $openPopoutButton = $('<i class="right fa fa-expand"></i>').appendTo(this.$nodeWrapper);
        $openPopoutButton.click(function() {
          _this.trigger('popout:open');
          _this.$nodeWrapper.hide();
          return $nodeHolder.show();
        });
        $linkSide = $('<div id="linkside">').appendTo($container);
        $linkHolder = $('<textarea placeholder="Add Link" id="linkHolder" name="textin" rows="1" cols="35"></textarea>').appendTo($linkSide);
        this.$linkWrapper = $('<div id="LinkCreateContainer">').appendTo($linkSide);
        this.$linkInputName = $('<textarea id="LinkCreateName" placeholder=\"Link Name [optional]\" rows="1" cols="35"></textarea><br>').appendTo(this.$linkWrapper);
        this.$linkInputUrl = $('<textarea id="LinkCreateUrl" placeholder="Url [optional]" rows="1" cols="35"></textarea><br>').appendTo(this.$linkWrapper);
        this.$linkInputDesc = $('<textarea id="LinkCreateDesc" placeholder="Description [optional]" rows="1" cols="35"></textarea><br>').appendTo(this.$linkWrapper);
        $linkInputForm = $('<form id="LinkCreateForm"></form>').appendTo(this.$linkWrapper);
        linkInputNumber = 0;
        $linkMoreFields = $("<input id=\"moreLinkCreateFields\" type=\"button\" value=\"+\">").appendTo(this.$linkWrapper);
        $linkMoreFields.click(function() {
          _this.addField(linkInputNumber, "LinkCreate");
          return linkInputNumber = linkInputNumber + 1;
        });
        this.$createLinkButton = $('<input id="LinkCreateButton" type="button" value="Attach & Create Link">').appendTo(this.$linkWrapper);
        $linkingInstructions = $('<span id="toplink-instructions">').appendTo($container);
        this.$createLinkButton.click(function() {
          if (_this.buildingLink) {
            _this.buildingLink = false;
            _this.tempLink = {};
            _this.sourceSet = false;
            $('#toplink-instructions').replaceWith('<span id="toplink-instructions"></span>');
            _this.$createLinkButton.val('Attach & Create Link');
            return _this.$linkInputName.focus();
          } else {
            return _this.buildLink();
          }
        });
        this.$nodeWrapper.hide();
        this.$linkWrapper.hide();
        $nodeHolder.focus(function() {
          _this.$nodeWrapper.show();
          _this.$nodeInputName.focus();
          return $nodeHolder.hide();
        });
        $linkHolder.focus(function() {
          _this.$linkWrapper.show();
          _this.$linkInputName.focus();
          return $linkHolder.hide();
        });
        this.graphView.on("view:click", function() {
          if (_this.$nodeWrapper.is(':visible')) {
            _this.$nodeWrapper.hide();
            $nodeHolder.show();
          }
          if (_this.$linkWrapper.is(':visible')) {
            _this.$linkWrapper.hide();
            return $linkHolder.show();
          }
        });
        return this.graphView.on("enter:node:click", function(node) {
          var link;
          if (_this.buildingLink) {
            if (_this.sourceSet) {
              _this.tempLink.target = node;
              link = _this.tempLink;
              _this.dataController.linkAdd(link, function(linkres) {
                var allNodes, n, newLink, _i, _j, _len, _len2;
                newLink = linkres;
                allNodes = _this.graphModel.getNodes();
                for (_i = 0, _len = allNodes.length; _i < _len; _i++) {
                  n = allNodes[_i];
                  if (n['_id'] === link.source['_id']) newLink.source = n;
                }
                for (_j = 0, _len2 = allNodes.length; _j < _len2; _j++) {
                  n = allNodes[_j];
                  if (n['_id'] === link.target['_id']) newLink.target = n;
                }
                _this.graphModel.putLink(newLink);
                return _this.linkSelection.toggleSelection(newLink);
              });
              _this.sourceSet = _this.buildingLink = false;
              $('.LinkCreateDiv').each(function(i, obj) {
                return $(this)[0].parentNode.removeChild($(this)[0]);
              });
              _this.$linkInputName.val('');
              _this.$linkInputDesc.val('');
              _this.$linkInputUrl.val('');
              $('#toplink-instructions').replaceWith('<span id="toplink-instructions"></span>');
              _this.$createLinkButton.val('Attach & Create Link');
              return _this.$linkInputName.focus();
            } else {
              _this.tempLink.source = node;
              _this.sourceSet = true;
              return $('#toplink-instructions').replaceWith('<span id="toplink-instructions" style="color:black; font-size:20px">Source:' + _this.findHeader(node) + ' (' + node['_id'] + ')<br />Click a node to select it as the link target.</span>');
            }
          }
        });
      };

      TopBarCreate.prototype.update = function(node) {
        return this.selection.getSelectedNodes();
      };

      /*
          Adds a set of property & value input fields to the form /name/, together
          with a button for deleting them
          The inputIndex is a counter that serves as a unique identifier for each
          such set of fields.
          A defaultKey and defaultValue may be specified; these will be used as
          placeholders in the input fields.
      */

      TopBarCreate.prototype.addField = function(inputIndex, name, defaultKey, defaultValue) {
        var $row;
        if (!(defaultKey != null)) defaultKey = "property";
        if (!(defaultValue != null)) defaultValue = "value";
        $row = $("<div id=\"" + name + "Div" + inputIndex + "\" class=\"" + name + "Div\">\n<input style=\"width:80px\" name=\"property" + name + inputIndex + "\" placeholder=\"" + defaultKey + "\" class=\"property" + name + "\">\n<input style=\"width:80px\" name=\"value" + name + inputIndex + "\" placeholder=\"" + defaultValue + "\" class=\"value" + name + "\">\n<input type=\"button\" id=\"remove" + name + inputIndex + "\" value=\"x\" onclick=\"this.parentNode.parentNode.removeChild(this.parentNode);\">\n</div>");
        return $("#" + name + "Form").append($row);
      };

      /*
          Takes the input form /form_name/ and populates a propertyObject with the
          property-value pairs contained in it, checking the property names for
          legality in the process
          Returns: [submitOK, {property1: value1, property2: value2, ...}], where
                   /submitOK/ is a boolean indicating whether all property names are
                   legal
      */

      TopBarCreate.prototype.assign_properties = function(form_name, is_illegal) {
        var createDate, propertyObject, submitOK;
        if (is_illegal == null) is_illegal = this.dataController.is_illegal;
        submitOK = true;
        propertyObject = {};
        createDate = new Date();
        propertyObject["_Creation_Date"] = createDate;
        if (!($("#" + form_name + "Name").val() === void 0 || $("#" + form_name + "Name").val() === "")) {
          propertyObject["name"] = $("#" + form_name + "Name").val().replace(/'/g, "\\'");
        }
        if (!($("#" + form_name + "Desc").val() === void 0 || $("#" + form_name + "Desc").val() === "")) {
          propertyObject["description"] = $("#" + form_name + "Desc").val().replace(/'/g, "\\'");
        }
        if (!($("#" + form_name + "Url").val() === void 0 || $("#" + form_name + "Url").val() === "")) {
          propertyObject["url"] = $("#" + form_name + "Url").val().replace(/'/g, "\\'");
        }
        $("." + form_name + "Div").each(function(i, obj) {
          var property, value;
          property = $(this).children(".property" + form_name).val();
          value = $(this).children(".value" + form_name).val();
          if (is_illegal(property, "Property")) {
            alert("Property '" + property + "' is not allowed.");
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

      /*
          Creates a node using the information in @$nodeInputName, @$nodeInputDesc,
          and NodeCreateDiv; resets the input forms if creation is successful
      */

      TopBarCreate.prototype.createNode = function() {
        var nodeObject,
          _this = this;
        nodeObject = this.assign_properties("NodeCreate");
        if (nodeObject[0]) {
          $('.NodeCreateDiv').each(function(i, obj) {
            return $(this)[0].parentNode.removeChild($(this)[0]);
          });
          this.$nodeInputName.val('');
          this.$nodeInputDesc.val('');
          this.$nodeInputUrl.val('');
          this.$nodeInputName.focus();
          return this.dataController.nodeAdd(nodeObject[1], function(datum) {
            datum.fixed = true;
            datum.px = ($(window).width() / 2 - _this.graphView.currentTranslation[0]) / _this.graphView.currentScale;
            datum.py = ($(window).height() / 2 - _this.graphView.currentTranslation[1]) / _this.graphView.currentScale;
            _this.graphModel.putNode(datum);
            return _this.selection.toggleSelection(datum);
          });
        }
      };

      /*
      */

      TopBarCreate.prototype.buildLink = function() {
        var linkProperties;
        console.log("Building Link");
        linkProperties = this.assign_properties("LinkCreate");
        if (linkProperties[0]) {
          this.tempLink["properties"] = linkProperties[1];
          this.buildingLink = true;
          $('#toplink-instructions').replaceWith('<span id="toplink-instructions" style="color:black; font-size:20px">Click a node to select it as the link source.</span>');
          return this.$createLinkButton.val('Cancel Link Creation');
        }
      };

      /*
          To Do: replace this with a "to string" method for nodes
      */

      TopBarCreate.prototype.findHeader = function(node) {
        if (node.name != null) {
          return node.name;
        } else if (node.title != null) {
          return node.title;
        } else {
          return '';
        }
      };

      return TopBarCreate;

    })(Backbone.View);
  });

}).call(this);
