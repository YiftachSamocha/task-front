import { httpService } from '../http.service'

export const taskService = {
    query,
    getById,
    save,
    remove,
    addtaskMsg
}

async function query(filterBy) {
    return httpService.get(`task`, filterBy)
}

function getById(taskId) {
    return httpService.get(`task/${taskId}`)
}

async function remove(taskId) {
    return httpService.delete(`task/${taskId}`)
}
async function save(task) {
    var savedtask
    if (task._id) {
        savedtask = await httpService.put(`task`, task)
    } else {
        savedtask = await httpService.post('task', task)
    }
    return savedtask
}

async function addtaskMsg(taskId, txt) {
    const savedMsg = await httpService.post(`task/${taskId}/msg`, { txt })
    return savedMsg
}

export function getEmptyFilter() {
    return {
        importance: { one: false, two: false, three: false },
        txt: '',
        status: { new: false, done: false, fail: false }

    }
}