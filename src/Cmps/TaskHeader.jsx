import { useDispatch } from "react-redux";
import { TaskFilter } from "./TaskFilter";
import { SET_IS_ADD } from "../store/reducers/task.reducer";

export function TaskHeader() {
    const disptach = useDispatch()
    return <section className="task-header">
        <h1>Mister Tasker</h1>
        <div className="btns">
            <button>Generate Tasks</button>
            <button>Clear Tasks</button>
            <button onClick={() => disptach({ type: SET_IS_ADD })}>Create new task</button>
            <button>Stop task worker</button>
        </div>
        <TaskFilter />
    </section>
}