import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import * as tl from "azure-pipelines-task-lib/task";

interface ExtendedAxiosRequestConfig extends AxiosRequestConfig {
  logResponse: boolean;
}

export async function makeHttpRequest(
  config: ExtendedAxiosRequestConfig
): Promise<AxiosResponse<any>> {
  try {
    tl.debug(
      `Making HTTP request to ${config.url} with method ${config.method}`
    );
    config.timeout = config.timeout || 10000;
    const response = await axios(config);
    if (config.logResponse) {
      tl.debug(
        `Successfully completed HTTP request: Method=${config.method}, URL=${
          config.url
        }, Status=${response.status}, Response=${JSON.stringify(response.data)}`
      );
    } else {
      tl.debug(
        `Successfully completed HTTP request: Method=${config.method}, URL=${config.url}, Status=${response.status}`
      );
    }
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response
        ? `Status: ${error.response.status}, Data: ${JSON.stringify(
            error.response.data
          )}`
        : error.message;
      tl.error(`HTTP request failed: ${message}`);
      throw new Error(message);
    } else {
      tl.error(`Unexpected error making HTTP request: ${error}`);
      throw error;
    }
  }
}
