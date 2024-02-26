import * as tl from "azure-pipelines-task-lib/task";
import { run, configureAuthentication } from "../../src/SiteVerifier";
import * as httpUtils from "../../utils/httpUtils";
import { TaskInputs, HttpMethod } from "../../utils/inputValidation";

jest.mock("azure-pipelines-task-lib/task");
jest.mock("../../utils/httpUtils");

const createMockResponse = (responseData: any, status: number): any => ({
  data: responseData,
  status,
  statusText: "OK",
  headers: {},
  config: {},
});

describe("SiteVerifier", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("run function", () => {
    beforeEach(() => {
      jest.mocked(tl.getInput).mockImplementation((name) => {
        switch (name) {
          case "siteUrl":
            return "https://example.com";
          default:
            return null;
        }
      });
      jest.mocked(httpUtils.makeHttpRequest).mockResolvedValue(createMockResponse({ message: "Success" }, 200));
    });

    it("should call setResult with Succeeded on successful verification", async () => {
      await run();
      expect(tl.setResult).toHaveBeenCalledWith(tl.TaskResult.Succeeded, expect.any(String));
    });
  });

  describe("configureAuthentication", () => {
    beforeEach(() => {
      // if necessary
    });

    it("configures basic authentication correctly", async () => {
      process.env.SITE_USERNAME = "user";
      process.env.SITE_PASSWORD = "pass";

      const taskInputs: TaskInputs = {
        useAuthentication: true,
        authenticationMethod: "basic",
      } as any;

      const headers = await configureAuthentication(taskInputs);

      expect(headers.Authorization).toMatch(/^Basic/);
    });
  });

});
