'use strict';

class ynkr.Views.HomeView extends ynkr.Views.BaseView
  template: 'home'

  el: '.jumbotron'

  els:
    '.btn': '$button'

  initialize: ->
    @model = new ynkr.Models.HomeModel
      title: 'Ynkr'
      lead: "Ya, we're an organization"

  onRender: ->
    @$button.html 'onRender Text'
