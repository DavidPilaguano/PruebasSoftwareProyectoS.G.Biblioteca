export function createQueryMock(result = { data: null, error: null }) {
  const query: any = {
    result,
    insert: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    single: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    then(onFulfilled: any, onRejected?: any) {
      return Promise.resolve(this.result).then(onFulfilled, onRejected);
    },
    catch(onRejected: any) {
      return Promise.resolve(this.result).catch(onRejected);
    },
  };

  return query;
}
