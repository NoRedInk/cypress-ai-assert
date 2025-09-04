import { registerProvider } from './providers.js';
const systemPrompts = {
    standard: 'You are a strict test validator. You must answer with exactly one word: YES or NO. If you output anything else, you fail.',
    debug: 'You are a test validator. First, think step-by-step and explain your reasoning in detail. Then, on the last line, write: FINAL ANSWER: YES or FINAL ANSWER: NO.'
};
const anthropic = {
    name: 'anthropic',
    request: (instruction, content, { debug = false } = {}) => {
        return cy
            .request({
            method: 'POST',
            url: 'https://api.anthropic.com/v1/messages',
            headers: {
                'anthropic-version': '2023-06-01',
                'content-type': 'application/json',
                'x-api-key': Cypress.env('ANTHROPIC_API_KEY')
            },
            body: {
                model: 'claude-3-5-sonnet-20240620',
                max_tokens: debug ? 500 : 50,
                system: debug ? systemPrompts.debug : systemPrompts.standard,
                messages: [
                    { role: 'user', content: `${instruction}\n\nContent:\n${content}` }
                ]
            }
        })
            .then((res) => res.body.content[0].text.trim());
    }
};
const openai = {
    name: 'openai',
    request: (instruction, content, { debug = false } = {}) => {
        return cy
            .request({
            method: 'POST',
            url: 'https://api.openai.com/v1/chat/completions',
            headers: {
                'content-type': 'application/json',
                Authorization: `Bearer ${Cypress.env('OPENAI_API_KEY')}`
            },
            body: {
                model: 'gpt-4o-mini',
                max_tokens: debug ? 500 : 50,
                messages: [
                    {
                        role: 'system',
                        content: debug ? systemPrompts.debug : systemPrompts.standard
                    },
                    { role: 'user', content: `${instruction}\n\nContent:\n${content}` }
                ]
            }
        })
            .then((res) => res.body.choices[0].message.content.trim());
    }
};
const mock = {
    name: 'mock',
    request: (instruction, content, { debug = false, force } = {}) => {
        const answer = force ?? 'YES';
        if (debug) {
            return cy.wrap([
                'This is some example debug output',
                'You should only be seeing it if you passed { debug: true } to the mock provider.',
                `Step 1: I received the following instruction: "${instruction}"`,
                `Step 2: Analyzing content: "${content}"`,
                'Step 3: Reasoning about whether it meets criteria...',
                `FINAL ANSWER: ${answer}`
            ].join('\n'));
        }
        return cy.wrap(answer);
    }
};
registerProvider(anthropic);
registerProvider(openai);
registerProvider(mock);
//# sourceMappingURL=builtinProviders.js.map