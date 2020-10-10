export default function(doc) {
  if (doc.type === 'exhibited_project') {
    return `/exhibited-project/${doc.uid}`
  }

  if (doc.type === 'project') {
    return `/project/${doc.uid}`
  }
  
  return '/'
}