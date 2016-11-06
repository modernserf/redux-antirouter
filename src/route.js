import { parse, stringify } from 'query-string'

export function locationToRoute ({ pathname, search }) {
    const path = pathname.split('/')
    const query = parse(search)
    return { path, query }
}

export function routeToLocation ({ path, query }) {
    const pathname = path.join('/')
    const queryString = stringify(query)
    const search = queryString ? ('?' + queryString) : ''
    return { pathname, search }
}

export function routeToURL (route) {
    const { pathname, search } = routeToLocation(route)
    return pathname + search
}
