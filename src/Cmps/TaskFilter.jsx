import { useDispatch } from "react-redux"
import { getEmptyFilter } from "../services/task/task.service"
import { SET_FILTER_BY } from "../store/reducers/task.reducer"
import { useState } from "react"

export function TaskFilter() {
    const [filterBy, setFilterBy] = useState(getEmptyFilter())
    const dispatch = useDispatch()

    function setFilterImportance({ target }) {
        const { checked, name } = target
        var newFilterBy = { ...filterBy }
        switch (name) {
            case 'one':
                newFilterBy.importance.one = checked
                break
            case 'two':
                newFilterBy.importance.two = checked
                break
            case 'three':
                newFilterBy.importance.three = checked
                break
        }
        submitFilter(newFilterBy)

    }

    function setFilterTxt({ target }) {
        const { value } = target
        const newFilterBy = { ...filterBy, txt: value }
        submitFilter(newFilterBy)
    }

    function setFilterStatus({ target }) {
        const { name, checked } = target
        var newFilterBy = { ...filterBy }
        switch (name) {
            case 'new':
                newFilterBy.status.new = checked
                break
            case 'done':
                newFilterBy.status.done = checked
                break
            case 'fail':
                newFilterBy.status.fail = checked
                break
        }
        submitFilter(newFilterBy)
    }

    function submitFilter(newFilterBy) {
        setFilterBy(newFilterBy)
        dispatch({ type: SET_FILTER_BY, filterBy: newFilterBy })
    }

    return <section className="task-filter">
        <p>Filters:</p>
        <hr />
        <div>
            <p>Importance</p>

            <input type="checkbox" name="one" id="one"
                checked={filterBy.importance.one} onChange={setFilterImportance} />
            <label htmlFor="one">1</label>

            <input type="checkbox" name="two" id="two"
                checked={filterBy.importance.two} onChange={setFilterImportance} />
            <label htmlFor="two">2</label>

            <input type="checkbox" name="three" id="three"
                checked={filterBy.importance.three} onChange={setFilterImportance} />
            <label htmlFor="three">3</label>
        </div>
        <hr />
        <div>
            <label htmlFor="txt">Filter by text</label>
            <input type="text" name="txt" id="txt" placeholder="Search for a title"
                value={filterBy.txt} onChange={setFilterTxt} />
        </div>
        <hr />
        <div>
            <p>Status</p>
            <input type="checkbox" name="new" id="new"
                checked={filterBy.status.new} onChange={setFilterStatus} />
            <label htmlFor="new">New</label>

            <input type="checkbox" name="done" id="done"
                checked={filterBy.status.done} onChange={setFilterStatus} />
            <label htmlFor="done">Done</label>

            <input type="checkbox" name="fail" id="fail"
                checked={filterBy.status.fail} onChange={setFilterStatus} />
            <label htmlFor="fail">Fail</label>
        </div>


    </section>
}