/*
 * This function is used to decode HTML entities. Useful for setting head title tags.
 * Will convert ``&amp;#8211;`` into `-` for example.
 */
export const decodeHtmlEntities = (string = "") => {
    return string.replace(/&#(\d+);/g, function(match, dec) {
        return String.fromCharCode(dec)
    })
}