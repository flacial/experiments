import { useEffect, useState } from 'react'
import { Stars } from './Stars'
import { BoardItem } from './BoardItem'
import { BoardType } from '../types/board'
import { AddTodoInput } from './AddTodoInput'

export const Board = ({
  type,
  items,
  addTodo,
  addDone,
  removeDone,
  removeTodo,
}: {
  type: BoardType
  items: string[]
  addTodo?: (value: string, first: boolean) => void
  addDone?: (value: string) => void
  removeDone?: (value: string) => void
  removeTodo?: (value: string) => void
}) => {
  const [addMode, setAddMode] = useState(false)
  const [newTodo, setNewTodo] = useState('')
  const [doneTodoPosition, setDoneTodoPosition] = useState<
    | {
        left: number
        right: number
      }
    | undefined
  >(undefined)
  const [tasksBoardPosition, setTasksBoardPosition] = useState<
    | {
        left: number
        right: number
      }
    | undefined
  >(undefined)

  const boardName = type === BoardType.TASKS ? 'tasks' : 'done'

  const getDoneListPosition = () => {
    const doneList = document.querySelector('.board__done')
    const doneBoundings = doneList?.getBoundingClientRect()

    return {
      left: doneBoundings?.left || 0,
      right: doneBoundings?.right || 0,
    }
  }

  const getTasksListPosition = () => {
    const tasksList = document.querySelector('.board__tasks')
    const tasksBboundings = tasksList?.getBoundingClientRect()

    return {
      left: tasksBboundings?.left || 0,
      right: tasksBboundings?.right || 0,
    }
  }

  useEffect(() => {
    if (boardName === 'tasks') {
      setDoneTodoPosition(getDoneListPosition())
    } else {
      setTasksBoardPosition(getTasksListPosition())
    }
  }, [boardName])

  const renderBoardItems = () => {
    return items.map((item, index) => (
      <BoardItem
        key={index}
        boardName={boardName}
        item={item}
        doneTodoPosition={doneTodoPosition}
        tasksBoardPosition={tasksBoardPosition}
        addDone={addDone}
        addTask={addTodo}
        removeDone={removeDone}
        removeTodo={removeTodo}
      />
    ))
  }

  const renderAddTodoInput = () => {
    return (
      <AddTodoInput
        newTodo={newTodo}
        setNewTodo={setNewTodo}
        setAddMode={setAddMode}
        addTodo={addTodo}
      />
    )
  }

  const renderAddButton = () => {
    if (type === BoardType.TASKS) {
      return (
        <button
          className="board__button"
          onClick={() => setAddMode((prev) => !prev)}
        >
          <img
            width="24"
            height="24"
            src="https://lcdn-eu.icons8.com/c/UMQZU55cX0apgJI8rNCAmQ/cc5a85a947635c796dd289fce9efae6d236cabcb.png"
          />
        </button>
      )
    }
  }

  const emptyOrItems = () => {
    if (items.length) {
      return renderBoardItems()
    }

    if (type === BoardType.TASKS) {
      return (
        <div className="tasks__empty">
          <span>🎉</span>
          <span>
            <strong>Yay!</strong> You have no tasks left.
          </span>
        </div>
      )
    }

    return <></>
  }

  return (
    <div className="board__container">
      {type === BoardType.DONE && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
          }}
        >
          <Stars />
        </div>
      )}
      <span className={`board__name board__name--${boardName}`}>
        {boardName}
      </span>
      <div className={`board ${type}`}>
        {addMode && renderAddTodoInput()}
        <div className="board__items">{emptyOrItems()}</div>
      </div>
      {renderAddButton()}
    </div>
  )
}
