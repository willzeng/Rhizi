(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  define([], function() {
    var SelectionLayer;
    return SelectionLayer = (function() {

      function SelectionLayer() {
        this._clearRect = __bind(this._clearRect, this);
        this._drawRect = __bind(this._drawRect, this);
        this.rectDim = __bind(this.rectDim, this);
        this.renderRect = __bind(this.renderRect, this);
        this.determineSelection = __bind(this.determineSelection, this);
        this._registerEvents = __bind(this._registerEvents, this);
        this._setStartPoint = __bind(this._setStartPoint, this);
        this._intializeDragVariables = __bind(this._intializeDragVariables, this);
        this._sizeCanvas = __bind(this._sizeCanvas, this);
        this.render = __bind(this.render, this);
      }

      SelectionLayer.prototype.init = function(instances) {
        this.graphView = instances.GraphView;
        this.nodeSelection = instances.NodeSelection;
        this.$parent = this.graphView.$el;
        _.extend(this, Backbone.Events);
        this._intializeDragVariables();
        return this.render();
      };

      SelectionLayer.prototype.render = function() {
        this.canvas = $('<canvas/>').addClass('selectionLayer').css('position', 'absolute').css('top', 0).css('left', 0).css('pointer-events', 'none')[0];
        this._sizeCanvas();
        this.$parent.append(this.canvas);
        return this._registerEvents();
      };

      SelectionLayer.prototype._sizeCanvas = function() {
        var ctx;
        ctx = this.canvas.getContext('2d');
        ctx.canvas.width = $(window).width();
        return ctx.canvas.height = $(window).height();
      };

      SelectionLayer.prototype._intializeDragVariables = function() {
        this.dragging = false;
        this.startPoint = {
          x: 0,
          y: 0
        };
        this.prevPoint = {
          x: 0,
          y: 0
        };
        return this.currentPoint = {
          x: 0,
          y: 0
        };
      };

      SelectionLayer.prototype._setStartPoint = function(coord) {
        this.startPoint.x = coord.x;
        return this.startPoint.y = coord.y;
      };

      SelectionLayer.prototype._registerEvents = function() {
        var _this = this;
        $(window).resize(function(e) {
          return _this._sizeCanvas();
        });
        this.$parent.mousedown(function(e) {
          if (e.shiftKey) {
            _this.dragging = true;
            _.extend(_this.startPoint, {
              x: e.clientX,
              y: e.clientY
            });
            _.extend(_this.currentPoint, {
              x: e.clientX,
              y: e.clientY
            });
            _this.determineSelection();
            return false;
          }
        });
        this.$parent.mousemove(function(e) {
          if (e.shiftKey) {
            if (_this.dragging) {
              _.extend(_this.prevPoint, _this.currentPoint);
              _.extend(_this.currentPoint, {
                x: e.clientX,
                y: e.clientY
              });
              _this.renderRect();
              _this.determineSelection();
              return false;
            }
          }
        });
        this.$parent.mouseup(function(e) {
          _this.dragging = false;
          _this._clearRect(_this.startPoint, _this.currentPoint);
          _.extend(_this.startPoint, {
            x: 0,
            y: 0
          });
          return _.extend(_this.currentPoint, {
            x: 0,
            y: 0
          });
        });
        return $(window).keyup(function(e) {
          if (e.keyCode === 16) {
            _this.dragging = false;
            _this._clearRect(_this.startPoint, _this.prevPoint);
            return _this._clearRect(_this.startPoint, _this.currentPoint);
          }
        });
      };

      SelectionLayer.prototype.determineSelection = function() {
        var rectDim;
        rectDim = this.rectDim(this.startPoint, this.currentPoint);
        return this.nodeSelection.selectBoundedNodes(rectDim);
      };

      SelectionLayer.prototype.renderRect = function() {
        this._clearRect(this.startPoint, this.prevPoint);
        return this._drawRect(this.startPoint, this.currentPoint);
      };

      SelectionLayer.prototype.rectDim = function(startPoint, endPoint) {
        var dim;
        dim = {};
        dim.x = startPoint.x < endPoint.x ? startPoint.x : endPoint.x;
        dim.y = startPoint.y < endPoint.y ? startPoint.y : endPoint.y;
        dim.width = Math.abs(startPoint.x - endPoint.x);
        dim.height = Math.abs(startPoint.y - endPoint.y);
        return dim;
      };

      SelectionLayer.prototype._drawRect = function(startPoint, endPoint) {
        var ctx, dim;
        dim = this.rectDim(startPoint, endPoint);
        ctx = this.canvas.getContext('2d');
        ctx.fillStyle = 'rgba(255, 255, 0, 0.2)';
        return ctx.fillRect(dim.x, dim.y, dim.width, dim.height);
      };

      SelectionLayer.prototype._clearRect = function(startPoint, endPoint) {
        var ctx, dim;
        dim = this.rectDim(startPoint, endPoint);
        ctx = this.canvas.getContext('2d');
        return ctx.clearRect(dim.x, dim.y, dim.width, dim.height);
      };

      return SelectionLayer;

    })();
  });

}).call(this);
