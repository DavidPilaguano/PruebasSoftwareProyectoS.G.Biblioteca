type QueryResult = {
  data: unknown;
  error: unknown;
};

type QueryMock = {
  result: QueryResult;
  insert: jest.MockedFunction<(value: unknown) => QueryMock>;
  select: jest.MockedFunction<(...args: unknown[]) => QueryMock>;
  single: jest.MockedFunction<() => QueryMock>;
  eq: jest.MockedFunction<(column: string, value: unknown) => QueryMock>;
  update: jest.MockedFunction<(value: unknown) => QueryMock>;
  delete: jest.MockedFunction<() => QueryMock>;
  then: (
    onFulfilled?: (value: QueryResult) => unknown,
    onRejected?: (reason: unknown) => unknown,
  ) => Promise<unknown>;
  catch: (onRejected?: (reason: unknown) => unknown) => Promise<unknown>;
};

export function createQueryMock(
  result: QueryResult = { data: null, error: null },
): QueryMock {
  const query: QueryMock = {
    result,
    insert: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    single: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    then: (onFulfilled, onRejected) =>
      Promise.resolve(query.result).then(onFulfilled, onRejected),
    catch: (onRejected) => Promise.resolve(query.result).catch(onRejected),
  };

  return query;
}
