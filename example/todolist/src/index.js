import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { createRouterMiddleware, LinkProvider } from 'redux-antirouter'
import createLogger from 'redux-logger'
import { Provider } from 'react-redux'
import App from './App'
import { reducer, routeChanged, selectRoute, storageMiddleware } from './data'
import './index.css'

const store = createStore(
    reducer,
    applyMiddleware(
        createRouterMiddleware({
            onChange: routeChanged,
            selectRoute: selectRoute,
        }),
        createLogger({ collapsed: true }),
        storageMiddleware,
    ))

ReactDOM.render(
    <Provider store={store}>
        <LinkProvider selectRoute={selectRoute}
            rootReducer={reducer}>
            <App/>
        </LinkProvider>
    </Provider>,
  document.getElementById('root')
)
