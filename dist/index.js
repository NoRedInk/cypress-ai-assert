export {};
import { getProvider } from './providers.js';
import './builtinProviders.js';
Cypress.Commands.add('aiAssert', { prevSubject: true }, aiAssert);
function aiAssert(subject, instruction, options = {}) {
    const { debug = false, provider: providerName = 'anthropic' } = options;
    const provider = getProvider(providerName);
    const content = subject.text().trim();
    provider
        .request(instruction, content, { debug })
        .then((res) => {
        if (debug) {
            cy.log('DEBUG OUTPUT:\n' + res);
        }
        return cy.wrap(res, { log: false })
            .then((answer) => {
            const errorMessage = 'Expected ' + instruction;
            if (debug) {
                const finalLine = answer.split('\n').pop().trim();
                expect(finalLine).to.match(/^FINAL ANSWER: YES$/, errorMessage);
            }
            else {
                expect(answer.toUpperCase()).to.eq('YES', errorMessage);
            }
        });
    });
}
//# sourceMappingURL=index.js.map