# Fathom
A recursive dependency updater for npm

`Fathom` is a dependency updater for `JavaScript` or `TypeScript` projects using `npm`. It will find `package.json` files at all levels of the project, and execute the following commands:

- `npm prune`
- `npm update`

It will then prompt the user to manually update any major updates to ensure there are not breaking changes.
