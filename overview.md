# Site Verifier Task for Azure DevOps

<img src="https://site-verifier.gallerycdn.vsassets.io/extensions/site-verifier/239a924b-20fe-46d2-b9b1-f8fb92aae43b/0.0.5/1708973381790/images/icon.png" alt="SiteVerifier Icon" style="width: 200px; height: 200px;">

## Introduction

The **Site Verifier** task is essential for validating web services and APIs within Azure DevOps environments. It ensures the reliability and correctness of services throughout the CI/CD workflows, offering extensive features for comprehensive verification.

## Getting Started

- Installation is straightforward through the Azure DevOps Marketplace.
- Add the **Site Verifier** task to any Build or Release pipeline.
- Configure the target URL, expected status code, and optional parameters.

## Configuration

| Parameter | Required | Default | Description |
|-----------|----------|---------|-------------|
| `siteUrl` | Yes | — | The target URL for verification (must include scheme) |
| `expectedStatusCode` | Yes | `200` | The expected HTTP status code |
| `httpMethod` | Yes | `GET` | HTTP method: `GET`, `POST`, `PUT`, `DELETE`, `PATCH` |
| `useAuthentication` | No | `false` | Enable authentication for the request |
| `authenticationMethod` | No | `basic` | Authentication type: `basic` or `header` |
| `requestPayload` | No | — | JSON payload for POST, PUT, or PATCH requests |
| `contentType` | No | `application/json` | Content-Type header for the request |
| `expectedPayload` | No | — | Expected response payload for validation |
| `responseFilterPath` | No | — | JSONPath, CSS selector, or keyword filter for response |
| `logResponse` | No | `false` | Log response content in pipeline output |
| `responseOutput` | No | — | Pipeline variable name to store the response body |
| `maxRetries` | No | `3` | Number of retry attempts on failure |
| `delayBetweenRetries` | No | `5` | Delay in seconds between retries |
| `environmentVariables` | No | — | Key=Value pairs for authentication credentials |

---

## Examples

### 1. Basic Health Check (GET)

Verify that a URL returns HTTP 200:

```yaml
steps:
  - task: SiteVerifier@0
    displayName: 'Health Check - Production'
    inputs:
      siteUrl: 'https://api.example.com/health'
      expectedStatusCode: '200'
      httpMethod: 'GET'
```

### 2. Verify a Specific HTTP Status Code

Check that an endpoint returns a specific status code (e.g., 201 Created):

```yaml
steps:
  - task: SiteVerifier@0
    displayName: 'Verify Resource Creation Endpoint'
    inputs:
      siteUrl: 'https://api.example.com/resources'
      expectedStatusCode: '201'
      httpMethod: 'POST'
      requestPayload: '{"name": "test-resource"}'
      contentType: 'application/json'
```

### 3. POST with Payload Verification

Send a POST request and verify the response body matches expected content:

```yaml
steps:
  - task: SiteVerifier@0
    displayName: 'Verify API Response'
    inputs:
      siteUrl: 'https://api.example.com/data'
      expectedStatusCode: '200'
      httpMethod: 'POST'
      requestPayload: '{"query": "status"}'
      contentType: 'application/json'
      expectedPayload: '{"status": "healthy", "version": "2.0"}'
```

### 4. PUT Request

Update a resource and verify the response:

```yaml
steps:
  - task: SiteVerifier@0
    displayName: 'Update Configuration'
    inputs:
      siteUrl: 'https://api.example.com/config/123'
      expectedStatusCode: '200'
      httpMethod: 'PUT'
      requestPayload: '{"setting": "enabled", "value": true}'
      contentType: 'application/json'
```

### 5. DELETE Request

Verify that a resource is deleted successfully:

```yaml
steps:
  - task: SiteVerifier@0
    displayName: 'Verify Resource Deletion'
    inputs:
      siteUrl: 'https://api.example.com/resources/456'
      expectedStatusCode: '204'
      httpMethod: 'DELETE'
```

### 6. PATCH Request

Partially update a resource:

```yaml
steps:
  - task: SiteVerifier@0
    displayName: 'Patch User Settings'
    inputs:
      siteUrl: 'https://api.example.com/users/789'
      expectedStatusCode: '200'
      httpMethod: 'PATCH'
      requestPayload: '{"notifications": false}'
      contentType: 'application/json'
```

---

## Authentication

### 7. Basic Authentication

Use username and password credentials:

```yaml
steps:
  - task: SiteVerifier@0
    displayName: 'Verify Protected Endpoint (Basic Auth)'
    inputs:
      siteUrl: 'https://api.example.com/admin/status'
      expectedStatusCode: '200'
      httpMethod: 'GET'
      useAuthentication: true
      authenticationMethod: 'basic'
      environmentVariables: |
        SITE_USERNAME=$(AdminUsername)
        SITE_PASSWORD=$(AdminPassword)
```

