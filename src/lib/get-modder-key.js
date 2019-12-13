const aliases = {
  zee: 'itsjustzee'
}

export default (mod) => {
  const key = (mod.modder || mod).toLowerCase()
  return aliases[key] || key
}