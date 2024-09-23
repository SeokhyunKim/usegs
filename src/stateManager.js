import React, { useEffect, useRef } from "react";
import { makeNewValue } from "./utils";

// An object to store the global states.
// Each key represents a state item with its value and a set of listeners (components that depend on the state).
const GS = {};

/**
 * Registers a new global state key with an initial value.
 * If the key already exists, it updates the existing key with the provided value.
 *
 * @param {string} key - The key under which the state will be stored.
 * @param {*} value - The initial value of the state.
 */
const registerGS = (key, value) => {
  GS[key] = {
    value, // The current value of the global state.
    listeners: new Set(), // A set of listeners (React components) that should be notified when the state changes.
  };
};

/**
 * Initializes the global state with a given initial state object.
 * This function should be called once, usually at the start of your application.
 *
 * @param {Object} initialState - An object where each key-value pair represents the state name and its initial value.
 */
export const initGS = (initialState = {}) => {
  // Loop through each key-value pair in the initial state object and register them in GS.
  Object.entries(initialState).forEach(([key, value]) => {
    registerGS(key, value);
  });
};

/**
 * Retrieves the value of a global state by its key.
 *
 * @param {string} key - The key of the global state to retrieve.
 * @returns {*} - The current value of the global state, or null if the key is not found.
 */
export function getGS(key) {
  if (!GS[key]) {
    return null; // Return null if the key does not exist in the global state.
  }
  return GS[key].value; // Return the value of the specified key.
}

/**
 * Updates the value of a global state and notifies all registered listeners.
 * If the key does not exist, it registers the key with the provided value.
 *
 * @param {string} key - The key of the global state to update.
 * @param {*} newValue - The new value to set for the state.
 */
export function setGS(key, newValue) {
  // If the key does not exist in GS, register it first with the new value.
  if (!GS[key]) {
    registerGS(key, newValue);
    return;
  }

  // Update the current value of the global state by merging with the new value.
  GS[key].value = makeNewValue(GS[key].value, newValue);

  // Notify all registered listeners (components) about the state change.
  GS[key].listeners.forEach((listener) => {
    listener[1]((prev) => prev + 1); // Trigger a re-render by incrementing a dummy state value.
  });
}

/**
 * React hook that allows components to use and update global state.
 * It registers the component as a listener to the specified global state.
 *
 * @param {string} key - The key of the global state to use.
 * @param {*} initialValue - An optional initial value if the state key is not already registered.
 * @returns {[*, Function]} - The current value of the state and a function to update the state.
 */
export function useGS(key, initialValue = undefined) {
  // A dummy state used to force the component to re-render when the global state changes.
  const [val, setVal] = React.useState(0);

  // A ref to track if this is the component's first render.
  const isFirstRender = useRef(true);

  // Register the global state with the initial value if it does not exist.
  if (!GS[key]) {
    registerGS(key, initialValue);
  }

  // Set the initial value of the state if it is undefined.
  if (GS[key].value === undefined) {
    GS[key].value = initialValue;
  }

  useEffect(() => {
    // On the first render, add the component's state update function as a listener to the global state.
    if (isFirstRender.current) {
      isFirstRender.current = false; // Mark that the component has rendered once.
      GS[key].listeners.add([val, setVal]); // Register the component's listener.

      // Cleanup function to remove the listener when the component unmounts.
      return () => {
        GS[key].listeners.delete([val, setVal]);
      };
    }
  }, [key, val]); // Dependencies: re-run effect when key or val changes.

  /**
   * Function to update the global state value.
   *
   * @param {*} newValue - The new value to set for the global state.
   */
  const setGSVal = (newValue) => {
    setGS(key, newValue); // Call setGS to update the state and notify listeners.
  };

  // Return the current value of the global state and the function to update it.
  return [GS[key].value, setGSVal];
}
