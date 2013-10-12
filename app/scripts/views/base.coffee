'use strict';

class ynkr.Views.BaseView extends Backbone.View
  # The name of the template this view should use to render itself
  template: ''

  els: {}

  render: =>
    @$el.empty()

    data = @renderData @model.toJSON()
    html = ynkr.Views.BaseView.render(@template, data)
    @domInsert html

    @updateEls()
    @onRender()

  @render: (name, data) ->
    tmpl = Handlebars.templates[name];
    if _.isFunction tmpl
      tmpl(data);
    else
      console.warn "No template by the name: #{name}"
      ''

  renderData: (json) ->
    json

  domInsert: (html) ->
    @$el.empty().append(html)

  updateEls: ->
    _.each @els, (name, selector) =>
      @[name] = @$el.find(selector)

  onRender: ->

