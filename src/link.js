import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { routeToURL } from './route'

const CONTEXT = 'redux-antirouter/Link/getNextRoute'

const h = React.createElement

export class LinkProvider extends React.Component {
    constructor (props) {
        super(props)
        this.initProps = props
    }
    getChildContext () {
        return { [CONTEXT]: this.initProps }
    }
    render () {
        return this.props.children
    }
}

LinkProvider.propTypes = {
    selectRoute: PropTypes.func.isRequired,
    rootReducer: PropTypes.func.isRequired,
}

LinkProvider.childContextTypes = {
    [CONTEXT]: PropTypes.object,
}

function LinkBase ({ children, href, onNavigate, className, style }) {
    const onClick = (e) => {
        e.stopPropagation()
        if (e.altKey || e.metaKey) { return }
        e.preventDefault()
        onNavigate()
    }

    return h('a', { className, style, href, onClick }, children)
}

const LinkConnector = connect(
    (appState) => appState,
    undefined,
    (appState, dispatch, { props, context }) => {
        const {
            children, action, isActive,
            className, activeClassName, style, activeStyle,
        } = this.props
        const { selectRoute, rootReducer } = this.context

        const currentRoute = selectRoute(appState)
        const nextRoute = rootReducer(appState, action)
        const active = isActive(currentRoute, nextRoute)

        return {
            children,
            href: routeToURL(nextRoute),
            onNavigate: () => dispatch(action),
            className: active ? `${className} ${activeClassName}` : className,
            style: active ? merge(style, activeStyle) : style,
        }
    }
)(LinkBase)

export function Link (props, context) {
    return h(LinkConnector, { props, context })
}

Link.PropTypes = {
    action: PropTypes.object.isRequired,
    className: PropTypes.string,
    activeClassName: PropTypes.string,
    style: PropTypes.object,
    activeStyle: PropTypes.object,
    isActive: PropTypes.func,
}

Link.defaultProps = {
    className: '',
    activeClassName: 'active',
    isActive: defaultIsActive,
}

Link.contextTypes = {
    [CONTEXT]: PropTypes.object,
}

function merge (a, b) {
    if (a && b) { return { ...a, ...b } }
    return a || b
}

export function defaultIsActive ({ path, query }, next) {
    // next path is parent or equal to current path
    for (let i = 0; i < next.path.length; i++) {
        if (!path[i] || path[i] !== next.path[i]) { return false }
    }

    // next query is subset of current query
    for (const key in next.query) {
        if (!query[key] || query[key] !== next.query[key]) { return false }
    }

    return true
}
