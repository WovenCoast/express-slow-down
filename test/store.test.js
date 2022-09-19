const slowDown = require("../lib/express-slow-down");
const { MockStore, InvalidStore } = require("./helpers/mock-store");
const { expectNoDelay } = require("./helpers/requests");

describe("store", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.spyOn(global, "setTimeout");
  });
  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it("should not allow the use of a store that is not valid", () => {
    expect(() => {
      slowDown({
        store: new InvalidStore(),
      });
    }).toThrowError(/store/i);
  });

  it("should call incr on the store", () => {
    const store = new MockStore();
    expect(store.incr_was_called).toBeFalsy();

    const instance = slowDown({
      store,
    });

    expectNoDelay(instance);
    expect(store.incr_was_called).toBeTruthy();
  });

  it("should call resetKey on the store", function () {
    const store = new MockStore();
    const limiter = slowDown({
      store,
    });
    limiter.resetKey("key");
    expect(store.resetKey_was_called).toBeTruthy();
  });
});