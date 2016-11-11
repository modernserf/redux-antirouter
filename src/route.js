import { parse, stringify } from 'query-string'

export function locationToRoute ({ pathname, search }) {
    const path = pathname.split('/')
    if (path[0] === '') { path.shift() }
    if (path[path.length - 1] === '') { path.pop() }

    const query = parse(search)
    return { path, query }
}

export function routeToLocation ({ path, query }) {
    const pathname = '/' + path.join('/')
    const queryString = stringify(query)
    const search = queryString ? ('?' + queryString) : ''
    return { pathname, search }
}

export function routeToURL (route) {
    const { pathname, search } = routeToLocation(route)
    return pathname + search
}

export function hashRouteToURL (route) {
    return '#' + routeToURL(route)
}
