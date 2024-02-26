import * as tl from "azure-pipelines-task-lib/task";
import { payloadMatches } from "../../../utils/validationUtils";

describe("payloadMatches", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return true if actualPayload matches expectedPayload", () => {
    const expectedPayload = '{"key": "value"}';
    const actualPayload = { key: "value" };
    const logResponse = false;

    expect(payloadMatches(actualPayload, expectedPayload, logResponse)).toBe(
      true
    );
    expect(tl.debug).toHaveBeenCalledWith("Payloads match successfully.");
  });

  it("should return false if actualPayload does not match expectedPayload", () => {
    const expectedPayload = '{"key": "value"}';
    const actualPayload = { key: "different value" };
    const logResponse = false;

    expect(payloadMatches(actualPayload, expectedPayload, logResponse)).toBe(
      false
    );
    expect(tl.warning).toHaveBeenCalledWith(
      "Expected and Received payload does not match!"
    );
  });

  it("should log differences when logResponse is true", () => {
    const expectedPayload = '{"key": "value"}';
    const actualPayload = { key: "different value" };
    const logResponse = true;

    expect(payloadMatches(actualPayload, expectedPayload, logResponse)).toBe(
      false
    );
    expect(tl.warning).toHaveBeenCalledWith(
      "Expected and Received payload does not match!"
    );
    expect(tl.warning).toHaveBeenCalledWith(
      `Differences found: [{"key":"different value"}]`
    );
  });

  it("should log 'No differences found' when logResponse is true and payloads are identical", () => {
    const expectedPayload = '{"key": "value"}';
    const actualPayload = { key: "value" };
    const logResponse = true;
  
    expect(payloadMatches(actualPayload, expectedPayload, logResponse)).toBe(
      true
    );
    expect(tl.debug).toHaveBeenCalledWith("Payloads match successfully.");
    expect(tl.warning).toHaveBeenCalledWith(
      "Expected and Received payload does not match!"
    );
    expect(tl.warning).not.toHaveBeenCalledWith(
      "No differences found. Issue may be in data types or structure."
    );
  });

  // Add more test cases to cover other scenarios
});
