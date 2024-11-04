import { TaskFilter } from "./TaskFilter";

export function TaskHeader() {
    return <section className="task-header">
        <h1>Mister Tasker</h1>
        <div className="btns">
            <button>Generate Tasks</button>
            <button>Clear Tasks</button>
            <button>Create new task</button>
            <button>Stop task worker</button>
        </div>
        <TaskFilter />
    </section>
}