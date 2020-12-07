export default ({ name: routeName }) => {
  let theme

  switch(routeName) {
    case 'projects':
    case 'projects-uid':
      theme = 'dark'
      break
    case 'partners':
      theme = 'red'
      break
    default:
      theme = 'light'
  }

  return theme
}