import * as tl from "azure-pipelines-task-lib/task";
import {
  validateTaskInputs,
  HttpMethod,
  TaskInputs,
  validateEnvironmentVariables,
} from "../../../utils/inputValidation";

// Spy on console methods
const tlDebugSpy = jest.spyOn(tl, "debug");
const tlErrorSpy = jest.spyOn(tl, "error");

// Helper function to test validateTaskInputs
const testValidateTaskInputs = (inputs: TaskInputs, expectedError?: string) => {
  it("should throw an error for an empty URL", () => {
    if (expectedError) {
      expect(() => validateTaskInputs(inputs)).toThrowError(expectedError);
    } else {
      expect(() => validateTaskInputs(inputs)).not.toThrow();
    }
  });
};

describe("validateTaskInputs", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const expectedErrorForEmptyURL = "URL is required but was not provided.";
  const expectedErrorForInvalidStatusCode =
    "Expected status code must be between 100 and 599.";

  describe("URL validation", () => {
    testValidateTaskInputs(
      {
        url: "",
        httpMethod: HttpMethod.GET,
        expectedStatusCode: 200,
      },
      expectedErrorForEmptyURL
    );
  });

  describe("Status code validation", () => {
    testValidateTaskInputs(
      {
        url: "https://api.example.com",
        httpMethod: HttpMethod.GET,
        expectedStatusCode: 999, // Invalid
      },
      expectedErrorForInvalidStatusCode
    );
  });

  // Add more tests for other validation scenarios

  it("should pass validation with valid inputs", () => {
    const inputs: TaskInputs = {
      url: "https://api.example.com",
      httpMethod: HttpMethod.POST,
      expectedStatusCode: 201,
      // Add other valid inputs as necessary
    };
    expect(() => validateTaskInputs(inputs)).not.toThrow();
  });

  it("should throw error for invalid authentication method", () => {
    const inputs: TaskInputs = {
      url: "https://example.com",
      httpMethod: HttpMethod.GET,
      expectedStatusCode: 200,
      useAuthentication: true,
      authenticationMethod: "invalid" as "basic" | "header", // Invalid authentication method
    };

    expect(() => validateTaskInputs(inputs)).toThrowError(
      "Invalid authentication method: invalid"
    );
  });

  it("should succeed with basic authentication using environment variables", () => {
    const inputs: TaskInputs = {
      url: "https://example.com",
      httpMethod: HttpMethod.GET,
      expectedStatusCode: 200,
      useAuthentication: true,
      authenticationMethod: "basic",
    };
    const env = {
      SITE_USERNAME: "user",
      SITE_PASSWORD: "password",
    };
    process.env = { ...process.env, ...env };

    expect(() => validateTaskInputs(inputs)).not.toThrow();
  });

  it("should succeed with bearer token authentication using environment variables", () => {
    const inputs: TaskInputs = {
      url: "https://example.com",
      httpMethod: HttpMethod.GET,
      expectedStatusCode: 200,
      useAuthentication: true,
      authenticationMethod: "header",
    };
    const env = {
      SITE_AUTH_TOKEN: "Bearer abcdef123456",
    };
    process.env = { ...process.env, ...env };

    expect(() => validateTaskInputs(inputs)).not.toThrow();
  });

  it("should pass validation with valid inputs", () => {
    const inputs: TaskInputs = {
      url: "https://example.com",
      httpMethod: HttpMethod.GET,
      expectedStatusCode: 400, // This status code is valid
    };

    expect(() => validateTaskInputs(inputs)).not.toThrow();
  });

  it("should pass with a POST request with a request payload", () => {
    const inputs: TaskInputs = {
      url: "https://example.com",
      httpMethod: HttpMethod.POST,
      expectedStatusCode: 201,
      requestPayload: JSON.stringify({ key: "value" }),
    };

    expect(() => validateTaskInputs(inputs)).not.toThrow();
  });

  it("should pass with a POST request without a request payload", () => {
    const inputs: TaskInputs = {
      url: "https://example.com",
      httpMethod: HttpMethod.POST,
      expectedStatusCode: 201,
    };

    expect(() => validateTaskInputs(inputs)).not.toThrow();
  });

  it("should pass with a PUT request with a request payload", () => {
    const inputs: TaskInputs = {
      url: "https://example.com",
      httpMethod: HttpMethod.PUT,
      expectedStatusCode: 200,
      requestPayload: JSON.stringify({ key: "value" }),
    };

    expect(() => validateTaskInputs(inputs)).not.toThrow();
  });

  it("should pass with response filtering for JSON payload", () => {
    const inputs: TaskInputs = {
      url: "https://example.com",
      httpMethod: HttpMethod.GET,
      expectedStatusCode: 200,
      responseFilterPath: "data",
    };

    expect(() => validateTaskInputs(inputs)).not.toThrow();
  });
  it("should throw an error for invalid maxRetries (negative)", () => {
    const inputs: TaskInputs = {
      url: "https://example.com",
      httpMethod: HttpMethod.GET,
      expectedStatusCode: 200,
      maxRetries: -1, // Negative value
    };
    expect(() => validateTaskInputs(inputs)).toThrowError(
      "Max retries must be a non-negative integer."
    );
  });

  it("should not throw an error for infinite delayBetweenRetries", () => {
    const inputs: TaskInputs = {
      url: "https://example.com",
      httpMethod: HttpMethod.GET,
      expectedStatusCode: 200,
      delayBetweenRetries: Infinity, // Infinite value
    };
    expect(() => validateTaskInputs(inputs)).toThrowError(
      "Delay between retries must be a non-negative integer."
    );
  });
});

