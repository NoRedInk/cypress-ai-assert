# cypress-ai-assert

Make assertions by calling any LLM's API inside tests.

## Setup

Install using npm:

```bash
npm install --save-dev @NoRedInk/cypress-ai-assert
```

Require from `commands.js`

```javascript
require('@NoRedInk/cypress-ai-assert')
```

Or ES module syntax:

```javascript
import '@NoRedInk/cypress-ai-assert'
```

For TypeScript, add to `tsconfig.json`

```json
{
  "compilerOptions": {
    "types": ["cypress", "@NoRedInk/cypress-ai-assert"]
  }
}
```

## Configuration

Other than the mock provider used in the package's tests, you need an API key for an LLM to use the package. To use one of the two built-in LLM providers, make sure to set `Cypress.env('ANTHROPIC_API_KEY')` or `Cypress.env('OPENAI_API_KEY')` to a valid Anthropic or OpenAI API key.

## Usage

Basic (defaults to Anthropic)
```
cy.get('#definition-container').aiAssert('Check if the text is in Spanish')
```

Get the LLM's full thinking as debug output in the test runner
```
cy.get('#sponsored-content').aiAssert('Should contain sponsored ads with links to external sites', { debug: true })
```

Specify a different provider
```
cy.get('body').aiAssert('The page should show a comparison of the free, Premium, and Enterprise versions', { provider: 'openai' })
```

Specify a custom provider (assumes you have registered a 'gemini' provider not included in this package)
```
cy.get('body').aiAssert('The page should show a comparison of the free, Premium, and Enterprise versions', { provider: 'gemini' })
```

## Registering your own provider

Register your own provider

```
import { registerProvider } from 'cypress-ai-assert'

// Example: Google Gemini
registerProvider({
  name: 'gemini',
  request: async (instruction, content, options) => {
    const response = await fetch('https://gemini.googleapis.com/v1/text', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${options.apiKey}`
      },
      body: JSON.stringify({ instruction, content })
    })

    const json = await response.json()
    return json.output
  }
})
```
And call it in tests
```
cy.get('#some-element').aiAssert('Should contain text', {
  provider: 'gemini',
  apiKey: 'my-api-key' // custom per-provider option
})
```

## The Mock Provider

The mock provider is built-in for testing. It may be useful if you want to temporarily suspend making live LLM calls while working on something, or for testing changes to this package, etc.

```
cy.get('#some-element').aiAssert('Some assertion', {
  provider: 'mock',
  force: 'YES' // or 'NO' to simulate a failure
})
```

It can also accept the `debug` option and return some fake thinking.

## Contributing

Community contributions are welcome. If you're not sure if your idea would be appropriate for this package, feel free to open an issue describing your change before making a PR.