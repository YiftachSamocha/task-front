import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { addTask, loadTasks, onPerformTask, removeTask, updateTask } from "../store/actions/task.actions"

export function TaskList() {
    const tasks = useSelector(state => state.taskModule.tasks)
    const filterBy = useSelector(state => state.taskModule.filterBy)
    const [shownTasks, setShownTasks] = useState([])
    const [saveType, setSaveType] = useState('none')
    const [editedTask, setEditedTask] = useState(null)
    const [content, setContent] = useState({ title: '', importance: 1 })
    const [runningTasks, setRunningTasks] = useState([])
    const isAdd = useSelector(state => state.taskModule.isAdd)

    useEffect(() => {
        if (isAdd) {
            setSaveType('add')
            setContent({ title: '', importance: 1 })
        }

    }, [isAdd])

    useEffect(() => {
        loadTasks(filterBy)
    }, [filterBy])

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

    return <section className="task-list">
        <table>
            <tr className="table-header">
                <th>Title</th>
                <th>Importance</th>
                <th>Status</th>
                <th>Tries Count</th>
                <th>Actions</th>
                <th>Execuate</th>
            </tr>
            {tasks.map(task => {
                if (isShown(task, shownTasks)) {
                    return <div className="detailed-task" onClick={() => unShowTask(task._id)}>
                        <h4>Description</h4>
                        <p>{task.description}</p>
                        <h4>Errors</h4>
                        <p>{task.errors.map(error => {
                            return <span>{error},</span>
                        })}</p>
                        <p className="info">
                            Created at <span>{task.createdAt}</span>
                            Last tried at <span>{task.lastTriedAt}</span>
                            Done at <span>{task.doneAt}</span>

                        </p>
                    </div>
                }
                else return <tr >
                    <td onClick={() => showTask(task._id)}>{task.title}</td>
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