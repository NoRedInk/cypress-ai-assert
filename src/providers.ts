import type { AIProvider } from './types.js'

const providerRegistry: Record<string, AIProvider> = {}

export function registerProvider(provider: AIProvider) {
  providerRegistry[provider.name] = provider
}

export function getProvider(name: string): AIProvider {
  const provider = providerRegistry[name]
  if (!provider) {
    throw new Error(`AI provider "${name}" is not registered.`)
  }
  return provider
}