export {};
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
    provider?: keyof typeof aiProviders;
};
declare const aiProviders: {
    anthropic: {
        url: string;
        headers: {
            'anthropic-version': string;
            'content-type': string;
            'x-api-key': any;
        };
        buildBody: (instruction: string, content: string, debug: boolean) => {
            model: string;
            max_tokens: number;
            system: string;
            messages: {
                role: string;
                content: string;
            }[];
        };
        parseAnswer: (res: any) => any;
    };
    openai: {
        url: string;
        headers: {
            'content-type': string;
            Authorization: string;
        };
        buildBody: (instruction: string, content: string, debug: boolean) => {
            model: string;
            max_tokens: number;
            messages: {
                role: string;
                content: string;
            }[];
        };
        parseAnswer: (res: any) => any;
    };
};
//# sourceMappingURL=index.d.ts.map