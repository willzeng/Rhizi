# provides details of the selected nodes
define [], () ->

  class NodeTagFilter extends Backbone.View

    constructor: (@options) ->
      @parent = ""
      @parent ?= @options.parent
      super()

    init: (instances) ->
      @graphModel = instances["GraphModel"]
      @dataProvider = instances["local/WikiNetsDataProvider"]
      
      @parent = $("#buildbar")

      @render()

      @$el.appendTo @parent

    render: ->
      $container = $("<div id=\"node-filter-box\" data-intro='Click Themes to see projects' data-position='left'>View by theme</div>")
        .css("position","absolute")
        .css("right","10px")
        .css("width", "160px")
        .css("padding", "7px")
        .css("background-color", "white")
        .css("border", "1px solid gray")
      $container.appendTo @$el

      themesList = ["Research", "Learning", "Student Life", "Other"]

      `for(var k=0;k<themesList.length;k++){
          (function(theme, _this){
            themeButton = $("<div><input type=\"button\" class=\"theme-button\" value=\""+theme+"\"></input></div>").appendTo($container)
            $(themeButton).click(function(){
              console.log(theme);
              _this.searchNodes({'Theme':theme});
              });
            })(themesList[k], this)
        }`

      $clearAllButton = $("<div><input type=\"button\" id=\"clearAllButtonDropdown\" value=\"Clear All\"></input></div>").appendTo $container
      $clearAllButton.click () =>
        @graphModel.filterNodes (node) -> false

    searchNodes: (searchQuery) =>
      $.post "/search_nodes", searchQuery, (nodes) =>
        for node in nodes
          @graphModel.putNode(node)

