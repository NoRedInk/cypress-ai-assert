const providerRegistry = {};
export function registerProvider(provider) {
    providerRegistry[provider.name] = provider;
}
export function getProvider(name) {
    const provider = providerRegistry[name];
    if (!provider) {
        throw new Error(`AI provider "${name}" is not registered.`);
    }
    return provider;
}
//# sourceMappingURL=providers.js.map