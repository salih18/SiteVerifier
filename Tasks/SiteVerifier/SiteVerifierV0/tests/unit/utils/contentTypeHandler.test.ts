import { AxiosResponse } from "axios";
import * as cheerio from "cheerio";
import {
  parseResponseData,
  getResponseType,
} from "../../../utils/contentTypeHandler";

describe("parseResponseData", () => {
  it("should return data without filtering if responseFilterPath is not provided", () => {
    const responseData = "Test data";
    const response: AxiosResponse = {
      data: responseData,
      headers: {
        "content-type": "text/plain",
      },
      status: 200,
      statusText: "OK",
      config: { headers: {} } as any,
    };
    expect(parseResponseData(response)).toBe(responseData);
  });

  it("should return filtered JSON content if content-type is application/json", () => {
    const responseData = { key: "value" };
    const response: AxiosResponse = {
      data: responseData,
      headers: {
        "content-type": "application/json",
      },
      status: 200,
      statusText: "OK",
      config: { headers: {} } as any,
    };
    const responseFilterPath = "key";
    expect(parseResponseData(response, responseFilterPath)).toEqual(
      responseData.key
    );
  });

  it("should return filtered HTML content if content-type is text/html", () => {
    const responseData = "<div>Test HTML</div>";
    const response: AxiosResponse = {
      data: responseData,
      headers: {
        "content-type": "text/html",
      },
      status: 200,
      statusText: "OK",
      config: { headers: {} } as any,
    };
    const responseFilterPath = "div";
    expect(parseResponseData(response, responseFilterPath)).toBe(
      "Test HTML"
    );
  });

  // Add more test cases for different content types and scenarios
});

describe("getResponseType", () => {
  it("should return 'json' for application/json content type", () => {
    const contentType = "application/json";
    expect(getResponseType(contentType)).toBe("json");
  });

  it("should return 'document' for text/html content type", () => {
    const contentType = "text/html";
    expect(getResponseType(contentType)).toBe("document");
  });

  // Add more test cases for different content types
});
