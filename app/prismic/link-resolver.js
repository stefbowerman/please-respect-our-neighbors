export default function(doc) {
  if (doc.type === 'exhibited_project') {
    return `/exhibited/${doc.uid}`
  }

  if (doc.type === 'project') {
    return `/projects/${doc.uid}`
  }
  
  return '/'
}