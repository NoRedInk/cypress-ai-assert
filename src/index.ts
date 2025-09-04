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
       * cy.get('#definition-container').aiAssert('Check if the text is in Spanish')
       * cy.get('#sponsored-content').aiAssert('Should contain sponsored ads with links to external sites', { debug: true })
       * cy.get('body').aiAssert('The page should show a comparison of the free, Premium, and Enterprise versions', { provider: 'openai' })
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
    .request(instruction, content, options)
    .then((res: string) => {
      if (options.debug) { 
        cy.log('DEBUG OUTPUT:\n' + res) 
      } 
      return cy.wrap(res, { log: false })
      .then((answer) => {
      const errorMessage = 'Expected ' + instruction
      if (options.debug) {
        const finalLine = answer.split('\n').pop()!.trim()
        expect(finalLine).to.match(/^FINAL ANSWER: YES$/, errorMessage)
      } else {
        expect(answer.toUpperCase()).to.eq('YES', errorMessage)
      }
    })
})
}