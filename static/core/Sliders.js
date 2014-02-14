// Generated by CoffeeScript 1.6.3
/*

provides an interface to add sliders to the ui

`addSlider(label, initialValue, onChange)` does the following
  - shows the text `label` next to the slider
  - starts it at `initialValue`
  - calls `onChange` when the value changes
    with the new value as the argument

sliders have range [0, 100]
*/


(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define([], function() {
    var SlidersView;
    return SlidersView = (function(_super) {
      __extends(SlidersView, _super);

      function SlidersView(options) {
        this.options = options;
        SlidersView.__super__.constructor.call(this);
      }

      SlidersView.prototype.init = function(instances) {
        this.render();
        $(this.el).attr("id", "slidersPopOut").attr("class", "toolboxpopout");
        return $(this.el).appendTo($("#maingraph"));
      };

      SlidersView.prototype.render = function() {
        var $container;
        $container = $("<div class=\"sliders-container\">\n  <table border=\"0\">\n  </table>\n</div>");
        $container.appendTo(this.$el);
        return this;
      };

      SlidersView.prototype.addSlider = function(label, initialValue, onChange) {
        var $row;
        $row = $("<tr>\n  <td class=\"slider-label\">" + label + ": </td>\n  <td><input type=\"range\" min=\"0\" max=\"100\"></td>\n</tr>");
        $row.find("input").val(initialValue).on("change", function() {
          var val;
          val = $(this).val();
          onChange(val);
          return $(this).blur();
        });
        return this.$("table").append($row);
      };

      return SlidersView;

    })(Backbone.View);
  });

}).call(this);
