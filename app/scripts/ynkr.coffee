window.ynkr =
  Models: {}
  Collections: {}
  Views: {}
  Routers: {}
  init: ->
    'use strict'
    (new ynkr.Views.HomeView).render()

$ ->
  'use strict'
  ynkr.init()
