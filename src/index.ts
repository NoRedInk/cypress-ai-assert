export {}

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
  provider?: keyof typeof aiProviders
}

const aiProviders = {
  anthropic: {
    url: 'https://api.anthropic.com/v1/messages',
    headers: {
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
      'x-api-key': Cypress.env('ANTHROPIC_API_KEY')
    },
    buildBody: (instruction: string, content: string, debug: boolean) => ({
      model: 'claude-3-5-sonnet-20240620',
      max_tokens: debug ? 500 : 50,
      system: debug ? systemPrompts.debug : systemPrompts.standard,
      messages: [
        { role: 'user', content: `${instruction}\n\nContent:\n${content}` }
      ]
    }),
    parseAnswer: (res: any) => res.body.content[0].text.trim()
  },
  openai: {
    url: 'https://api.openai.com/v1/chat/completions',
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${Cypress.env('OPENAI_API_KEY')}`
    },
    buildBody: (instruction: string, content: string, debug: boolean) => ({
      model: 'gpt-4o-mini',
      max_tokens: debug ? 500 : 50,
      messages: [
        {
          role: 'system',
          content: debug ? systemPrompts.debug : systemPrompts.standard
        },
        { role: 'user', content: `${instruction}\n\nContent:\n${content}` }
      ]
    }),
    parseAnswer: (res: any) => res.body.choices[0].message.content.trim()
  }
}

const systemPrompts = {
  standard:
    'You are a strict test validator. You must answer with exactly one word: YES or NO. If you output anything else, you fail.',
  debug:
    'You are a test validator. First, think step-by-step and explain your reasoning in detail. Then, on the last line, write: FINAL ANSWER: YES or FINAL ANSWER: NO. Do not omit the FINAL ANSWER line.'
}

function aiAssert(
  subject: JQuery<HTMLElement>,
  instruction: string,
  options: AiAssertOptions = {}
): void {
  const { debug = false, provider: providerName = 'anthropic' } = options
  const provider = aiProviders[providerName]

  const content = subject.text().trim()

  cy.request({
    method: 'POST',
    url: provider.url,
    headers: provider.headers,
    body: provider.buildBody(instruction, content, debug)
  })
    .then((res) => {
      const answer: string = provider.parseAnswer(res).toUpperCase()
      if (debug) {
        cy.log('DEBUG OUTPUT:\n' + answer)
      }
      return cy.wrap(answer, { log: false })
    })
    .then((answer) => {
      const errorMessage = 'Expected ' + instruction
      if (debug) {
        const finalLine = answer.split('\n').pop()!.trim()
        expect(finalLine).to.match(/^FINAL ANSWER: YES$/, errorMessage)
      } else {
        expect(answer).to.eq('YES', errorMessage)
      }
    })
}
