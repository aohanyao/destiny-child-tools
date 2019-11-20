const get = (mod, field) =>
  typeof mod.get == 'function' 
    ? mod.get(field) 
    : mod[field]

export default mod =>
  get(mod, 'child') + '_' +
  get(mod, 'variant') + '-' +
  get(mod, 'modder').toLowerCase().replace(/\s/g, '_') + '-' +
  get(mod, 'name').toLowerCase().replace(/\s/g, '_')