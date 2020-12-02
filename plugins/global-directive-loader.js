import Vue from 'vue'
import VDragged from 'v-dragged'
import intersectionObserver from '~/directives/IntersectionObserver'

let hasLoadedDirectives = false

if (!hasLoadedDirectives) {
  Vue.use(VDragged)  
  Vue.directive('intersection-observer', intersectionObserver)

  hasLoadedDirectives = true
}