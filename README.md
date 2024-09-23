# usegs

**usegs** is a simple and efficient global state management library for React, using the `useGS` hook.

## Installation

To install usegs, use npm or yarn:

```bash
npm install usegs
```

or

```bash
yarn add usegs
```

## Getting Started

### Initializing Global State

To start using usegs, initialize your global state with the initGS function. This function takes an object where each key-value pair represents the initial state and its default value.

```javascript
import { initGS } from "usegs";

// Initialize global state with default values
initGS({
  CURRENT_FOLDER: { items: { customItem: true } },
  SHOW_PAYMENT_GUIDE: true,
});
```

### Using Global State in React Components

The useGS hook allows you to access and update global state within your React components.

```javascript
import React from "react";
import { useGS } from "usegs";

function MyComponent() {
  // Use the useGS hook to get the current state and the function to update it
  const [currentFolder, setCurrentFolder] = useGS("CURRENT_FOLDER");

  // Example function to update the state
  const addItem = () => {
    setCurrentFolder({ items: { newItem: true } });
  };

  return (
    <div>
      <h1>Current Folder</h1>
      <pre>{JSON.stringify(currentFolder, null, 2)}</pre>
      <button onClick={addItem}>Add Item</button>
    </div>
  );
}

export default MyComponent;
```

### Managing Global State in JavaScript Files

usegs also provides functions getGS and setGS to interact with global state outside of React components, such as in utility functions or event handlers.

```javascript
import { getGS, setGS } from "usegs";

// Get the current value of a global state
const folderState = getGS("CURRENT_FOLDER");
console.log("Current Folder State:", folderState);

// Update the value of a global state
setGS("CURRENT_FOLDER", { items: { anotherItem: true } });
```

## API Reference

### initGS(initialState)

- Description: Initializes the global state with the provided object. Each key-value pair sets the initial state for a specific key.
- Parameters:
  initialState (Object) - An object containing initial state values.
- Example:

```javascript
initGS({
  CURRENT_FOLDER: { items: {} },
  SHOW_PAYMENT_GUIDE: false,
});
```

### useGS(key, initialValue)

- Description: React hook to use and update a global state within a component.
- Parameters:
  key (string) - The key of the global state.
  initialValue (any) - Optional initial value if the state key is not already registered.
- Returns: [stateValue, setStateFunction]
- Example:

```javascript
const [currentFolder, setCurrentFolder] = useGS("CURRENT_FOLDER", {
  items: {},
});
```

### getGS(key)

- Description: Retrieves the value of a global state.
- Parameters:
  key (string) - The key of the global state to retrieve.
- Returns: The current value of the specified global state, or null if the key is not found.
- Example:

```javascript
const folderState = getGS("CURRENT_FOLDER");
```

### setGS(key, newValue)

- Description: Updates the value of a global state and notifies all registered listeners.
- Parameters:
  key (string) - The key of the global state to update.
  newValue (any) - The new value to set for the state.
- Example:

```javascript
setGS("CURRENT_FOLDER", { items: { updatedItem: true } });
```

## License

This project is licensed under the MIT License - see the **LICENSE** file for details.
