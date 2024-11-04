import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { addTask, loadTasks, onPerformTask, removeTask, updateTask } from "../store/actions/task.actions"
import { SET_IS_WORKER_ON } from "../store/reducers/task.reducer"

export function TaskList() {
    const tasks = useSelector(state => state.taskModule.tasks)
    const filterBy = useSelector(state => state.taskModule.filterBy)
    const [shownTasks, setShownTasks] = useState([])
    const [saveType, setSaveType] = useState('none')
    const [editedTask, setEditedTask] = useState(null)
    const [content, setContent] = useState({ title: '', importance: 1 })
    const [runningTasks, setRunningTasks] = useState([])
    const isAdd = useSelector(state => state.taskModule.isAdd)
    const isWorkerOn = useSelector(state => state.taskModule.isWorkerOn)
    const dispatch = useDispatch()

    useEffect(() => {
        if (isAdd) {
            setSaveType('add')
            setContent({ title: '', importance: 1 })
        }

    }, [isAdd])

    useEffect(() => {
        loadTasks(filterBy)
    }, [filterBy])

    useEffect(() => {
        runWorker(0)
    }, [isWorkerOn])

    function isShown(obj, ids) {
        return ids.includes(obj._id)
    }

    function showTask(_id) {
        const newShownTasks = [...shownTasks, _id]
        setShownTasks(newShownTasks)
    }

    function unShowTask(idToRemove) {
        const newShownTasks = shownTasks.filter(_id => _id !== idToRemove)
        setShownTasks(newShownTasks)
    }

    function handleChange({ target }) {
        const { name, value } = target
        if (name === 'title') {
            setContent({ ...content, title: value })
        }
        else if (name === 'importance') {
            setContent({ ...content, importance: value })
        }
    }

    async function submitChanges(ev) {
        const taskToUpdate = { ...editedTask }
        taskToUpdate.title = content.title
        taskToUpdate.importance = Number(content.importance)
        if (saveType === 'edit') {
            await updateTask(taskToUpdate)
        }
        else if (saveType === 'add') {
            const taskToAdd = {
                title: content.title || '',
                status: 'new',
                description: '',
                importance: content.importance,
                createdAt: new Date(),
                lastTriedAt: null,
                triesCount: 0,
                doneAt: null,
                errors: [],
            }
            await addTask(taskToAdd)
        }

        await loadTasks(filterBy)
        setSaveType('none')
    }

    function onSetEditedTask(task) {
        setContent({ title: task.title, importance: task.importance })
        setEditedTask(task)
        setSaveType('edit')
    }

    async function doTask(task) {
        let newRunningTasks = [...runningTasks, task._id]
        setRunningTasks(newRunningTasks)
        await onPerformTask(task)
        await loadTasks(filterBy)
        newRunningTasks = newRunningTasks.filter(taskId => taskId !== task._id)
        setRunningTasks(newRunningTasks)
    }

    async function runWorker(idx) {
        if (!isWorkerOn) return
        var delay = 7000
        try {
            const task = tasks[idx]
            if (task) {
                try {
                    if (task.status !== 'done') {
                        await doTask(task)
                    }
                }
                catch (err) {
                    console.log(`Failed Task`, err)
                }
                finally {
                    delay = 1
                }
            } else {
                dispatch({ type: SET_IS_WORKER_ON, isWorkerOn: false })
                console.log('Snoozing... no tasks to perform')
            }
        }
        catch (err) {
            console.log(`Failed getting next task to execute`, err)
        }
        finally {
            setTimeout(() => runWorker(idx + 1), delay)
        }
    }

    function formatDate(date) {
        const dateToFormat = new Date(date)
        return dateToFormat.toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        })
    }

    return <section className="task-list">
        <table>
            <tr className="table-header">
                <th>Title</th>
                <th>Importance</th>
                <th>Status</th>
                <th>Tries Count</th>
                <th>Actions</th>
                <th>Execute</th>
            </tr>
            {tasks.map(task => {
                if (isShown(task, shownTasks)) {
                    return <div className="detailed-task" onClick={() => unShowTask(task._id)}>
                        <h4>Description</h4>
                        <p>{task.description}</p>
                        <h4>Errors</h4>
                        <p>{task.errors.map(error => {
                            if (error === task.errors[0]) return <span>{error}</span>
                            return <span>, {error}</span>
                        })}</p>
                        <p className="info">
                            Created at <span>{formatDate(task.createdAt)}</span>
                            Last tried at <span>{formatDate(task.lastTriedAt)}</span>
                            {task.doneAt && <span>Done at <span>{formatDate(task.doneAt)}</span></span>}

                        </p>
                    </div>
                }
                else return <tr >
                    <td className="title" onClick={() => showTask(task._id)}>{task.title}</td>
                    <td>{task.importance}</td>
                    <td>{runningTasks.includes(task._id) ?
                        <span className="running">Running</span>
                        : <span className={task.status}>{task.status}</span>}</td>
                    <td>{task.triesCount}</td>
                    <td>
                        <button onClick={() => onSetEditedTask(task)} className="edit">Edit</button>
                        <button onClick={() => removeTask(task._id)} className="delete" >Delete</button>
                    </td>
                    <td>
                        {runningTasks.includes(task._id)
                            ? <div className="loader"></div>
                            : <div>
                                {task.status === 'failed' && <button onClick={() => doTask(task)} className="start">Retry</button>}
                                {task.status === 'new' && <button onClick={() => doTask(task)} className="start">Start</button>}
                            </div>}

                    </td>
                </tr>
            })}
            {saveType !== 'none' && <tr>
                <td>
                    <label htmlFor="title">Task Title</label>
                    <input type="text" id="title" name="title"
                        value={content.title} onChange={handleChange} />
                </td>
                <td>
                    <label htmlFor="importance">Importance</label>
                    <input type="number" id="importance" name="importance" max={3} min={1}
                        value={content.importance} onChange={handleChange} />
                </td>
                <td></td>
                <td></td>
                <td></td>
                <td>
                    <button onClick={submitChanges} className="save">Save</button>
                </td>
            </tr>}


        </table>
    </section>
}