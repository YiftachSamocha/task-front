import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { loadTasks } from "../store/actions/task.actions"

export function TaskList() {
    const tasks = useSelector(state => state.taskModule.tasks)
    const filterBy = useSelector(state => state.taskModule.filterBy)
    const [shownTasks, setShownTasks] = useState([])

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

    return <section className="task-list">
        <table>
            <tr className="table-header">
                <th>Title</th>
                <th>Importance</th>
                <th>Status</th>
                <th>Tries Count</th>
                <th>Actions</th>
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
                else return <tr onClick={() => showTask(task._id)}>
                    <td>{task.title}</td>
                    <td>{task.importance}</td>
                    <td>{task.status}</td>
                    <td>{task.triesCount}</td>
                    <td></td>
                </tr>
            })}

        </table>
    </section>
}