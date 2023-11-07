import '@fontsource/inter'
import './App.css'

import { useState } from 'react'
import { BoardType } from './types/board'
import { Board } from './components/Board'

function App() {
  const [tasks, setTasks] = useState<string[]>([])
  const [done, setDone] = useState<string[]>([])

  const addTodo = (value: string, first: boolean) => {
    setTasks(first ? [value, ...tasks] : [...tasks, value])
  }

  const addDone = (value: string) => {
    setDone([...done, value])
  }

  const removeTodo = (value: string) => {
    setTasks(tasks.filter((e) => e !== value))
    return tasks.length
  }

  const removeDone = (value: string) => {
    setDone(done.filter((e) => e !== value))
  }

  return (
    <main>
      <Board
        type={BoardType.TASKS}
        items={tasks}
        addTodo={addTodo}
        addDone={addDone}
        removeTodo={removeTodo}
        removeDone={removeDone}
      />
      <Board
        type={BoardType.DONE}
        items={done}
        addTodo={addTodo}
        addDone={addDone}
        removeTodo={removeTodo}
        removeDone={removeDone}
      />
    </main>
  )
}

export default App
