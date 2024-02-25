import * as tl from "azure-pipelines-task-lib/task";
import isEqual from "lodash/isEqual";
import differenceWith from "lodash/differenceWith";
import isEmpty from "lodash/isEmpty";

export function payloadMatches(
  actualPayload: any,
  expectedPayload: string,
  logResponse: boolean
): boolean {
  let expected: any;

  try {
    expected = JSON.parse(expectedPayload);
  } catch (error) {
    // Parsing failed
    expected = expectedPayload;
  }

  // Convert actualPayload to a comparable format if necessary
  if (
    typeof expected === "number" &&
    typeof actualPayload === "string" &&
    !isNaN(parseFloat(actualPayload))
  ) {
    actualPayload = parseFloat(actualPayload);
  } else if (
    typeof expected === "string" &&
    typeof actualPayload !== "string"
  ) {
    // If expected is a string but actual is not, convert actual to string for comparison
    actualPayload = JSON.stringify(actualPayload);
  }

  if (isEqual(actualPayload, expected)) {
    tl.debug("Payloads match successfully.");
    return true;
  } else {
    tl.warning(`Expected and Received payload does not match!`);

    if (logResponse) {
      const diff = differenceWith([actualPayload], [expected], isEqual);
      if (!isEmpty(diff)) {
        tl.warning(`Differences found: ${JSON.stringify(diff)}`);
      } else {
        tl.warning(
          `No differences found. Issue may be in data types or structure.`
        );
      }
    }
    return false;
  }
}
