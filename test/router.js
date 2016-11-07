const test = require('tape')
const { createRouteHandler } = require('../index')

function mock (mockWith) {
    const fn = function (...args) {
        fn.values.push(args)
        if (mockWith) {
            return mockWith(...args)
        }
    }
    fn.values = []
    fn.lastValue = () => fn.values[fn.values.length - 1]
    fn.wasCalledDuring = (cb) => {
        const oldCount = fn.values.length
        cb()
        return oldCount < fn.values.length
    }
    return fn
}

test('createRouteHandler', (t) => {
    const history = { push: mock(), listen: mock() }
    const onChange = mock()
    const location = {
        pathname: '/',
        search: '',
    }

    const handler = createRouteHandler({ history, onChange, location })

    t.deepEqual(
        onChange.lastValue(),
        [{ path: [], query: {} }],
        'createRouteHandler fires onChange when instantiated')

    const [setRoute] = history.listen.lastValue()

    t.false(onChange.wasCalledDuring(() => {
        setRoute({ pathname: '/foo', search: '' }, 'PUSH')
    }), 'onChange is not fired by PUSH actions')

    setRoute({ pathname: '/foo/bar', search: '' }, 'POP')

    t.deepEqual(
        onChange.lastValue(),
        [{ path: ['foo', 'bar'], query: {} }],
        'onChange is fired by POP actions')

    const route = { path: ['baz', '123'], query: { key: 'val' } }
    handler(route)

    t.deepEqual(
        history.push.lastValue(),
        [{ pathname: '/baz/123', search: '?key=val' }],
        'history pushes new location when route is changed')

    t.false(history.push.wasCalledDuring(() => {
        handler(route)
    }), 'history does not push new location when route is unchanged')

    t.end()
})
