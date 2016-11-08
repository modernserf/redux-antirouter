# redux-antirouter
Rethinking best routing practices

## What is redux-antirouter?

This is a collection of utilities for routes in a React/Redux app that treats the address bar as an input and URLs as a serialization format.

```
npm install redux-antirouter history
```

## createRouterMiddleware

Derive the route from the app state; dispatch an action when the address bar is changed by the user.

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
    <Link action={action}
        className="link-class"
        activeClassName="active"
        style={{ color: "blue" }}
        activeStyle={{ fontWeight: "bold" }}
        isActive={(currentRoute, nextRoute) =>
            currentRoute.path[0] === nextRoute.path[0]} />
</LinkProvider>
```
