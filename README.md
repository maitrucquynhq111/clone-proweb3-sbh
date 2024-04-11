# Finan Proweb 3.0 Project

This FrontEnd project contains the main features of the Finan Proweb 3.0 Project.

If you want to contribute, please refer to the guidelines of this project.

## Requied

**System**:

- **Node:** > v16.15.0

**VSCode Plugins**:

- **Prettier:** Code formatter
- **ESLint:** Find problems & fix automatically

## 1. Quick Start

Install dependencies

```bash
npm install
```

Start the development server

```bash
npm start
```

Build with production mode

```bash
npm build
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

## 2. Project structure `src/`

- **components** contains generic components used inside the application.
- **configs** contains all the config files.
- **features** contains building blocks for each page. The entry point of a feature is used as the root component of each route.
- **i18n** contains configs and namespaces translations file.
- **layouts** contains generic layout for displays.
- **modals** contains generic Modal components used inside the application.
- **pages** contains page component.
- **routes** contains generic route configs.
- **services** contains hooks handle fetching APIs.
- **styles** contains css/scss or less file.
- **utils** contains generic utilities functions.

## 3. Package Scripts

### Check format code

```bash
npm run prettier:check
# This command check formats files in folder src.
```

### Quick check format code

```bash
npm run prettier:check:staged
```

### Formats files

```bash
npm run prettier:write
# This command formats files in folder src.
```

## 4. How to commit code?

Commitlint checks if your commit messages meet the conventional commit format.

### Type-enum

- **build:** Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)
- **chore:** A code change can be part of commits of any type.
- **ci:** Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs)
- **docs:** Documentation only changes
- **feat:** A new feature
- **fix:** A bug fix
- **perf:** A code change that improves performance
- **refactor:** A code change that neither fixes a bug nor adds a feature
- **revert:** The commit reverts a previous commit
- **style:** Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- **test:** Adding missing tests or correcting existing tests

In general the pattern mostly looks like this:

```bash
type(scope?): Subject
#scope is optional; multiple scopes are supported (current delimiter options: "/", "\" and ",")
```

### Examples

```bash
chore: Update translation
```

```bash
fix(server): Send cors headers
```

```bash
feat(blog): Add comment section
```
