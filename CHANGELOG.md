# v2.0.0

- core: Only throw an error when initialState is undefined
- [BREAKING] react: Use the new Context API
- Update docs

# v1.4.1

- logger: Pass the args to the logger function

# v1.4.0

- react: Listen for store updates in the `connect` function instead of the Provider
- Use prettier for code formatting

# v1.3.1

- Switch to yarn
- Update dependencies

# v1.3.0

- react: Pass the store state as a prop in the connect HOC

# v1.2.0

- react: Add a consumer HOC
- react: Remove deprecation warnings for React 16

# v1.1.0

- react: Stop storing the store state in the `Provider`, use `forceUpdate`
  instead
- Use the `latest` Babel preset
- Remove the use of `setTimeout` when processing subscribers

# v1.0.1

- Add versioning and logger middleware
- Add documentation and website
- Add examples

# v1.0.0 (broken, see v1.0.1)

# v0.3.0

- Don't wait for subscribers to execute when performing updates

# v0.2.1

- Use a named function for the final middleware

# v0.2.0

- Add middleware functionality
- Use a set for storing subscribers

# v0.1.2

Initial release