> **Tip:** Store `AdminUsername` and `AdminPassword` as secret pipeline variables or link them from a Variable Group.

### 8. Header Token Authentication

Use a Bearer token or custom header for authentication:

```yaml
steps:
  - task: SiteVerifier@0
    displayName: 'Verify Protected Endpoint (Token Auth)'
    inputs:
      siteUrl: 'https://api.example.com/secure/data'
      expectedStatusCode: '200'
      httpMethod: 'GET'
      useAuthentication: true
      authenticationMethod: 'header'
      environmentVariables: |
        SITE_AUTH_TOKEN=Bearer $(ApiToken)
```

---

## Response Filtering

The `responseFilterPath` parameter supports different filter types based on the response content type.

### 9. JSON Response Filtering (JSONPath)

Extract and validate a nested JSON field using lodash path syntax:

```yaml
steps:
  - task: SiteVerifier@0
    displayName: 'Verify API Version'
    inputs:
      siteUrl: 'https://api.example.com/info'
      expectedStatusCode: '200'
      httpMethod: 'GET'
      responseFilterPath: 'data.version'
      expectedPayload: '"2.1.0"'
```

For nested objects:

```yaml
steps:
  - task: SiteVerifier@0
    displayName: 'Verify Nested Config'
    inputs:
      siteUrl: 'https://api.example.com/config'
      expectedStatusCode: '200'
      httpMethod: 'GET'
      responseFilterPath: 'settings.database.host'
      expectedPayload: '"db.production.internal"'
```

### 10. HTML Response Filtering (CSS Selectors)

Extract content from HTML responses using CSS selectors (powered by Cheerio):

```yaml
steps:
  - task: SiteVerifier@0
    displayName: 'Verify Page Title'
    inputs:
      siteUrl: 'https://www.example.com'
      expectedStatusCode: '200'
      httpMethod: 'GET'
      contentType: 'text/html'
      responseFilterPath: 'title'
      expectedPayload: 'Welcome to Example'
```

Extract content from a specific element:

```yaml
steps:
  - task: SiteVerifier@0
    displayName: 'Verify Footer Content'
    inputs:
      siteUrl: 'https://www.example.com'
      expectedStatusCode: '200'
      httpMethod: 'GET'
      contentType: 'text/html'
      responseFilterPath: '.footer .version'
      expectedPayload: 'v2.0'
```

### 11. XML Response Filtering

Filter XML responses using CSS-like selectors:

```yaml
steps:
  - task: SiteVerifier@0
    displayName: 'Verify SOAP Response'
    inputs:
      siteUrl: 'https://api.example.com/soap/status'
      expectedStatusCode: '200'
      httpMethod: 'POST'
      contentType: 'application/xml'
      requestPayload: '<StatusRequest><service>auth</service></StatusRequest>'
      responseFilterPath: 'StatusResponse > status'
      expectedPayload: 'running'
```

### 12. Plain Text Keyword Matching

Check that a plain text response contains specific keywords (comma-separated, all must match):

```yaml
steps:
  - task: SiteVerifier@0
    displayName: 'Verify Text Response Contains Keywords'
    inputs:
      siteUrl: 'https://api.example.com/status.txt'
      expectedStatusCode: '200'
      httpMethod: 'GET'
      contentType: 'text/plain'
      responseFilterPath: 'healthy, running, production'
      expectedPayload: 'true'
```

---

## Response Output

### 13. Store Response in a Pipeline Variable

Capture the response body and use it in subsequent tasks:

```yaml
steps:
  - task: SiteVerifier@0
    displayName: 'Fetch API Token'
    inputs:
      siteUrl: 'https://auth.example.com/token'
      expectedStatusCode: '200'
      httpMethod: 'POST'
      requestPayload: '{"client_id": "my-app", "grant_type": "client_credentials"}'
      contentType: 'application/json'
      responseOutput: 'AuthToken'
      responseFilterPath: 'access_token'

  - script: |
      echo "Token retrieved successfully"
      echo "Using token in next step..."
    displayName: 'Use Retrieved Token'
    env:
      TOKEN: $(AuthToken)
```

### 14. Response Logging

Enable response logging for debugging (use with caution in production):

```yaml
steps:
  - task: SiteVerifier@0
    displayName: 'Debug API Response'
    inputs:
      siteUrl: 'https://api.example.com/debug'
      expectedStatusCode: '200'
      httpMethod: 'GET'
      logResponse: true
```

> **Caution:** Be mindful when enabling `logResponse` in production environments. The response may contain sensitive information that will be visible in pipeline logs.

---

## Retry Configuration

### 15. Custom Retry Logic

Configure retry attempts and delay for unreliable endpoints:

