export const AddTodoInput = ({
  newTodo,
  setNewTodo,
  setAddMode,
  addTodo,
}: {
  newTodo: string
  setNewTodo: (value: string) => void
  setAddMode: (value: boolean) => void
  addTodo?: (value: string, first: boolean) => void
}) => {
  const handleKeyDown = (e: unknown) => {
    const event = e as React.KeyboardEvent<HTMLInputElement>

    if (event.key !== 'Enter') {
      return
    }

    setAddMode(false)
    addTodo?.(newTodo, true)
    setNewTodo('')
  }

  const handleChange = (e: unknown) => {
    const event = e as React.ChangeEvent<HTMLInputElement>

    setNewTodo(event.target.value)
  }

  return (
    <div className="board__input__wrapper">
      <input
        className="board__input"
        value={newTodo}
        onChange={handleChange}
        placeholder="Enter your task..."
        onKeyDown={handleKeyDown}
        autoFocus
      />
    </div>
  )
}
