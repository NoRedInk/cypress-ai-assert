export {};
import './builtinProviders.js';
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
            aiAssert(instruction: string, options?: AiAssertOptions): Chainable<Subject>;
        }
    }
}
type AiAssertOptions = {
    debug?: boolean;
    provider?: string;
} & Record<string, any>;
//# sourceMappingURL=index.d.ts.map