```yaml
steps:
  - task: SiteVerifier@0
    displayName: 'Verify with Retries'
    inputs:
      siteUrl: 'https://api.example.com/health'
      expectedStatusCode: '200'
      httpMethod: 'GET'
      maxRetries: '5'
      delayBetweenRetries: '10'
```

### 16. No Retries (Single Attempt)

For fast-fail scenarios:

```yaml
steps:
  - task: SiteVerifier@0
    displayName: 'Quick Status Check'
    inputs:
      siteUrl: 'https://api.example.com/ping'
      expectedStatusCode: '200'
      httpMethod: 'GET'
      maxRetries: '1'
      delayBetweenRetries: '0'
```

---

## Using Site Verifier in Azure DevOps Release Pipelines

The Site Verifier task integrates seamlessly into Release pipelines for post-deployment verification.

### 17. Post-Deployment Verification

Add to a release stage to verify a deployment was successful:

```yaml
steps:
  - task: SiteVerifier@0
    displayName: 'Post-Deploy Health Check'
    inputs:
      siteUrl: 'https://$(Environment).example.com/health'
      expectedStatusCode: '200'
      httpMethod: 'GET'
      maxRetries: '5'
      delayBetweenRetries: '15'
```

### 18. Multi-Endpoint Verification

Verify multiple endpoints after deployment:

```yaml
steps:
  - task: SiteVerifier@0
    displayName: 'Verify API Health'
    inputs:
      siteUrl: 'https://api.example.com/health'
      expectedStatusCode: '200'
      httpMethod: 'GET'

  - task: SiteVerifier@0
    displayName: 'Verify Frontend'
    inputs:
      siteUrl: 'https://www.example.com'
      expectedStatusCode: '200'
      httpMethod: 'GET'
      contentType: 'text/html'

  - task: SiteVerifier@0
    displayName: 'Verify Auth Service'
    inputs:
      siteUrl: 'https://auth.example.com/.well-known/openid-configuration'
      expectedStatusCode: '200'
      httpMethod: 'GET'
```

### 19. Full Pipeline Example

A complete pipeline that builds, deploys, and verifies:

```yaml
trigger:
  - main

pool:
  vmImage: 'ubuntu-latest'

stages:
  - stage: Build
    jobs:
      - job: BuildApp
        steps:
          - script: echo "Building application..."
            displayName: 'Build'

  - stage: Deploy
    dependsOn: Build
    jobs:
      - job: DeployApp
        steps:
          - script: echo "Deploying to staging..."
            displayName: 'Deploy'

  - stage: Verify
    dependsOn: Deploy
    jobs:
      - job: SiteVerification
        steps:
          - task: SiteVerifier@0
            displayName: 'Verify Staging API'
            inputs:
              siteUrl: 'https://staging-api.example.com/health'
              expectedStatusCode: '200'
              httpMethod: 'GET'
              maxRetries: '5'
              delayBetweenRetries: '10'

          - task: SiteVerifier@0
            displayName: 'Verify API Response'
            inputs:
              siteUrl: 'https://staging-api.example.com/version'
              expectedStatusCode: '200'
              httpMethod: 'GET'
              responseFilterPath: 'version'
              expectedPayload: '"$(Build.BuildNumber)"'
              logResponse: true

          - task: SiteVerifier@0
            displayName: 'Verify Protected Endpoint'
            inputs:
              siteUrl: 'https://staging-api.example.com/admin/status'
              expectedStatusCode: '200'
              httpMethod: 'GET'
              useAuthentication: true
              authenticationMethod: 'header'
              environmentVariables: |
                SITE_AUTH_TOKEN=Bearer $(StagingApiToken)
```

---

## Best Practices

- **Use secret variables** for all authentication credentials — never hardcode tokens or passwords.
- **Set appropriate retry values** — use higher retries and delays for post-deployment checks where services may need warm-up time.
- **Use `responseFilterPath`** to validate specific fields rather than entire response bodies, which may change between deployments.
- **Enable `logResponse` only for debugging** — disable it in production pipelines to avoid exposing sensitive data in logs.
- **Store responses in variables** with `responseOutput` to chain verification steps or pass data between tasks.

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Task fails with timeout | Increase `maxRetries` and `delayBetweenRetries` |
| Authentication errors | Verify environment variables are set correctly and credentials are valid |
| Unexpected payload mismatch | Enable `logResponse` to inspect the actual response content |
| Wrong content type | Set the `contentType` parameter to match your endpoint's expected format |
| Missing environment variables | Ensure `environmentVariables` input uses the `KEY=VALUE` format, one per line |

Overall, the **Site Verifier** task offers a comprehensive solution for ensuring the reliability and functionality of web services and APIs within Azure DevOps pipelines, supporting modern CI/CD practices.
