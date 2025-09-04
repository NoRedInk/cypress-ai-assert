export interface AIProvider {
  name: string
  request: (
    instruction: string,
    content: string,
    options?: {
      debug?: boolean
      [key: string]: any // allow provider-specific options
    }
  ) => Cypress.Chainable<string>
}