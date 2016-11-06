import { createBrowserHistory } from 'history'
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
