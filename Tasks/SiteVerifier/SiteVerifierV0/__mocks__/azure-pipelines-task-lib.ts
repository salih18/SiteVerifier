import * as jestMock from 'jest-mock';

export const getInput = jestMock.fn();
export const getBoolInput = jestMock.fn();
export const setResult = jestMock.fn();
export const warning = jestMock.fn();
export const error = jestMock.fn();
export const debug = jestMock.fn();
export const setVariable  = jestMock.fn();

export const TaskResult = {
    Succeeded: 0,
    Failed: 1,
  };