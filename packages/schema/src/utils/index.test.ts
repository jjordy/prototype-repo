import { getAllowedKeys, keysToArray } from "./index";

describe("getAllowedKeys", () => {
  it("It should only return the allowed keywords passed as keyword list", () => {
    const t = getAllowedKeys({ name: "test", test: "test2" }, ["test"]);
    expect(t).toEqual({ test: "test2" });
  });
});

describe("keysToArray", () => {
  it("Should convert an object of strings to an array where each value is an array entry", () => {
    const t = keysToArray({
      TEST_VALUE: 1,
      TEST_VALUE_2: "test",
      TEST_VALUE_3: true,
      TEST_VALUE_4: undefined,
      TEST_VALUE_5: null
    });
    expect(t).toEqual([1, "test", true, undefined, null]);
  });
});
