import { defineConfig } from 'cypress'

export default defineConfig({
  viewportWidth: 1920,
  viewportHeight: 1080,
  e2e: {
    baseUrl: 'http://localhost:3000',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.ts'
  },
  video: false
})