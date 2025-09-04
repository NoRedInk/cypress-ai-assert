export {}

import { getProvider } from './providers.js'
import './builtinProviders.js'

Cypress.Commands.add('aiAssert', { prevSubject: true }, aiAssert)

declare global {
  namespace Cypress {
    interface Chainable<Subject = any> {
      /**
       * Uses an LLM's API to validate content based on a given instruction.
       * @example
       * cy.get('#word-lookup-container').aiAssert('Check if the text is in Spanish')
       * cy.get('#word-lookup-container').aiAssert('Check if the text is in Spanish', { debug: true })
       * cy.get('#word-lookup-container').aiAssert('Check if the text is in Spanish', { provider: 'openai' })
       */
      aiAssert(
        instruction: string,
        options?: AiAssertOptions
      ): Chainable<Subject>
    }
  }
}

type AiAssertOptions = {
  debug?: boolean
  provider?: string
}

function aiAssert(
  subject: JQuery<HTMLElement>,
  instruction: string,
  options: AiAssertOptions = {}
): void {
  const { debug = false, provider: providerName = 'anthropic' } = options
  const provider = getProvider(providerName)

  const content = subject.text().trim()

  provider
    .request(instruction, content, { debug })
    .then((res: string) => {
      if (debug) { 
        cy.log('DEBUG OUTPUT:\n' + res) 
      } 
      return cy.wrap(res, { log: false })
      .then((answer) => {
      const errorMessage = 'Expected ' + instruction
      if (debug) {
        const finalLine = answer.split('\n').pop()!.trim()
        expect(finalLine).to.match(/^FINAL ANSWER: YES$/, errorMessage)
      } else {
        expect(answer.toUpperCase()).to.eq('YES', errorMessage)
      }
    })
})
}