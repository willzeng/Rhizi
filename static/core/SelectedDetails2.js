// Generated by CoffeeScript 1.6.3
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  define([], function() {
    var SelectedDetails2;
    return SelectedDetails2 = (function(_super) {
      var colors;

      __extends(SelectedDetails2, _super);

      colors = ['#F56545', '#FFBB22', '#BBE535', '#77DDBB', '#66CCDD', '#A9A9A9'];

      function SelectedDetails2(options) {
        this.options = options;
        this.addSpokes = __bind(this.addSpokes, this);
        this.addLinker = __bind(this.addLinker, this);
        this.renderLinkProfile = __bind(this.renderLinkProfile, this);
        this.renderProfile = __bind(this.renderProfile, this);
        this.findLinkHeader = __bind(this.findLinkHeader, this);
        this.assign_properties = __bind(this.assign_properties, this);
        this.addField = __bind(this.addField, this);
        this.deleteNode = __bind(this.deleteNode, this);
        this.cancelEditing = __bind(this.cancelEditing, this);
        this.editLink = __bind(this.editLink, this);
        SelectedDetails2.__super__.constructor.call(this);
      }

      SelectedDetails2.prototype.init = function(instances) {
        var _this = this;
        this.dataController = instances['local/Neo4jDataController'];
        this.graphModel = instances['GraphModel'];
        this.graphModel.on("change", this.update.bind(this));
        this.graphView = instances['GraphView'];
        this.selection = instances["NodeSelection"];
        this.selection.on("change", this.update.bind(this));
        this.listenTo(instances["KeyListener"], "down:80", function() {
          return _this.$el.toggle();
        });
        this.linkSelection = instances["LinkSelection"];
        return $(this.el).appendTo($('#omniBox'));
      };

      SelectedDetails2.prototype.update = function() {
        var $container, blacklist, selectedNodes,
          _this = this;
        if (!this.buildingLink) {
          this.$el.empty();
          selectedNodes = this.selection.getSelectedNodes();
          $container = $("<div class=\"node-profile-helper\"/>").appendTo(this.$el);
          blacklist = ["index", "x", "y", "px", "py", "fixed", "selected", "weight", "_id", "color", "shouldLoad"];
          this.blacklist = blacklist;
          return _.each(selectedNodes, function(node) {
            var $nodeDiv, _ref;
            if (!(node.color != null)) {
              node.color = "#A9A9A9";
            } else if (!(_ref = node.color.toUpperCase(), __indexOf.call(colors, _ref) >= 0)) {
              node.color = "#A9A9A9";
            }
            $nodeDiv = $("<div class=\"node-profile\"/>").css("background-color", "" + node.color).appendTo($container);
            return _this.renderProfile(node, $nodeDiv, blacklist, 4);
          });
        }
      };

      SelectedDetails2.prototype.editNode = function(node, nodeDiv, blacklist) {
        var $loaderHolder, $loaderToggle, $nodeCancel, $nodeDelete, $nodeMoreFields, $nodeSave, colorEditingField, header, nodeInputNumber, origColor, shouldLoad,
          _this = this;
        console.log("Editing node: " + node['_id']);
        nodeInputNumber = 0;
        origColor = "#A9A9A9";
        header = this.findHeader(node);
        nodeDiv.html("<div class=\"node-profile-title\">Editing " + header + " (id: " + node['_id'] + ")</div><form id=\"Node" + node['_id'] + "EditForm\"></form>");
        _.each(node, function(value, property) {
          var newEditingFields, _ref;
          if (blacklist.indexOf(property) < 0 && ["_id", "text", "color", "_Last_Edit_Date", "_Creation_Date"].indexOf(property) < 0) {
            newEditingFields = "<div id=\"Node" + node['_id'] + "EditDiv" + nodeInputNumber + "\" class=\"Node" + node['_id'] + "EditDiv\">\n  <input style=\"width:80px\" id=\"Node" + node['_id'] + "EditProperty" + nodeInputNumber + "\" value=\"" + property + "\" class=\"propertyNode" + node['_id'] + "Edit\"/> \n  <input style=\"width:80px\" id=\"Node" + node['_id'] + "EditValue" + nodeInputNumber + "\" value=\"" + value + "\" class=\"valueNode" + node['_id'] + "Edit\"/> \n  <input type=\"button\" id=\"removeNode" + node['_id'] + "Edit" + nodeInputNumber + "\" value=\"x\" onclick=\"this.parentNode.parentNode.removeChild(this.parentNode);\">\n</div>";
            $(newEditingFields).appendTo("#Node" + node['_id'] + "EditForm");
            return nodeInputNumber = nodeInputNumber + 1;
          } else if (property === "color") {
            if (_ref = value.toUpperCase(), __indexOf.call(colors, _ref) >= 0) {
              return origColor = value;
            }
          }
        });
        colorEditingField = '\
            <form action="#" method="post">\
                <div class="controlset">Color<input id="color' + node['_id'] + '" name="color' + node['_id'] + '" type="text" value="' + origColor + '"/></div>\
            </form>\
          ';
        $(colorEditingField).appendTo(nodeDiv);
        $("#color" + node['_id']).colorPicker({
          showHexField: false
        });
        if (node.shouldLoad != null) {
          shouldLoad = node.shouldLoad;
        } else {
          shouldLoad = false;
        }
        $loaderHolder = $('<span> Load by default <br> </span>').css("font-size", "12px").appendTo(nodeDiv);
        $loaderToggle = $('<input type="checkbox" id=\"shouldLoad' + node._id + '\">').attr("checked", shouldLoad).prependTo($loaderHolder);
        $nodeMoreFields = $("<input id=\"moreNode" + node['_id'] + "EditFields\" type=\"button\" value=\"+\">").appendTo(nodeDiv);
        $nodeMoreFields.click(function() {
          _this.addField(nodeInputNumber, "Node" + node['_id'] + "Edit");
          return nodeInputNumber = nodeInputNumber + 1;
        });
        $nodeSave = $("<input name=\"nodeSaveButton\" type=\"button\" value=\"Save\">").appendTo(nodeDiv);
        $nodeSave.click(function() {
          var newNodeObj;
          newNodeObj = _this.assign_properties("Node" + node['_id'] + "Edit");
          if (newNodeObj[0]) {
            return $.post("/get_node_by_id", {
              'nodeid': node['_id']
            }, function(data) {
              var newNode;
              if (data['_Last_Edit_Date'] === node['_Last_Edit_Date'] || confirm("Node " + _this.findHeader(node) + (" (id: " + node['_id'] + ") has changed on server. Are you sure you want to risk overwriting the changes?"))) {
                newNode = newNodeObj[1];
                newNode['color'] = $("#color" + node['_id']).val();
                newNode['_id'] = node['_id'];
                newNode['_Creation_Date'] = node['_Creation_Date'];
                newNode["shouldLoad"] = $("#shouldLoad" + node._id).prop('checked');
                return _this.dataController.nodeEdit(node, newNode, function(savedNode) {
                  _this.graphModel.filterNodes(function(node) {
                    return !(savedNode['_id'] === node['_id']);
                  });
                  _this.graphModel.putNode(savedNode);
                  _this.selection.toggleSelection(savedNode);
                  return _this.cancelEditing(savedNode, nodeDiv, blacklist);
                });
              } else {
                return alert("Did not save node " + _this.findHeader(node) + (" (id: " + node['_id'] + ")."));
              }
            });
          }
        });
        $nodeDelete = $("<input name=\"NodeDeleteButton\" type=\"button\" value=\"Delete\">").appendTo(nodeDiv);
        $nodeDelete.click(function() {
          if (confirm("Are you sure you want to delete this node?")) {
            return _this.deleteNode(node, function() {
              return _this.selection.toggleSelection(node);
            });
          }
        });
        $nodeCancel = $("<input name=\"NodeCancelButton\" type=\"button\" value=\"Cancel\">").appendTo(nodeDiv);
        return $nodeCancel.click(function() {
          return _this.cancelEditing(node, nodeDiv, blacklist);
        });
      };

      SelectedDetails2.prototype.editLink = function(link, linkDiv, blacklist) {
        var $linkCancel, $linkDelete, $linkMoreFields, $linkSave, colorEditingField, linkInputNumber, origColor,
          _this = this;
        console.log("Editing link: " + link['_id']);
        origColor = "#A9A9A9";
        linkInputNumber = 0;
        linkDiv.html("<div class=\"node-profile-title\">Editing " + (this.findHeader(link)) + "</div><form id=\"Link" + link['_id'] + "EditForm\"></form>");
        _.each(link, function(value, property) {
          var newEditingFields;
          if (blacklist.indexOf(property) < 0 && ["_id", "_Last_Edit_Date", "_Creation_Date", "start", "end", "color"].indexOf(property) < 0) {
            newEditingFields = "<div id=\"Link" + link['_id'] + "EditDiv" + linkInputNumber + "\" class=\"Link" + link['_id'] + "EditDiv\">\n  <input style=\"width:80px\" id=\"Link" + link['_id'] + "EditProperty" + linkInputNumber + "\" value=\"" + property + "\" class=\"propertyLink" + link['_id'] + "Edit\"/> \n  <input style=\"width:80px\" id=\"Link" + link['_id'] + "EditValue" + linkInputNumber + "\" value=\"" + value + "\" class=\"valueLink" + link['_id'] + "Edit\"/> \n  <input type=\"button\" id=\"removeLink" + link['_id'] + "Edit" + linkInputNumber + "\" value=\"x\" onclick=\"this.parentNode.parentNode.removeChild(this.parentNode);\">\n</div>";
            $(newEditingFields).appendTo("#Link" + link['_id'] + "EditForm");
            return linkInputNumber = linkInputNumber + 1;
          } else if (property === "color") {
            return origColor = value;
          }
        });
        colorEditingField = '\
            <form action="#" method="post">\
                <div class="controlset">Color<input id="color' + link['_id'] + '" name="color' + link['_id'] + '" type="text" value="' + origColor + '"/></div>\
            </form>\
          ';
        $(colorEditingField).appendTo(linkDiv);
        $("#color" + link['_id']).colorPicker({
          showHexField: false
        });
        $linkMoreFields = $("<input id=\"moreLink" + link['_id'] + "EditFields\" type=\"button\" value=\"+\">").appendTo(linkDiv);
        $linkMoreFields.click(function() {
          _this.nodeEdit.addField(linkInputNumber, "Link" + link['_id'] + "Edit");
          return linkInputNumber = linkInputNumber + 1;
        });
        $linkSave = $("<input name=\"LinkSaveButton\" type=\"button\" value=\"Save\">").appendTo(linkDiv);
        $linkSave.click(function() {
          var newLinkObj;
          newLinkObj = _this.nodeEdit.assign_properties("Link" + link['_id'] + "Edit");
          if (newLinkObj[0]) {
            return $.post("/get_link_by_id", {
              'id': link['_id']
            }, function(data) {
              var newLink;
              if (data['properties']['_Last_Edit_Date'] === link['_Last_Edit_Date'] || confirm("Link " + _this.findHeader(link) + (" (id: " + link['_id'] + ") has changed on server. Are you sure you want to risk overwriting the changes?"))) {
                newLink = newLinkObj[1];
                newLink['_id'] = link['_id'];
                newLink['color'] = $("#color" + link['_id']).val();
                newLink['_Creation_Date'] = link['_Creation_Date'];
                return _this.dataController.linkEdit(link, newLink, function(savedLink) {
                  savedLink['_id'] = link['_id'];
                  savedLink['_type'] = link['_type'];
                  savedLink['start'] = link['start'];
                  savedLink['end'] = link['end'];
                  savedLink['source'] = link['source'];
                  savedLink['target'] = link['target'];
                  savedLink['strength'] = link['strength'];
                  savedLink['_Creation_Date'] = link['_Creation_Date'];
                  _this.graphModel.filterLinks(function(link) {
                    return !(savedLink['_id'] === link['_id']);
                  });
                  _this.graphModel.putLink(savedLink);
                  _this.selection.toggleSelection(savedLink);
                  return _this.cancelEditing(link, linkDiv, blacklist);
                });
              } else {
                return alert("Did not save link " + _this.findHeader(link) + (" (id: " + link['_id'] + ")."));
              }
            });
          }
        });
        $linkDelete = $("<input name=\"LinkDeleteButton\" type=\"button\" value=\"Delete\">").appendTo(linkDiv);
        $linkDelete.click(function() {
          if (confirm("Are you sure you want to delete this link?")) {
            return _this.deleteLink(link, function() {
              return _this.selection.toggleSelection(link);
            });
          }
        });
        $linkCancel = $("<input name=\"LinkCancelButton\" type=\"button\" value=\"Cancel\">").appendTo(linkDiv);
        return $linkCancel.click(function() {
          return _this.cancelEditing(link, linkDiv, blacklist);
        });
      };

      SelectedDetails2.prototype.cancelEditing = function(node, nodeDiv, blacklist) {
        nodeDiv.empty();
        return this.renderProfile(node, nodeDiv, blacklist);
      };

      SelectedDetails2.prototype.deleteNode = function(delNode, callback) {
        var _this = this;
        return this.dataController.nodeDelete(delNode, function(response) {
          if (response === "error") {
            if (confirm("Could not delete node. There might be links remaining on this node. Do you want to delete the node (and all links to it) anyway?")) {
              return _this.dataController.nodeDeleteFull(delNode, function(responseFull) {
                console.log("Node Deleted");
                _this.graphModel.filterNodes(function(node) {
                  return !(delNode['_id'] === node['_id']);
                });
                return callback();
              });
            }
          } else {
            console.log("Node Deleted");
            _this.graphModel.filterNodes(function(node) {
              return !(delNode['_id'] === node['_id']);
            });
            return callback();
          }
        });
      };

      SelectedDetails2.prototype.addField = function(inputIndex, name, defaultKey, defaultValue) {
        var $row;
        if (!(defaultKey != null)) {
          defaultKey = "propertyEx";
        }
        if (!(defaultValue != null)) {
          defaultValue = "valueEx";
        }
        $row = $("<div id=\"" + name + "Div" + inputIndex + "\" class=\"" + name + "Div\">\n<input style=\"width:80px\" name=\"property" + name + inputIndex + "\" placeholder=\"" + defaultKey + "\" class=\"property" + name + "\">\n<input style=\"width:80px\" name=\"value" + name + inputIndex + "\" placeholder=\"" + defaultValue + "\" class=\"value" + name + "\">\n<input type=\"button\" id=\"remove" + name + inputIndex + "\" value=\"x\" onclick=\"this.parentNode.parentNode.removeChild(this.parentNode);\">\n</div>");
        return $("#" + name + "Form").append($row);
      };

      SelectedDetails2.prototype.assign_properties = function(form_name, is_illegal, node) {
        var editDate, propertyObject, submitOK;
        if (is_illegal == null) {
          is_illegal = this.dataController.is_illegal;
        }
        submitOK = true;
        propertyObject = {};
        editDate = new Date();
        propertyObject["_Last_Edit_Date"] = editDate;
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

      SelectedDetails2.prototype.findHeader = function(node) {
        var realurl, result;
        if (node.name != null) {
          if (node.url != null) {
            realurl = "";
            result = node.url.search(new RegExp(/^http:\/\//i));
            if (!result) {
              realurl = node.url;
            } else {
              realurl = 'http://' + node.url;
            }
            return '<a href=' + realurl + ' target="_blank">' + node.name + '</a>';
          } else {
            return node.name;
          }
        } else if (node.title != null) {
          return node.title;
        } else {
          return '';
        }
      };

      SelectedDetails2.prototype.findLinkHeader = function(link) {
        var headerName, realurl, result;
        if (!(link.name != null) || link.name === "") {
          headerName = "<i>empty link</i>";
        } else {
          headerName = link.name;
        }
        if (link.url != null) {
          realurl = "";
          result = link.url.search(new RegExp(/^http:\/\//i));
          if (!result) {
            realurl = link.url;
          } else {
            realurl = 'http://' + link.url;
          }
          headerName = '<a href=' + realurl + ' target="_blank">' + link.name + '</a>';
        }
        return headerName;
      };

      SelectedDetails2.prototype.renderProfile = function(node, nodeDiv, blacklist, propNumber) {
        var $nodeDeselect, $nodeEdit, $nodeHeader, $showMore, $spokeHolder, counter, header, initialSpokeNumber, nodeLength, p, v, whitelist,
          _this = this;
        nodeDiv.empty();
        header = this.findHeader(node);
        $nodeHeader = $("<div class=\"node-profile-title\">" + header + "</div>").appendTo(nodeDiv);
        $nodeEdit = $("<i class=\"fa fa-pencil-square \"></i>").css("margin", "6px").appendTo($nodeHeader);
        $nodeEdit.click(function() {
          return _this.editNode(node, nodeDiv, blacklist);
        });
        $nodeDeselect = $("<i class=\"right fa fa-times\"></i>").css("margin", "1px").appendTo($nodeHeader);
        $nodeDeselect.click(function() {
          return _this.selection.toggleSelection(node);
        });
        whitelist = ["description", "url"];
        nodeLength = 0;
        for (p in node) {
          v = node[p];
          if (!(__indexOf.call(blacklist, p) >= 0)) {
            nodeLength = nodeLength + 1;
          }
        }
        counter = 0;
        _.each(node, function(value, property) {
          var makeLinks;
          if (counter >= propNumber) {
            return;
          }
          value += "";
          if (blacklist.indexOf(property) < 0) {
            if (value != null) {
              makeLinks = value.replace(/((https?|ftp|dict):[^'">\s]+)/gi, "<a href=\"$1\" target=\"_blank\" style=\"target-new: tab;\">$1</a>");
            } else {
              makeLinks = value;
            }
            if (__indexOf.call(whitelist, property) >= 0) {
              $("<div class=\"node-profile-property\">" + makeLinks + "</div>").appendTo(nodeDiv);
            } else if (property === "_Last_Edit_Date" || property === "_Creation_Date") {
              $("<div class=\"node-profile-property\">" + property + ":  " + (makeLinks.substring(4, 21)) + "</div>").appendTo(nodeDiv);
            } else {
              $("<div class=\"node-profile-property\">" + property + ":  " + makeLinks + "</div>").appendTo(nodeDiv);
            }
            return counter++;
          }
        });
        if (propNumber < nodeLength) {
          $showMore = $("<div class='showMore'><a href='#'>Show More...</a></div>").appendTo(nodeDiv);
          $showMore.click(function() {
            return _this.renderProfile(node, nodeDiv, blacklist, propNumber + 10);
          });
        }
        this.addLinker(node, nodeDiv);
        initialSpokeNumber = 5;
        $spokeHolder = $("<div class='spokeHolder'></div>").appendTo(nodeDiv.parent());
        return this.addSpokes(node, $spokeHolder, initialSpokeNumber);
      };

      SelectedDetails2.prototype.renderLinkProfile = function(link, linkDiv, blacklist, propNumber) {
        var $linkDeselect, $linkEdit, $linkHeader, $showMore, counter, header, linkLength, p, v, whitelist,
          _this = this;
        linkDiv.empty();
        header = this.findLinkHeader(link);
        $linkHeader = $("<div class=\"node-profile-title\">" + header + "</div>").appendTo(linkDiv);
        $linkEdit = $("<i class=\"fa fa-pencil-square \"></i>").css("margin", "6px").appendTo($linkHeader);
        $linkEdit.click(function(e) {
          e.stopPropagation();
          return _this.editNode(node, linkDiv, blacklist);
        });
        $linkDeselect = $("<i class=\"right fa fa-times\"></i>").css("margin", "1px").appendTo($linkHeader);
        $linkDeselect.click(function(e) {
          e.stopPropagation();
          console.log("de");
          return _this.linkSelection.deselectLink(link);
        });
        whitelist = ["description", "url"];
        linkLength = 0;
        for (p in link) {
          v = link[p];
          if (!(__indexOf.call(blacklist, p) >= 0)) {
            linkLength = linkLength + 1;
          }
        }
        counter = 0;
        _.each(link, function(value, property) {
          var makeLinks;
          if (counter >= propNumber) {
            return;
          }
          value += "";
          if (blacklist.indexOf(property) < 0) {
            if (value != null) {
              makeLinks = value.replace(/((https?|ftp|dict):[^'">\s]+)/gi, "<a href=\"$1\" target=\"_blank\" style=\"target-new: tab;\">$1</a>");
            } else {
              makeLinks = value;
            }
            if (__indexOf.call(whitelist, property) >= 0) {
              $("<div class=\"node-profile-property\">" + makeLinks + "</div>").appendTo(linkDiv);
            } else if (property === "_Last_Edit_Date" || property === "_Creation_Date") {
              $("<div class=\"node-profile-property\">" + property + ":  " + (makeLinks.substring(4, 21)) + "</div>").appendTo(linkDiv);
            } else {
              $("<div class=\"node-profile-property\">" + property + ":  " + makeLinks + "</div>").appendTo(linkDiv);
            }
            return counter++;
          }
        });
        if (propNumber < linkLength) {
          $showMore = $("<div class='showMore'><a href='#'>Show More...</a></div>").appendTo(linkDiv);
          return $showMore.click(function() {
            return _this.renderLinkProfile(link, linkDiv, blacklist, propNumber + 10);
          });
        }
      };

      SelectedDetails2.prototype.addLinker = function(node, nodeDiv) {
        var $createLinkButton, $linkHolder, $linkInputDesc, $linkInputName, $linkInputUrl, $linkSide, $linkWrapper, className, holderClassName, linkSideID, linkWrapperDivID, nodeID,
          _this = this;
        this.tempLink = {};
        nodeID = node['_id'];
        linkSideID = "id=" + "'linkside" + nodeID + "'";
        $linkSide = $('<div ' + linkSideID + '><hr style="margin:3px"></div>').appendTo(nodeDiv);
        holderClassName = "'profilelinkHolder" + nodeID + "'";
        className = "class=" + holderClassName;
        $linkHolder = $('<input type="button"' + className + 'value="Add Link"></input><br>').css("width", 100).css("margin-left", 85).appendTo($linkSide);
        linkWrapperDivID = "id=" + "'source-container" + nodeID + "'";
        $linkWrapper = $('<div ' + linkWrapperDivID + ' class="linkWrapperClass">').appendTo($linkSide);
        $linkInputName = $('<textarea placeholder=\"Link Name [optional]\" rows="1" cols="35"></textarea><br>').appendTo($linkWrapper);
        $linkInputUrl = $('<textarea placeholder="Url [optional]" rows="1" cols="35"></textarea><br>').appendTo($linkWrapper);
        $linkInputDesc = $('<textarea placeholder="Description\n #key1 value1 #key2 value2" rows="5" cols="35"></textarea><br>').appendTo($linkWrapper);
        $createLinkButton = $('<input type="submit" value="Create Link"><br>').appendTo($linkWrapper);
        $createLinkButton.click(function() {
          _this.tempLink.source = node;
          _this.buildLink(_this.parseSyntax($linkInputName.val() + " : " + $linkInputDesc.val() + " #url " + $linkInputUrl.val()));
          $linkInputName.val('');
          $linkInputUrl.val('');
          $linkInputDesc.val('');
          $linkWrapper.hide();
          return $('#toplink-instructions').replaceWith('<span id="toplink-instructions" style="color:black; font-size:20px">Click a Node to select the target.</span>');
        });
        $linkWrapper.hide();
        $(document).on("click", function() {
          $linkWrapper.hide();
          return $linkHolder.show();
        });
        $linkWrapper.on("click", function(e) {
          return e.stopPropagation();
        });
        $linkHolder.focus(function() {
          $linkWrapper.show();
          $linkInputName.focus();
          return $linkHolder.hide();
        });
        return this.graphView.on("enter:node:click", function(clickedNode) {
          var link;
          if (_this.buildingLink) {
            _this.tempLink.target = clickedNode;
            link = _this.tempLink;
            _this.dataController.linkAdd(link, function(linkres) {
              var allNodes, n, newLink, _i, _j, _len, _len1;
              newLink = linkres;
              allNodes = _this.graphModel.getNodes();
              for (_i = 0, _len = allNodes.length; _i < _len; _i++) {
                n = allNodes[_i];
                if (n['_id'] === link.source['_id']) {
                  newLink.source = n;
                }
              }
              for (_j = 0, _len1 = allNodes.length; _j < _len1; _j++) {
                n = allNodes[_j];
                if (n['_id'] === link.target['_id']) {
                  newLink.target = n;
                }
              }
              return _this.graphModel.putLink(newLink);
            });
            _this.buildingLink = false;
            $('#toplink-instructions').replaceWith('<span id="toplink-instructions"></span>');
            return $linkHolder.show();
          }
        });
      };

      SelectedDetails2.prototype.addSpokes = function(node, spokeHolder, maxSpokes) {
        var $showMoreSpokes, $spokeDiv, $spokeSource, $spokeTarget, $spokesDiv, displayName, lHash, link, nHash, savedSpoke, spoke, spoke_counter, spokes, spokesID, _i, _len,
          _this = this;
        spokeHolder.empty();
        nHash = this.graphModel.get("nodeHash");
        lHash = this.graphModel.get("linkHash");
        spokesID = "spokesDiv" + (nHash(node));
        $spokesDiv = $('<div id=' + spokesID + '>').appendTo(spokeHolder);
        spokes = (function() {
          var _i, _len, _ref, _results;
          _ref = this.graphModel.getLinks();
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            link = _ref[_i];
            if (nHash(link.source) === nHash(node) || nHash(link.target) === nHash(node)) {
              _results.push(link);
            }
          }
          return _results;
        }).call(this);
        if (spokes.length > 0) {
          spoke_counter = 0;
          for (_i = 0, _len = spokes.length; _i < _len; _i++) {
            spoke = spokes[_i];
            if (spoke_counter >= maxSpokes) {
              break;
            } else {
              spoke_counter++;
            }
            savedSpoke = spoke;
            displayName = this.findLinkHeader(spoke);
            if (!(spoke.color != null)) {
              spoke.color = "#A9A9A9";
            }
            $spokeDiv = $('<div class="spokeDiv">' + displayName + ' </div>').css("border", "2px solid " + spoke.color).appendTo($spokesDiv);
            $spokeSource = $('<span class="nodeNameBox">' + spoke.source.name + '</span>').css("background-color", "" + spoke.source.color).prependTo($spokeDiv);
            $spokeSource.on("click", function(e) {
              var clickedLink;
              e.stopPropagation();
              clickedLink = $(e.target).parent().data("link")[0];
              return _this.selection.selectNode(clickedLink.source);
            });
            $spokeTarget = $('<span class="nodeNameBox">' + spoke.target.name + '</span>').css("background-color", "" + spoke.target.color).appendTo($spokeDiv);
            $spokeTarget.on("click", function(e) {
              var clickedLink;
              e.stopPropagation();
              clickedLink = $(e.target).parent().data("link")[0];
              return _this.selection.selectNode(clickedLink.target);
            });
            $('<i class="fa fa-caret-right fa-2x"></i> ').prependTo($spokeDiv);
            $spokeDiv.data("link", [spoke]);
            $spokeDiv.on("click", function(e) {
              var clickedLink;
              clickedLink = $(e.target).data("link")[0];
              return _this.renderLinkProfile(clickedLink, $(e.target), _this.blacklist, 5);
            });
          }
        }
        if (maxSpokes < spokes.length) {
          $showMoreSpokes = $("<div class=\"showMore\"><a href='#'>Show More...</a></div>").appendTo(spokeHolder);
          return $showMoreSpokes.on("click", function(e) {
            $('<div id=' + spokesID + '>').empty();
            return _this.addSpokes(node, spokeHolder, maxSpokes + 4);
          });
        }
      };

      SelectedDetails2.prototype.buildLink = function(linkProperties) {
        this.tempLink.properties = linkProperties;
        console.log("tempLink set to", this.tempLink);
        return this.buildingLink = true;
      };

      SelectedDetails2.prototype.parseSyntax = function(input) {
        var createDate, dict, match, pattern, strsplit, text;
        console.log("input", input);
        strsplit = input.split('#');
        strsplit[0] = strsplit[0].replace(/:/, " #description ");
        /* The : is shorthand for #description*/

        text = strsplit.join('#');
        pattern = new RegExp(/#([a-zA-Z0-9]+) ([^#]+)/g);
        dict = {};
        match = {};
        while (match = pattern.exec(text)) {
          dict[match[1].trim()] = match[2].trim();
        }
        /*The first entry becomes the name*/

        dict["name"] = text.split('#')[0].trim();
        console.log("This is the title", text.split('#')[0].trim());
        createDate = new Date();
        dict["_Creation_Date"] = createDate;
        return dict;
      };

      return SelectedDetails2;

    })(Backbone.View);
  });

}).call(this);