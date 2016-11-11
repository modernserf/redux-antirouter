import { createBrowserHistory, createHashHistory } from 'history'
import { createRouteHandler } from './base-router'

export function createRouterMiddleware (params) {
    const { history, location, selectRoute, onChange } = params

    return function ({ dispatch, getState }) {
        const routeHandler = createRouteHandler({
            history: history || createBrowserHistory(),
            location: location || window.location,
            onChange: (route) => dispatch(onChange(route)),
        })

        return (next) => (action) => {
            const value = next(action)

            routeHandler(selectRoute(getState()))

            return value
        }
    }
}

export function createHashRouterMiddleware ({ selectRoute, onChange }) {
    return createRouterMiddleware({
        history: createHashHistory(),
        location: {
            pathname: window.location.hash.replace('#', '') || '/',
            search: window.location.search,
        },
        selectRoute,
        onChange,
    })
}
