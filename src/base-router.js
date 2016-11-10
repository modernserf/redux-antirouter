import { locationToRoute, routeToLocation } from './route'

export function createRouteHandler ({ history, onChange, location }) {
    const setRouteFromLocation = (location, action) => {
        if (!action || action === 'POP') {
            onChange(locationToRoute(location))
        }
    }

    let prevLocation = {}
    const setLocationFromRoute = (route) => {
        const location = routeToLocation(route)
        if (locationEq(prevLocation, location)) { return }
        prevLocation = location
        history.push(location)
    }

    setRouteFromLocation(location)
    history.listen(setRouteFromLocation)
    return setLocationFromRoute
}

function locationEq (a, b) {
    return a.pathname === b.pathname && a.search === b.search
}
