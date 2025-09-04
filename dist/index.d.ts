export {};
import './builtinProviders.js';
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
            aiAssert(instruction: string, options?: AiAssertOptions): Chainable<Subject>;
        }
    }
}
type AiAssertOptions = {
    debug?: boolean;
    provider?: string;
};
//# sourceMappingURL=index.d.ts.map