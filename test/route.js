const test = require('tape')
const { locationToRoute, routeToLocation, routeToURL } = require('../index')

test('locationToRoute', (t) => {
    t.deepEqual(locationToRoute({
        pathname: '/',
        search: '',
    }), {
        path: [],
        query: {},
    }, 'empty location')

    t.deepEqual(locationToRoute({
        pathname: '/foo',
        search: '',
    }), {
        path: ['foo'],
        query: {},
    }, 'location with path')

    t.deepEqual(locationToRoute({
        pathname: '/foo/',
        search: '',
    }), {
        path: ['foo'],
        query: {},
    }, 'location with trailing slash')

    t.deepEqual(locationToRoute({
        pathname: '/foo/bar/123/profile',
        search: '',
    }), {
        path: ['foo', 'bar', '123', 'profile'],
        query: {},
    }, 'long path')

    t.deepEqual(locationToRoute({
        pathname: '/foo/bar',
        search: '?',
    }), {
        path: ['foo', 'bar'],
        query: {},
    }, 'empty search')

    t.deepEqual(locationToRoute({
        pathname: '/foo/bar',
        search: '?key=val',
    }), {
        path: ['foo', 'bar'],
        query: { key: 'val' },
    }, 'search with one item')

    t.deepEqual(locationToRoute({
        pathname: '/foo/bar',
        search: '?a=val&b=other',
    }), {
        path: ['foo', 'bar'],
        query: {
            a: 'val',
            b: 'other',
        },
    }, 'search with multiple items')

    t.deepEqual(locationToRoute({
        pathname: '/foo/bar',
        search: '?a=val&b=other%20value',
    }), {
        path: ['foo', 'bar'],
        query: {
            a: 'val',
            b: 'other value',
        },
    }, 'search with encoding')

    t.end()
})

test('routeToLocation', (t) => {
    t.deepEqual(routeToLocation({
        path: [],
        query: {},
    }), {
        pathname: '/',
        search: '',
    }, 'empty route')

    t.deepEqual(routeToLocation({
        path: ['foo', 'bar'],
        query: {},
    }), {
        pathname: '/foo/bar',
        search: '',
    }, 'route with path')

    t.deepEqual(routeToLocation({
        path: ['foo', 'bar'],
        query: { key: 'val' },
    }), {
        pathname: '/foo/bar',
        search: '?key=val',
    }, 'route with 1-item query')

    t.deepEqual(routeToLocation({
        path: ['foo', 'bar'],
        query: {
            a: 'val',
            b: 'other value',
        },
    }), {
        pathname: '/foo/bar',
        search: '?a=val&b=other%20value',
    }, 'route with multiple query')

    t.end()
})

test('routeToURL', (t) => {
    t.equal(routeToURL({
        path: [],
        query: {},
    }),
    '/',
    'empty route')

    t.equal(routeToURL({
        path: ['foo', 'bar'],
        query: {},
    }),
    '/foo/bar',
    'route with path')

    t.equal(routeToURL({
        path: ['foo', 'bar'],
        query: {
            a: 'val',
            b: 'other value',
        },
    }),
    '/foo/bar?a=val&b=other%20value',
    'route with query')

    t.end()
})
