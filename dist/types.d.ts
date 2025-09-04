export interface AIProvider {
    name: string;
    request: (instruction: string, content: string, options: {
        debug?: boolean;
    }) => Cypress.Chainable<string>;
}
//# sourceMappingURL=types.d.ts.map