// Generated by CoffeeScript 1.6.3
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define([], function() {
    var TextAdder;
    return TextAdder = (function(_super) {
      __extends(TextAdder, _super);

      function TextAdder(options) {
        this.options = options;
        this.createTriple = __bind(this.createTriple, this);
        TextAdder.__super__.constructor.call(this);
      }

      TextAdder.prototype.init = function(instances) {
        var $addNode, $addProfileHelper, $inputArea, $inputButton,
          _this = this;
        this.dataController = instances['local/Neo4jDataController'];
        this.graphModel = instances['GraphModel'];
        this.selection = instances['NodeSelection'];
        this.linkSelection = instances['LinkSelection'];
        this.graphView = instances['GraphView'];
        this.nodeEdit = instances['local/NodeEdit'];
        this.expander = instances['Expander'];
        $addNode = $("<div id='add-node-text' class='result-element'><span>Create in the Rhizi</span><br/><br/></div>").appendTo($('#omniBox'));
        $addProfileHelper = $("<div class='node-profile-helper'></div>").appendTo($('#omniBox'));
        $inputArea = $("<textarea id='textAdder-input' placeholder='@rhizi makes @graphs' rows='5' cols='32'></textarea>").appendTo($addNode);
        $inputButton = $("<input type='button' value='Create'></input>").appendTo($addNode);
        $inputButton.click(function() {
          _this.createTriple(_this.parseSyntax($inputArea.val()));
          $inputArea.val("");
          return $inputArea.focus();
        });
        return $inputArea.keyup(function(e) {
          if (e.keyCode === 13) {
            _this.createTriple(_this.parseSyntax($inputArea.val()));
            $inputArea.val("");
            return $inputArea.focus();
          }
        });
      };

      TextAdder.prototype.createTriple = function(tripleList) {
        var newLink, node, sourceNode, targetNode,
          _this = this;
        console.log(tripleList);
        if (tripleList.length === 1) {
          node = {
            name: tripleList[0]
          };
          return this.dataController.nodeAdd(node, function(newNode) {
            _this.graphModel.putNode(newNode);
            return _this.selection.toggleSelection(newNode);
          });
        } else {
          sourceNode = {
            name: tripleList[0]
          };
          newLink = {
            "properties": {
              name: tripleList[1]
            }
          };
          targetNode = {
            name: tripleList[2]
          };
          return this.dataController.nodeAdd(sourceNode, function(sNode) {
            _this.graphModel.putNode(sNode);
            _this.selection.toggleSelection(sNode);
            return _this.dataController.nodeAdd(targetNode, function(tNode) {
              _this.graphModel.putNode(tNode);
              _this.selection.toggleSelection(tNode);
              newLink["source"] = sNode;
              newLink["target"] = tNode;
              return _this.dataController.linkAdd(newLink, function(link) {
                if (link.start === sNode['_id']) {
                  link.source = sNode;
                  link.target = tNode;
                } else {
                  link.source = tNode;
                  link.target = sNode;
                }
                _this.graphModel.putLink(link);
                return _this.linkSelection.toggleSelection(link);
              });
            });
          });
        }
      };

      TextAdder.prototype.parseSyntax = function(input) {
        var linkData, match, pattern, tags, text;
        text = input;
        pattern = new RegExp(/(\@[a-z][a-z0-9-_]*)/ig);
        tags = [];
        while (match = pattern.exec(text)) {
          tags.push(match[1].trim());
        }
        linkData = text.replace(/(\@[a-z][a-z0-9-_]*)/ig, "").trim();
        console.log("tags", tags);
        if (tags.length > 1) {
          return [tags[0].slice(1), linkData, tags[1].slice(1)];
        } else {
          return [tags[0].slice(1)];
        }
      };

      return TextAdder;

    })(Backbone.View);
  });

}).call(this);