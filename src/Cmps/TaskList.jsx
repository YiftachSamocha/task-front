import { useEffect } from "react"
import { useSelector } from "react-redux"
import { loadTasks } from "../store/actions/task.actions"

export function TaskList() {
    const tasks = useSelector(state => state.taskModule.tasks)
    const filterBy= useSelector(state=> state.taskModule.filterBy)

    useEffect(() => {
        loadTasks(filterBy)
    }, [filterBy])

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
                return <tr>
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