export default child => 
  ['01', '02', '89', '00'].reduce((acc, vId) => {
    return acc
      ? acc
      : child.get('variants').get(vId)
        ? vId
        : acc
  }, false)