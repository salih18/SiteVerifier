import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^azure-pipelines-task-lib/task$': '<rootDir>/__mocks__/azure-pipelines-task-lib.ts',
  },
  // other options as needed
};

export default config;
