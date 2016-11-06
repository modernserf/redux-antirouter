# redux-antirouter
Rethinking best routing practices

## What is redux-antirouter?

This is a collection of utilities for routes in a React/Redux app that treats the address bar as an input and URLs as a serialization format.

```
npm install redux-antirouter history
```

## createRouterMiddleware

Derive the route from the app state; dispatch an action when the addressbar is changed by the user.

```js
createRouterMiddleware({
    history: [defaults to BrowserHistory],
    onChange: ({ path, query }) => action,
    selectRoute: (state) => ({ path, query }),
})
```

## Link

Real links that get their URLs from the actions they dispatch

```js
<LinkProvider selectRoute={(state) =>  ({ path, query })}
    rootReducer={(state, action) => state}>
    <Link action={action} activeClassName={} />
</LinkProvider>
```