describe("validateEnvironmentVariables", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should throw error for missing environment variables for basic authentication", () => {
    const inputs: TaskInputs = {
      url: "https://api.example.com",
      httpMethod: HttpMethod.GET,
      expectedStatusCode: 200,
      useAuthentication: true,
      authenticationMethod: "basic",
    };
    // Mocking process.env to simulate missing environment variables
    const originalEnv = process.env;
    process.env = {}; // Empty environment variables

    // Expect the function to throw an error
    expect(() => validateEnvironmentVariables(inputs)).toThrowError(
      "Missing required environment variables based on task configuration."
    );

    // Restore the original process.env
    process.env = originalEnv;
  });

  it("should throw error for missing environment variables for header authentication", () => {
    const inputs: TaskInputs = {
      url: "https://api.example.com",
      httpMethod: HttpMethod.GET,
      expectedStatusCode: 200,
      useAuthentication: true,
      authenticationMethod: "header",
    };
    // Mocking process.env to simulate missing environment variables
    const originalEnv = process.env;
    process.env = {}; // Empty environment variables

    // Expect the function to throw an error
    expect(() => validateEnvironmentVariables(inputs)).toThrowError(
      "Missing required environment variables based on task configuration."
    );

    // Restore the original process.env
    process.env = originalEnv;
  });

  // Success cases
  it("should not throw error when all required environment variables for basic authentication are present", () => {
    const inputs: TaskInputs = {
      url: "https://api.example.com",
      httpMethod: HttpMethod.GET,
      expectedStatusCode: 200,
      useAuthentication: true,
      authenticationMethod: "basic",
    };
    // Mocking process.env to simulate presence of required environment variables
    process.env.SITE_USERNAME = "username";
    process.env.SITE_PASSWORD = "password";

    // Expect the function not to throw an error
    expect(() => validateEnvironmentVariables(inputs)).not.toThrow();
  });

  it("should not throw error when all required environment variables for header authentication are present", () => {
    const inputs: TaskInputs = {
      url: "https://api.example.com",
      httpMethod: HttpMethod.GET,
      expectedStatusCode: 200,
      useAuthentication: true,
      authenticationMethod: "header",
    };
    // Mocking process.env to simulate presence of required environment variables
    process.env.SITE_AUTH_TOKEN = "Bearer abc123";

    // Expect the function not to throw an error
    expect(() => validateEnvironmentVariables(inputs)).not.toThrow();
  });

  // Add more success cases for other scenarios where environment variables are required
});
