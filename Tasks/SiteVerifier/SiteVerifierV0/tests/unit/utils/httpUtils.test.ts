import axios from "axios";
import * as tl from "azure-pipelines-task-lib/task";
import {
  makeHttpRequest,
  ExtendedAxiosRequestConfig,
} from "../../../utils/httpUtils";

jest.mock("axios");
jest.mock("azure-pipelines-task-lib/task");

describe("makeHttpRequest", () => {
  // Centralizing mock setup
  const mockAxios = axios as jest.MockedFunction<typeof axios>;
  const tlDebugSpy = jest.spyOn(tl, "debug");

  // Helper for mock responses
  const createMockResponse = (responseData: any, status: number) => ({
    data: responseData,
    status,
    statusText: "OK",
    headers: {},
    config: {},
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  // Parameterized test function
  const testMakeHttpRequest = async (
    config: ExtendedAxiosRequestConfig,
    expectedResponseData: any,
    expectedStatus: number,
    expectedLogMessage: string
  ) => {
    const mockResponse = createMockResponse(
      expectedResponseData,
      expectedStatus
    );
    mockAxios.mockResolvedValueOnce(mockResponse);

    const result = await makeHttpRequest(config);

    expect(mockAxios).toHaveBeenCalledWith(config);
    expect(result).toEqual(mockResponse);
    expect(tlDebugSpy).toHaveBeenCalledWith(expectedLogMessage);
  };

  it("should handle successful request with default logging", async () => {
    await testMakeHttpRequest(
      { url: "https://api.example.com/", method: "GET", logResponse: true },
      { message: "Success" },
      200,
      `Successfully completed HTTP request: Method=GET, URL=https://api.example.com/, Status=200, Response={"message":"Success"}`
    );
  });

  it("should handle successful request without logging", async () => {
    await testMakeHttpRequest(
      {
        url: "https://anotherapi.com/resource",
        method: "POST",
        logResponse: false,
      },
      { status: "OK" },
      204,
      `Successfully completed HTTP request: Method=POST, URL=https://anotherapi.com/resource, Status=204`
    );
  });
});
