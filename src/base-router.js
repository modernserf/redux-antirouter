import { locationToRoute, routeToLocation } from './route'

export function createRouteHandler ({ history, onChange, location }) {
    const setRouteFromLocation = (location, action) => {
        if (!action || action === 'POP') {
            onChange(locationToRoute(location))
        }
    }

    let prevRoute
    const setLocationFromRoute = (route) => {
        if (route === prevRoute) { return }
        prevRoute = route
        history.push(routeToLocation(route))
    }

    setRouteFromLocation(location)
    history.listen(setRouteFromLocation)
    return setLocationFromRoute
}
