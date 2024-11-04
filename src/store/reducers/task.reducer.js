export const SET_TASKS = 'SET_TASKS'
export const SET_TASK = 'SET_TASK'
export const REMOVE_TASK = 'REMOVE_TASK'
export const ADD_TASK = 'ADD_TASK'
export const UPDATE_TASK = 'UPDATE_TASK'
export const ADD_TASK_MSG = 'ADD_TASK_MSG'
export const SET_FILTER_BY = 'SET_FILTER_BY'
export const SET_IS_ADD = 'SET_IS_ADD'
export const SET_IS_WORKER_ON = 'SET_IS_WORKER_ON'

const initialState = {
    tasks: [],
    filterBy: {},
    isAdd: false,
    isWorkerOn: false,
}

export function taskReducer(state = initialState, action) {
    var newState = state
    var tasks
    switch (action.type) {
        case SET_TASKS:
            newState = { ...state, tasks: action.tasks }
            break
        case SET_TASK:
            newState = { ...state, task: action.task }
            break
        case REMOVE_TASK:
            const lastRemovedTask = state.tasks.find(task => task._id === action.taskId)
            tasks = state.tasks.filter(task => task._id !== action.taskId)
            newState = { ...state, tasks, lastRemovedTask }
            break
        case ADD_TASK:
            newState = { ...state, tasks: [...state.tasks, action.task] }
            break
        case UPDATE_TASK:
            tasks = state.tasks.map(task => (task._id === action.task._id) ? action.task : task)
            newState = { ...state, tasks }
            break
        case SET_FILTER_BY:
            const newFilterBy = { ...action.filterBy }
            newState = { ...state, filterBy: newFilterBy }
            break
        case SET_IS_ADD:
            newState = { ...state, isAdd: true }
            break
        case SET_IS_WORKER_ON:
            newState = { ...state, isWorkerOn: action.isWorkerOn }
            break
        default:
    }
    return newState
}

// unitTestReducer()


