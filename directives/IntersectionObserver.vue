<script>
// Helpers
import _pick from "lodash/pick";

// Setup class
class ObserverState {
  // This gets function called automatically
  constructor(el, settings, vnode) {
    this.settings = settings;
    this.observer = new IntersectionObserver(this.onIntersection, this.settings.value);
    this.hasIntersected = false;
  }

  // This is the function that runs when an Intersection occurs.
  // NOTE Intersection happens when it goes out of view too!
  // SEE https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
  // SEE https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserverEntry
  onIntersection(entries, observer) {
    const self = this

    entries.forEach(function(entry, index) {
      // Set up required data
      const el = entry.target;
      const state = el._observerState;

      // If "once" and el already has intersected
      if (state.settings.modifiers.once && self.hasIntersected) return;

      // Check if element has passed intersection threshold
      if (entry.intersectionRatio < state.settings.value.threshold) return;

      // Fire event with IntersectionObserverEntry object
      const event = new CustomEvent("has-intersected", { detail: entry });

      // Generate random time
      let number = 0;
      if (state.settings.modifiers.stagger) {
        number = Math.floor(Math.random() * Math.floor(500));
      }

      // Stagger time by number
      clearTimeout(el.observerTimer);
      el.observerTimer = setTimeout(() => {
        el.dispatchEvent(event);
        self.hasIntersected = entry.isIntersecting
      }, number);
    });
  }
}

// The Vue directive config
export default {
  bind(el, binding) {
    // Default settings
    let settings = {
      value: {
        root: null,
        rootMargin: "0px",
        threshold: 1.0
      },
      modifiers: {
        once: false,
        stagger: false
      }
    };

    // Overwrite settings, only keep relevant settings
    settings = Object.assign(settings, binding);
    settings = _pick(settings, ["value", "modifiers"]);

    // Start ObserverState constructor, save to el for future access
    el._observerState = new ObserverState(el, settings);
  },
  unbind(el) {
    const state = el._observerState;
    if (state) {
      state.observer.disconnect();
      delete el._observerState;
    }
  },
  inserted(el) {
    const state = el._observerState;
    if (state) {
      state.observer.observe(el);
    }
  }
};
</script>