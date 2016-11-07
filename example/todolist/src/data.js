import shortid from 'shortid'
import { combineReducers } from 'redux'

// constants

const statuses = ['all', 'todo', 'completed']
    .reduce((m, k) => { m[k] = k; return m }, {})

// actions

export const routeChanged = (route) => ({
    type: 'routeChanged',
    payload: route,
})

export const filteredStatus = (status) => ({
    type: 'filteredStatus',
    payload: status,
})

export const setTagFilter = (tag) => ({
    type: 'setTagFilter',
    payload: tag,
})

export const addedTagFilter = (tag) => ({
    type: 'addedTagFilter',
    payload: tag,
})

export const removedTagFilter = (tag) => ({
    type: 'removedTagFilter',
    payload: tag,
})

export const clearedTagFilter = () => ({ type: 'clearedTagFilter' })

export const loadedTodos = (todos) => ({
    type: 'loadedTodos',
    payload: todos,
})

export const addedTodo = ({ text }) => ({
    type: 'addedTodo',
    payload: { text, id: shortid.generate() },
})

export const editedTodo = ({ text, id }) => ({
    type: 'editedTodo',
    payload: { text, id },
})

export const toggledTodo = (id) => ({
    type: 'toggledTodo',
    payload: { id },
})

export const deletedTodo = (id) => ({
    type: 'deletedTodo',
    payload: { id },
})

export const clearedCompleted = () => ({ type: 'clearedCompleted' })

// reducers

const statusFilter = (state = statuses.all, { type, payload }) => {
    switch (type) {
    case 'routeChanged': {
        const [status] = payload.path
        if (!status) { return statuses.all }
        if (statuses[status]) { return status }
        return state
    }
    case 'filteredStatus':
        return payload
    default:
        return state
    }
}

const tagFilter = (state = [], { type, payload }) => {
    switch (type) {
    case 'routeChanged':
        const { tags } = payload.query
        return tags ? tags.split(',') : []
    case 'setTagFilter':
        return [payload]
    case 'addedTagFilter':
        return [...new Set(state).add(payload)]
    case 'removedTagFilter':
        return state.filter((t) => t !== payload)
    case 'clearedTagFilter':
        return []
    default:
        return state
    }
}

const todos = (state = [], { type, payload }) => {
    switch (type) {
    case 'loadedTodos':
        return payload.map((todo) => ({
            ...todo,
            ...tagText(todo.text),
        }))
    case 'addedTodo':
        return [...state, {
            id: payload.id,
            status: statuses.todo,
            ...tagText(payload.text),
        }]
    case 'editedTodo':
        return state.map((data) =>
            data.id === payload.id
                ? { ...data, ...tagText(payload.text) }
                : data)
    case 'toggledTodo':
        return state.map((data) =>
            data.id === payload.id
                ? { ...data, status: toggle(data.status) }
                : data)
    case 'deletedTodo':
        return state.filter((data) => data.id !== payload.id)
    case 'clearedCompleted':
        return state.filter((data) => data.status !== statuses.completed)
    default:
        return state
    }
}

export const reducer = combineReducers({
    statusFilter,
    tagFilter,
    todos,
})

// selectors

export const selectRoute = ({ statusFilter, tagFilter }) => {
    const path = statusFilter === statuses.all ? [] : [statusFilter]
    const query = {}
    if (tagFilter.length) {
        query.tags = tagFilter.join(',')
    }
    return { path, query }
}

export const selectTodos = ({ statusFilter, tagFilter, todos }) => {
    const tagSet = new Set(tagFilter)
    const hasTag = tagFilter.length
        ? (tags) => tags.some((tag) => tagSet.has(tag))
        : () => true

    const hasStatus = statusFilter === statuses.all
        ? () => true
        : (status) => status === statusFilter

    return todos.filter((todo) =>
        hasTag(todo.tags) && hasStatus(todo.status))
}

export const selectTags = ({ tagFilter, todos }) => {
    const activeTagSet = new Set(tagFilter)
    const allTags = todos.reduce((coll, ts) => coll.concat(ts.tags), [])
    const uniqTags = [...new Set(allTags)]

    return uniqTags.map((tag) => ({
        value: tag,
        active: activeTagSet.has(tag),
    }))
}

// utilities

function tagText (text) {
    const parsed = text.split(/(#\w+)/g).map((t) => {
        if (t[0] === '#' && t[1]) {
            return { type: 'tag', value: t.substr(1) }
        } else {
            return { type: 'text', value: t }
        }
    })

    const tags = parsed.reduce((coll, { type, value }) => {
        if (type === 'tag') { coll.add(value) }
        return coll
    }, new Set())

    return { text, parsed, tags: [...tags] }
}

function toggle (currentStatus) {
    return ({
        todo: statuses.completed,
        completed: statuses.todo,
    })[currentStatus]
}

// middleware

const STORAGE_KEY = 'todos-v1'

function loadTodos () {
    try {
        const str = window.localStorage.getItem(STORAGE_KEY)
        return JSON.parse(str) || []
    } catch (e) {
        return []
    }
}

export function storageMiddleware ({ dispatch, getState }) {
    dispatch(loadedTodos(loadTodos()))

    const actions = new Set([
        'addedTodo', 'editedTodo', 'toggledTodo', 'deletedTodo',
        'clearedCompleted',
    ])

    return (next) => (action) => {
        const res = next(action)

        if (actions.has(action.type)) {
            const todoState = getState().todos
            const todos = todoState.map(({ id, text, status }) => ({
                id, text, status,
            }))
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
        }

        return res
    }
}
