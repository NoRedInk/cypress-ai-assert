# Changelog

All notable changes to this project will be documented in this file.

## [1.1.0] - 2026-07-16
### Changed
- Updated built-in Anthropic model to Claude Sonnet 5 (`claude-sonnet-5`)
- Updated built-in OpenAI model to GPT-5.6 Luna (`gpt-5.6-luna`); switched to
  `max_completion_tokens` with `reasoning_effort: 'none'` for the reasoning-model API

## [1.0.1] - 2025-10-29
### Fixed
- Updated built-in Anthropic model to Sonnet-4.5
- Updated built-in OpenAI model to gpt-4.1

## [1.0.0] - 2025-10-09
### Added
- Initial release with `aiAssert` Cypress command
- Built-in providers for Anthropic and OpenAI
- Mock provider for testing