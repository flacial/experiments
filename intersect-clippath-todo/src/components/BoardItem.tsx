import { useState } from 'react'
import party from 'party-js'

const Line = () => (
  <div
    style={{
      display: 'block',
      backgroundColor: 'rgba(0, 0, 0, 0.39)',
      width: '110%',
      height: '6px',
      position: 'absolute',
      borderRadius: '20px',
      zIndex: 3,
      animation: '0.5s ease normal mark',
      userSelect: 'none',
    }}
  />
)

const playSoundEffect = (src?: string) => {
  const audio = new Audio(
    // 'https://assets.mixkit.co/sfx/preview/mixkit-game-level-completed-2059.mp3'
    // './assets/sounds/level-completed.mp3'
    src || 'src/assets/sounds/task-completed.wav'
  )

  return audio.play()
}

const getLeftSideClipPath = (isTasks: boolean, tasksLeftSideClipPath: number) =>
  isTasks ? tasksLeftSideClipPath : 0

const getRightSideClipPath = (
  isTasks: boolean,
  doneRightSideClipPath: number
) => (!isTasks ? doneRightSideClipPath : 0)

const getOpacity = (bool: boolean, coordsValue: { move: boolean }) =>
  bool && !coordsValue.move ? 0.7 : 1

export const BoardItem = ({
  boardName,
  item,
  doneTodoPosition,
  tasksBoardPosition,
  addDone,
  addTask,
  removeDone,
  removeTodo,
}: {
  boardName: string
  item: string
  doneTodoPosition?: {
    left: number
    right: number
  } | null
  tasksBoardPosition?: {
    left: number
    right: number
  } | null
  addDone?: (value: string) => void
  addTask?: (value: string, first: boolean) => void
  removeDone?: (value: string) => void
  removeTodo?: (value: string) => void
}) => {
  const [coords, setCoords] = useState({ x: 0, y: 0, move: false })
  const [doneRightSideClipPath, setDoneRightSideClipPath] = useState(0)
  const [tasksLeftSideClipPath, setTasksLeftSideClipPath] = useState(0)
  const [collapsed, setCollapsed] = useState(false)

  const isTasks = boardName === 'tasks'
  const isDone = boardName === 'done'

  const handleMouseMove = (
    event: MouseEvent,
    parentEvent: MouseEvent,
    focusedElement: Element
  ) => {
    const boundingValue = focusedElement.getBoundingClientRect()

    setCoords({
      // mouse position on move - mouse position on first click.
      // the position is relative to the parent and
      // this is why we need to subtract the initial move position
      // from the current mouse position
      x: event.clientX - parentEvent.clientX,
      y: event.clientY - parentEvent.clientY,
      move: true,
    })

    const collapsedWithDone = doneTodoPosition?.left
      ? boundingValue.right - doneTodoPosition.left
      : 0
    setDoneRightSideClipPath(collapsedWithDone)

    const collapsedWithTasks = tasksBoardPosition?.right
      ? tasksBoardPosition.right - boundingValue.left
      : 0
    setTasksLeftSideClipPath(collapsedWithTasks)

    setCollapsed(isTasks ? collapsedWithDone > 0 : collapsedWithTasks > 0)
  }

  const handleMouseUp = (e: MouseEvent) => {
    const element = e.target as HTMLElement

    const isInsideTasksBoard =
      element.getBoundingClientRect().left >= tasksBoardPosition?.left &&
      element.getBoundingClientRect().left &&
      element.getBoundingClientRect().right <= tasksBoardPosition?.right
    const isInsideTodoBoard =
      element.getBoundingClientRect().left >= doneTodoPosition?.left &&
      element.getBoundingClientRect().left &&
      element.getBoundingClientRect().right <= doneTodoPosition?.right

    if (doneTodoPosition && isInsideTodoBoard) {
      addDone?.(item)
      const doneBoardChildren =
        document.querySelectorAll('.board__items')[1].children

      setTimeout(() => {
        playSoundEffect()
        setTimeout(
          () =>
            party.confetti(
              doneBoardChildren[
                doneBoardChildren.length - 1 || 0
              ] as HTMLElement
            ),
          300
        )
      })

      const taskBoardLength = removeTodo && removeTodo(item)

      if (taskBoardLength && taskBoardLength === 1) {
        playSoundEffect(
          'https://assets.mixkit.co/sfx/preview/mixkit-game-level-completed-2059.mp3'
        )
      }
    } else if (tasksBoardPosition && isInsideTasksBoard) {
      removeDone?.(item)
      addTask?.(item, false)
    }

    setCoords({ x: 0, y: 0, move: false })
    setDoneRightSideClipPath(0)
    setTasksLeftSideClipPath(0)

    document.onmousemove = null
  }

  const clipPathValue = isTasks
    ? coords.move &&
      `inset(0px ${getLeftSideClipPath(
        isTasks,
        doneRightSideClipPath
      )}px 0px 0px)`
    : coords.move &&
      `inset(0px 0px 0px ${getRightSideClipPath(
        isTasks,
        tasksLeftSideClipPath
      )}px)`

  return (
    <div
      className="board__item__cup"
      onMouseDown={(e) => {
        let element = e.target as HTMLElement

        if (!element.classList.length) {
          element = element.nextSibling as HTMLElement
        }

        document.onmousemove = (ev) => handleMouseMove(ev, e, element)
        document.onmouseup = handleMouseUp
      }}
      style={{
        cursor: coords.move ? 'grabbing' : 'grab',
      }}
    >
      {boardName === 'done' && <Line />}
      {/* placeholder */}
      {coords.move && (
        <div
          className={`board__item board__item--${boardName} board__item__placeholder--${boardName}`}
        >
          {item}
        </div>
      )}
      {/* actual item */}
      <div
        className={`board__item board__item--${boardName}`}
        style={{
          position: coords.move ? 'absolute' : 'inherit',
          left: coords.x + 'px',
          top: coords.y + 'px',
          // once the boardItem is added to the opposite board, move this card to the front
          ...(collapsed && { zIndex: 2 }),
          // clip the container so it shows like it's transitioning into the other board
          clipPath: clipPathValue || 'none',
          opacity: getOpacity(isDone, coords),
        }}
      >
        {item}
      </div>
      {/* clip-path transition item */}
      <div
        className={`board__item board__item--${isTasks ? 'done' : 'tasks'} ${
          isDone && !coords.move && 'opacity-0'
        }`}
        style={{
          position: 'absolute',
          left: coords.x + 'px',
          top: coords.y + 'px',
          // moves the card to the back if the boardItem didn't collapse with the opposite board
          ...(!collapsed && { zIndex: 0 }),
        }}
      >
        {item}
      </div>
    </div>
  )
}
