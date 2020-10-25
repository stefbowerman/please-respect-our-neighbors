/*
 * This function is used to decode HTML entities. Useful for setting head title tags.
 * Will convert ``&amp;#8211;`` into `-` for example.
 */
export const decodeHtmlEntities = (string = "") => {
    return string.replace(/&#(\d+);/g, function(match, dec) {
        return String.fromCharCode(dec)
    })
}

/*
 * Takes a string and stipes HTML tags from it
 */
export const stripTags = (str) => {
  return str.replace(/<[^>]*>?/gm, "")
}

export const isTouch = () => {
  if (typeof window === 'undefined') {
    return false 
  }

  if ('ontouchstart' in window) {
    return true
  }

  if (window.DocumentTouch && document instanceof DocumentTouch) {
    return true
  }

  if (window.navigator.userAgent.match(/iphone|ipad|android/i)) {
    return true
  }

  const prefixes = ["", "-webkit-", "-moz-", "-o-", "-ms-"];
  const queries = prefixes.map(prefix => `(${prefix}touch-enabled)`);

  return window.matchMedia(queries.join(",")).matches;
}