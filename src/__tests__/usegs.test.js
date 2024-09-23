import { renderHook, act } from "@testing-library/react-hooks";
import { initGS, getGS, setGS, useGS } from "../stateManager";

describe("usegs Global State Management Tests", () => {
  beforeEach(() => {
    // Reset the global state before each test
    initGS({
      CURRENT_FOLDER: { items: {} },
      SHOW_PAYMENT_GUIDE: false,
    });
  });

  test("initGS initializes the global state correctly", () => {
    // Initialize state with custom values
    initGS({
      TEST_KEY: "testValue",
    });

    // Check if the state was initialized correctly
    expect(getGS("TEST_KEY")).toBe("testValue");
  });

  test("getGS retrieves the correct value of a global state", () => {
    // Use the initialized value from beforeEach
    const currentFolder = getGS("CURRENT_FOLDER");

    expect(currentFolder).toEqual({ items: {} });
  });

  test("setGS updates the global state correctly", () => {
    // Update the CURRENT_FOLDER state
    setGS("CURRENT_FOLDER", { items: { newItem: true } });

    // Check if the state has been updated correctly
    const updatedFolder = getGS("CURRENT_FOLDER");
    expect(updatedFolder).toEqual({ items: { newItem: true } });
  });

  test("useGS hook retrieves and updates state inside a component", () => {
    // Use renderHook to simulate using the useGS hook in a component
    const { result } = renderHook(() => useGS("CURRENT_FOLDER"));

    // Check the initial state
    expect(result.current[0]).toEqual({ items: {} });

    // Act function is used to simulate state updates in hooks
    act(() => {
      result.current[1]({ items: { addedItem: true } });
    });

    // Check if the state was updated correctly
    expect(result.current[0]).toEqual({ items: { addedItem: true } });
  });

  test("useGS handles non-existent keys by registering new state", () => {
    // Render the hook with a non-existent key
    const { result } = renderHook(() => useGS("NEW_KEY", "initialValue"));

    // Check if the state initializes correctly with the default value
    expect(result.current[0]).toBe("initialValue");

    // Update the state
    act(() => {
      result.current[1]("updatedValue");
    });

    // Check the updated state value
    expect(result.current[0]).toBe("updatedValue");
  });
});
