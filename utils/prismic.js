export const getUrl = urlField => {
  return urlField && urlField.link_type === 'Web' ? urlField.url : null
}