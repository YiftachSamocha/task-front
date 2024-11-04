import { useDispatch, useSelector } from "react-redux";
import { TaskFilter } from "./TaskFilter";
import { SET_IS_ADD, SET_IS_WORKER_ON } from "../store/reducers/task.reducer";

export function TaskHeader() {
    const disptach = useDispatch()
    const isWorkerOn = useSelector(state => state.taskModule.isWorkerOn)
    const dispatch = useDispatch()

    function toggleIsWorkerOn() {
        dispatch({ type: SET_IS_WORKER_ON, isWorkerOn: !isWorkerOn })
    }
    
    return <section className="task-header">
        <h1>Mister Tasker</h1>
        <div className="btns">
            <button>Generate Tasks</button>
            <button>Clear Tasks</button>
            <button onClick={() => disptach({ type: SET_IS_ADD })}>Create new task</button>
            <button onClick={toggleIsWorkerOn} > <span>{isWorkerOn ? 'Stop' : 'Start'}</span> task worker</button>
        </div>
        <TaskFilter />
    </section>
}