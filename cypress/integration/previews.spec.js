import missingPreviews from '../../missing-previews.json'

describe('cypress/integration/tests.spec.js', () => {
  missingPreviews.forEach(key => {
    it(key, () => {
      const encodedKey = encodeURIComponent(key)
      // ['424242', 'ffffff', '000000'].forEach(color => {
      cy.request(`/live2d/assets/${encodedKey}/MOC.${encodedKey}.json`).then(() => {
        ['424242'].forEach(color => {
          cy.visit(`/live2d/viewer.html?mN=${encodedKey}&size=1000&background=%23${color}`)
          cy.wait(3000)
          cy.get('canvas').screenshot(key + '-' + color, {padding: -20})
        })
      })
    })
  })
})
