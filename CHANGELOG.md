# Changelog

All notable changes to the **Site Verifier** Azure DevOps extension will be documented in this file.

## [0.0.28] - 2026-02-25

### Changed
- Removed deprecated **Node16** execution handler (EOL, causes Azure DevOps warnings)
- Extension now runs exclusively on **Node20** (`Node20_1`)

## [0.0.27] - 2026-02-25

### Security
- Upgraded `axios` from `0.21.4` to `1.13.5` to fix known CVEs
- Removed deprecated `@types/axios` (axios v1 ships its own type definitions)
- Ran `npm audit fix` to resolve 8 additional transitive dependency vulnerabilities

### Fixed
- Updated `contentTypeHandler` test to be compatible with axios v1 type changes

## [0.0.26] - 2026-02-25

### Changed
- Added **Node20** (`Node20_1`) execution handler for modern Azure DevOps agents
- Removed deprecated **Node10** execution handler (EOL since September 2021)
- Kept **Node16** as fallback for older agents
- Upgraded `azure-pipelines-task-lib` from `v3` to `v4` (required for Node20 support)

### Added
- `vss-extension.json` manifest for extension packaging
- `overview.md` for marketplace listing
- `.vsixignore` to optimize extension package size

## [0.0.25] - 2024-02-26

### Changed
- Updated README with marketplace links and documentation
- Updated help markdown URL in task configuration

### Added
- Functional test suite
- Comprehensive unit tests for all utilities (`httpUtils`, `inputValidation`, `validationUtils`, `contentTypeHandler`)
- Mock for `azure-pipelines-task-lib` to enable testing without Azure infrastructure

## [0.0.1] - 2024-02-25

### Added
- Initial release of Site Verifier task for Azure DevOps
- URL verification with configurable expected HTTP status codes
- Support for HTTP methods: GET, POST, PUT, DELETE, PATCH
- Basic and header token authentication support
- Request payload support for POST/PUT/PATCH methods
- Configurable Content-Type header
- Response logging option for build/release logs
- Response output variable for use in subsequent pipeline tasks
- Expected payload validation with JSONPath (JSON), CSS selectors (HTML/XML), and substring matching (plain text)
- Configurable retry logic with max retries and delay between retries
- Environment variable support for secure credential management
- `.gitignore` configuration for TypeScript compiled output
