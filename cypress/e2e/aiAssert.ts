const hasAnthropic = !!Cypress.env('ANTHROPIC_API_KEY')
const hasOpenAI = !!Cypress.env('OPENAI_API_KEY')

// helper to conditionally run tests based on which API keys are available in Cypress.env
const itIf = (cond: boolean) => (cond ? it : it.skip)

describe('aiAssert (live)', () => {
  itIf(hasAnthropic)('Anthropic live call', () => {
    cy.document().then((doc) => {
      doc.body.innerHTML = `<div id="some-element">Photosynthesis is how plants make food from light.</div>`
    })

    cy.get('#some-element').aiAssert(
      'The text should be a correct, plain-English sentence a 7th grader can understand.',
      { provider: 'anthropic' }
    )
  })

  itIf(hasOpenAI)('OpenAI live call', () => {
    cy.document().then((doc) => {
      doc.body.innerHTML = `<div id="some-element">Photosynthesis is how plants make food from light.</div>`
    })

    cy.get('#some-element').aiAssert(
      'The text should be a correct, plain-English sentence a 7th grader can understand.',
      { provider: 'openai' }
    )
  })
})
