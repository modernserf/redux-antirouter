import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'redux-antirouter'
import {
    addedTodo, editedTodo, toggledTodo, deletedTodo, filteredStatus,
    clearedCompleted,
    setTagFilter, addedTagFilter, removedTagFilter, clearedTagFilter,
    selectTodos, selectTags,
} from './data'

const TodoInput = connect(
    () => ({}),
    { addedTodo },
)(class extends React.Component {
    state = {
        value: '',
    };
    onSubmit = (e) => {
        const { value } = this.state
        e.preventDefault()
        this.props.addedTodo({ text: value })
        this.setState({ value: '' })
    }
    onChange = (e) => {
        this.setState({ value: e.target.value })
    }
    render () {
        const { value } = this.state

        return (
            <form className="TodoInput" onSubmit={this.onSubmit}>
                <input type="text"
                    value={value}
                    onChange={this.onChange}
                    placeholder="What needs to be done?" />
            </form>
        )
    }
})

function TodoText ({ data }) {
    const { parsed } = data
    const tags = parsed.map(({ type, value }, i) => type === 'text'
        ? <span key={i}>{value}</span>
        : <Link key={i} action={setTagFilter(value)}>#{value}</Link>)

    return (
        <p className="TodoText">{tags}</p>
    )
}

function TodoItem ({ data, toggledTodo, deletedTodo }) {
    const completed = data.status === 'completed'
    return (
        <div className={`TodoItem
            ${completed ? 'TodoItem--completed' : ''}`}>
            <button className='TodoItem__check'
                onClick={() => toggledTodo(data.id)}
                aria-label={completed ? 'Mark as To Do' : 'Mark as Completed'}>
            </button>
            <div className='TodoItem__text-wrap'>
                <TodoText data={data} />
            </div>
            <button className='TodoItem__delete'
                onClick={() => deletedTodo(data.id)}
                aria-label="Delete">
                ×
            </button>
        </div>
    )
}

class EditTodo extends React.Component {
    componentDidMount () {
        this._ref.focus()
    }
    onSubmit = (e) => {
        e.preventDefault()
        this.props.onSubmit()
    }
    onChange = (e) => {
        this.props.onChange(e.target.value)
    }
    cancelOnEsc = (e) => {
        if (e.keyCode === 27) {
            this.props.onCancel()
        }
    }
    render () {
        const { value, onSubmit } = this.props
        return (
            <form className='EditTodo'
                onSubmit={this.onSubmit} onKeyDown={this.cancelOnEsc}>
                <input type="text"
                    value={value}
                    ref={(el) => { this._ref = el }}
                    onChange={this.onChange}
                    onBlur={onSubmit}/>
            </form>
        )
    }
}

const Todo = connect(
    () => ({}),
    { editedTodo, toggledTodo, deletedTodo }
)(class extends React.Component {
    state = {
        edit: false,
        nextValue: null,
    }
    onStartEdit = () => {
        this.setState({ edit: true })
    }
    onEdit = (value) => {
        this.setState({ nextValue: value })
    }
    onCancelEdit = () => {
        this.setState({
            edit: false,
            nextValue: null,
        })
    }
    onCompleteEdit = () => {
        const { nextValue } = this.state
        if (nextValue) {
            const { data, editedTodo } = this.props
            editedTodo({ text: nextValue, id: data.id })
        }
        this.onCancelEdit()
    }
    editValue = () => {
        const { nextValue } = this.state
        const { data } = this.props
        return nextValue === null ? data.text : nextValue
    }
    render () {
        const { data, toggledTodo, deletedTodo } = this.props
        const { edit } = this.state

        const body = edit
            ? <EditTodo value={this.editValue()}
                onChange={this.onEdit}
                onCancel={this.onCancelEdit}
                onSubmit={this.onCompleteEdit} />
            : <div onDoubleClick={this.onStartEdit}>
                <TodoItem data={data}
                    toggledTodo={toggledTodo}
                    deletedTodo={deletedTodo} />
            </div>

        return (
            <div className="Todo">
                {body}
            </div>
        )
    }
})

const TodoItems = connect(
    (state) => ({ todos: selectTodos(state) })
)(class extends React.Component {
    render () {
        const { todos } = this.props

        return (
            <ul className="TodoItems">{todos.map((todo) =>
                <li key={todo.id}>
                    <Todo data={todo}/>
                </li>
            )}</ul>
        )
    }
})

const TagFilter = connect(
    () => ({}),
    { removedTagFilter, addedTagFilter }
)(({ active, value, removedTagFilter, addedTagFilter }) => {
    const action = active ? removedTagFilter : addedTagFilter

    return (
        <button className={`TagFilter ${active ? 'TagFilter--active' : ''}`}
            onClick={() => action(value)}>
            #{value}
        </button>
    )
})

const TagsGroup = connect(
    (state) => ({
        tags: selectTags(state),
        hasActiveTags: !!state.tagFilter.length,
    }),
    { clearedTagFilter },
)(({ tags, hasActiveTags, clearedTagFilter }) => {
    return (
        <div className='TagsGroup'>
            <header className="TagsGroup__header">
                <h2>tags</h2>
                <button className={`TagsGroup__clear
                    ${hasActiveTags ? 'active' : ''}`}
                    onClick={clearedTagFilter}>Clear filters</button>
            </header>
            <ul className="TagsGroup__content">
                {tags.map((tag) => <li key={tag.value}>
                    <TagFilter {...tag} />
                </li>)}
            </ul>
        </div>
    )
})

const isActive = (prevState, nextState) =>
    prevState.path[0] === nextState.path[0]

const links = [
    { id: 'all', label: 'All' },
    { id: 'todo', label: 'To Do' },
    { id: 'completed', label: 'Completed' },
]

function itemsLeft (count) {
    return (count > 1) ? `${count} items left`
        : (count === 1) ? `1 item left`
        : 'All done!'
}

const Status = connect(
    (state) => ({
        todoCount: state.todos.filter((t) => t.status === 'todo').length,
        hasCompleted: state.todos.some((t) => t.status === 'completed'),
    }),
    { clearedCompleted }
)(({ todoCount, hasCompleted, clearedCompleted }) => {
    return (
        <div className="Status">
            <div className="Status__count">
                {itemsLeft(todoCount)}
            </div>
            <nav>
                {links.map(({ id, label }) =>
                    <Link key={id}
                        action={filteredStatus(id)}
                        className="Status__link"
                        isActive={isActive}>
                        {label}
                    </Link>
                )}
            </nav>
            <button className={`Status__clear
                ${hasCompleted ? 'active' : ''}`}
                onClick={clearedCompleted}>
                × Clear all completed
            </button>
        </div>
    )
})

const Controls = () => {
    return (
        <div className="Controls">
            <TagsGroup />
            <Status />
        </div>
    )
}

export default class App extends React.Component {
    render () {
        return (
            <section className="App">
                <header className="App__header">
                    <h1>todos</h1>
                </header>
                <div className="App__container">
                    <TodoInput />
                    <TodoItems />
                    <Controls />
                </div>
            </section>
        )
    }
}
