# hackyeah-frontend

This project is built using Vue 3 with Vite, offering fast development and modern tooling.

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

## Component Naming and Structure Guidelines

- When possible, each component should be defined in its own dedicated file (Single File Component - SFC).
- Single File Components should be named in **PascalCase**.
- Base components should all start with the same prefix (`Base`). You can think of base components as your app-wide reusable components, like a button or a modal. This groups them together and declares their global, reusable nature.
- Component names should always be multi-worded to avoid conflicts with any existing or future HTML elements. For example, avoid creating a `Table` or a `Button` component.
- Single instance components should begin with the prefix **The**. For example, a site header or footer. This groups them together and declares them as single-use.
- Tightly coupled child components should be prefixed with their parent component's name. For instance, a `TodoListItem` in a `TodoList`. This groups them together and declares them as related.
- Component names should begin with the most top-level (usually general) words and end with the most specific. For example, `SearchWidgetInput`, `SearchWidgetResultsList`, `SearchWidget`. This groups related components together in the file structure.


## Code Formatting with Prettier and Tailwind Plugin

We use **Prettier** for automatic code formatting, along with the **Prettier Tailwind CSS plugin** to organize Tailwind class order in a consistent manner. This ensures that all classes are grouped and ordered based on Tailwind's recommended convention.

Before pushing your changes or creating a pull request, make sure to run the following command to format the code:

```bash
npm run format
```

## Single File Component (SFC) Structure

In our project, we adhere to a specific order within Single File Components (SFCs) to maintain consistency and readability. The recommended order is:

1. **`<template>`**: Place the template section at the top, defining the component's HTML structure.
2. **`<script>`**: Follow the template with the script section, where the component's logic and data are defined.
3. **`<style>`**: Finally, include the style section at the bottom for any CSS related to the component.


## State Management with Pinia

We use **Pinia** for global state management in our project, utilizing the **Composition API**. To ensure proper standards and good practices when working with Pinia, follow these guidelines:

1. **Store Structure**: Organize your stores by features. Each store should represent a specific feature or domain of the application. For example, you might have `authStore`, `cartStore`, etc.

2. **Use the Composition API**: Leverage the Composition API to create and manage your stores. This allows for more flexible and reusable code, making it easier to compose stores together as needed.
