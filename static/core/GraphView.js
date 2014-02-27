(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  define([], function() {
    var GraphView, LinkFilter;
    LinkFilter = (function(_super) {

      __extends(LinkFilter, _super);

      function LinkFilter() {
        LinkFilter.__super__.constructor.apply(this, arguments);
      }

      LinkFilter.prototype.initialize = function() {
        return this.set("threshold", 0);
      };

      LinkFilter.prototype.filter = function(links) {
        var _this = this;
        return _.filter(links, function(link) {
          return link.strength > _this.get("threshold");
        });
      };

      LinkFilter.prototype.connectivity = function(value) {
        if (value) {
          return this.set("threshold", value);
        } else {
          return this.get("threshold");
        }
      };

      return LinkFilter;

    })(Backbone.Model);
    return GraphView = (function(_super) {

      __extends(GraphView, _super);

      function GraphView() {
        this.update = __bind(this.update, this);
        GraphView.__super__.constructor.apply(this, arguments);
      }

      GraphView.prototype.init = function(instances) {
        this.model = instances["GraphModel"];
        this.model.on("change", this.update);
        this.render();
        return $(this.el).appendTo($('#maingraph'));
      };

      GraphView.prototype.initialize = function(options) {
        this.linkFilter = new LinkFilter(this);
        return this.listenTo(this.linkFilter, "change:threshold", this.update);
      };

      GraphView.prototype.render = function() {
        var currentZoom, defs, gradient, initialWindowHeight, initialWindowWidth, linkContainer, nodeContainer, svg, translateLock, workspace, zoom, zoomCapture,
          _this = this;
        initialWindowWidth = $(window).width();
        initialWindowHeight = $(window).height();
        this.initialWindowWidth = initialWindowWidth;
        this.initialWindowHeight = initialWindowHeight;
        this.force = d3.layout.force().size([initialWindowWidth, initialWindowHeight]).charge(-2000).gravity(0.2);
        this.linkStrength = function(link) {
          return (link.strength - _this.linkFilter.get("threshold")) / (1.0 - _this.linkFilter.get("threshold"));
        };
        this.force.linkStrength(this.linkStrength);
        svg = d3.select(this.el).append("svg:svg").attr("pointer-events", "all").attr("height", "100%").attr("width", "100%");
        zoom = d3.behavior.zoom();
        this.zoom = zoom;
        defs = svg.append("defs");
        defs.append("marker").attr("id", "Triangle").attr("viewBox", "0 0 20 15").attr("refX", "20").attr("refY", "5").attr("markerUnits", "userSpaceOnUse").attr("markerWidth", "20").attr("markerHeight", "15").attr("orient", "auto").append("path").attr("d", "M 0 0 L 10 5 L 0 10 z");
        defs.append("marker").attr("id", "Triangle2").attr("viewBox", "0 0 20 15").attr("refX", "-5").attr("refY", "5").attr("markerUnits", "userSpaceOnUse").attr("markerWidth", "20").attr("markerHeight", "15").attr("orient", "auto").append("path").attr("d", "M 10 0 L 0 5 L 10 10 z");
        gradient = defs.append("radialGradient");
        gradient.attr("id", "gradFill").attr("cx", "50%").attr("cy", "50%").attr("r", "75%").attr("fx", "50%").attr("fy", "50%").append("stop").attr("offset", "0%").attr("style", "stop-color:steelblue;stop-opacity:1");
        gradient.append("stop").attr("offset", "100%").attr("style", "stop-color:rgb(255,255,255);stop-opacity:1");
        zoomCapture = svg.append("g");
        zoomCapture.attr("height", "100%");
        zoomCapture.append("svg:rect").attr("width", "100%").attr("height", "100%").style("fill-opacity", "0%").attr("fill", "white");
        translateLock = false;
        currentZoom = void 0;
        this.force.drag().on("dragstart", function() {
          translateLock = true;
          return currentZoom = zoom.translate();
        }).on("dragend", function() {
          zoom.translate(currentZoom);
          return translateLock = false;
        });
        this.currentTranslation = [0, 0];
        this.currentScale = 1;
        zoomCapture.call(zoom.on("zoom", function() {
          if (translateLock) return;
          _this.currentTranslation = d3.event.translate;
          _this.currentScale = d3.event.scale;
          return workspace.attr("transform", "translate(" + d3.event.translate + ") scale(" + d3.event.scale + ")");
        })).on("dblclick.zoom", null);
        workspace = zoomCapture.append("svg:g");
        this.workspace = workspace;
        linkContainer = workspace.append("svg:g").classed("linkContainer", true);
        nodeContainer = workspace.append("svg:g").classed("nodeContainer", true);
        $(this.el).bind("contextmenu", function(e) {
          return false;
        });
        $(this.el).mousedown(function(e) {
          if (e.which === 3) return _this.trigger("view:rightclick");
        });
        $(this.el).on("dblclick", function(e) {});
        this.addCentering();
        return this;
      };

      GraphView.prototype.update = function() {
        var clickSemaphore, filteredLinks, getColor, getLinkColor, getSize, link, linkEnter, links, node, nodeEnter, nodes,
          _this = this;
        getLinkColor = function(link) {
          if (link.color != null) {
            return link.color;
          } else {
            return "grey";
          }
        };
        nodes = this.model.get("nodes");
        links = this.model.get("links");
        filteredLinks = this.linkFilter ? this.linkFilter.filter(links) : links;
        this.force.nodes(nodes).links(filteredLinks).start();
        link = this.linkSelection = d3.select(this.el).select(".linkContainer").selectAll(".link").data(filteredLinks, this.model.get("linkHash"));
        linkEnter = link.enter().append("line").attr("class", "link").attr("stroke", function(d) {
          return getLinkColor(d);
        }).attr('marker-end', function(link) {
          return 'url(#Triangle)';
        }).attr('marker-start', function(link) {
          if (link.direction === 'backward' || link.direction === 'bidirectional') {
            return 'url(#Triangle2)';
          }
        });
        linkEnter.on("click", function(datum, index) {
          var shifted;
          d3.event.stopPropagation();
          if (d3.event.shiftKey) {
            shifted = true;
          } else {
            shifted = false;
          }
          if (shifted) {
            return _this.trigger("enter:link:shift:click", datum);
          } else {
            return _this.trigger("enter:link:click", datum);
          }
        }).on("dblclick", function(datum, index) {
          return _this.trigger("enter:link:dblclick", datum);
        }).on("mouseover", function(datum, index) {
          return _this.trigger("enter:link:mouseover", datum);
        }).on("mouseout", function(datum, index) {
          return _this.trigger("enter:link:mouseout", datum);
        });
        getSize = function(node) {
          if (node.size > 0) {
            return Math.min(node.size, 100);
          } else {
            return 8;
          }
        };
        link.exit().remove();
        link.attr("stroke-width", function(link) {
          return 10 * (_this.linkStrength(link));
        });
        node = this.nodeSelection = d3.select(this.el).select(".nodeContainer").selectAll(".node").data(nodes, this.model.get("nodeHash"));
        nodeEnter = node.enter().append("g").attr("class", "node").call(this.force.drag);
        nodeEnter.append("text").attr("dx", function(d) {
          return 4 + getSize(d);
        }).attr("dy", ".35em").text(function(d) {
          return _this.findText(d);
        });
        getColor = function(node) {
          if (node.color != null) {
            return node.color;
          } else {
            return "darkgrey";
          }
        };
        nodeEnter.append("circle").attr("r", function(d) {
          return getSize(d);
        }).attr("cx", 0).attr("cy", 0).attr("stroke", function(d) {
          return getColor(d);
        }).attr("fill", "white").attr("stroke-width", 3);
        clickSemaphore = 0;
        nodeEnter.on("click", function(datum, index) {
          var ctrl, savedClickSemaphore, shifted;
          if (d3.event.defaultPrevented) return;
          d3.event.stopPropagation();
          if (d3.event.shiftKey) {
            shifted = true;
          } else {
            shifted = false;
          }
          if (d3.event.ctrlKey) {
            ctrl = true;
          } else {
            ctrl = false;
          }
          datum.fixed = true;
          clickSemaphore += 1;
          savedClickSemaphore = clickSemaphore;
          return setTimeout((function() {
            if (clickSemaphore === savedClickSemaphore) {
              if (shifted) {
                _this.trigger("enter:node:shift:click", datum);
              } else if (ctrl) {
                _this.trigger("enter:node:ctrl:click", datum);
              } else {
                _this.trigger("enter:node:click", datum);
              }
              return datum.fixed = false;
            } else {
              clickSemaphore += 1;
              return datum.fixed = false;
            }
          }), 250);
        }).on("dblclick", function(datum, index) {
          return _this.trigger("enter:node:dblclick", datum);
        }).on("mouseover", function(datum, index) {
          return _this.trigger("enter:node:mouseover", datum);
        }).on("mouseout", function(datum, index) {
          return _this.trigger("enter:node:mouseout", datum);
        }).on("contextmenu", function(datum, index) {
          return _this.trigger("enter:node:rightclick", datum);
        });
        this.trigger("enter:node", nodeEnter);
        this.trigger("enter:link", linkEnter);
        node.exit().remove();
        this.force.start();
        this.force.on("tick", function() {
          link.attr("x1", function(d) {
            return d.source.x;
          }).attr("y1", function(d) {
            return d.source.y;
          }).attr("x2", function(d) {
            return d.target.x;
          }).attr("y2", function(d) {
            return d.target.y;
          });
          return node.attr("transform", function(d) {
            return "translate(" + d.x + "," + d.y + ")";
          });
        });
        return this.nodeEnter = nodeEnter;
      };

      GraphView.prototype.addCentering = function() {
        var translateParams,
          _this = this;
        translateParams = [0, 0];
        this.on("enter:node:dblclick", function(node) {
          translateParams = [$(window).width() / 2 - node.x * _this.currentScale, $(window).height() / 2 - node.y * _this.currentScale];
          _this.zoom.translate([translateParams[0], translateParams[1]]);
          return _this.workspace.transition().ease("linear").attr("transform", "translate(" + translateParams + ") scale(" + _this.currentScale + ")");
        });
        return this.on("enter:link:dblclick", function(link) {
          var linkCenterX, linkCenterY;
          console.log("cnenencsnjdnj");
          linkCenterX = (link.target.x - link.source.x) / 2 + link.source.x;
          linkCenterY = (link.target.y - link.source.y) / 2 + link.source.y;
          translateParams = [$(window).width() / 2 - linkCenterX * _this.currentScale, $(window).height() / 2 - linkCenterY * _this.currentScale];
          _this.zoom.translate([translateParams[0], translateParams[1]]);
          return _this.workspace.transition().ease("linear").attr("transform", "translate(" + translateParams + ") scale(" + _this.currentScale + ")");
        });
      };

      GraphView.prototype.drawXHairs = function(x, y, obj) {
        obj.append("line").attr("x1", x).attr("x2", x).attr("y1", y - 10).attr("y2", y + 10).attr("stroke-width", 2).attr("stroke", "red");
        return obj.append("line").attr("x1", x + 10).attr("x2", x - 10).attr("y1", y).attr("y2", y).attr("stroke-width", 2).attr("stroke", "red");
      };

      GraphView.prototype.getNodeSelection = function() {
        return this.nodeSelection;
      };

      GraphView.prototype.getLinkSelection = function() {
        return this.linkSelection;
      };

      GraphView.prototype.getForceLayout = function() {
        return this.force;
      };

      GraphView.prototype.getLinkFilter = function() {
        return this.linkFilter;
      };

      GraphView.prototype.findText = function(node) {
        if (node.name != null) {
          if (node.name.length > 20) {
            return node.name.substring(0, 18) + "...";
          } else {
            return node.name;
          }
        } else if (node.title != null) {
          if (node.title.length > 20) {
            return node.title.substring(0, 18) + "...";
          } else {
            return node.title;
          }
        } else {
          return '';
        }
      };

      return GraphView;

    })(Backbone.View);
  });

}).call(this);
