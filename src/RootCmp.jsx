import React from 'react'
import { TaskHeader } from './Cmps/TaskHeader'
import { TaskList } from './Cmps/TaskList'


export function RootCmp() {
    return (
        <div className="main-container">
            <TaskHeader />
            <TaskList />

        </div>
    )
}


