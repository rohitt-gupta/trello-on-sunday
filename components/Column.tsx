import React from 'react'
import { Draggable } from 'react-beautiful-dnd'

type ColumnProps = {
  id: TypedColumn,
  todos: Todo[],
  index: number,
}

function Column(props: ColumnProps) {
  const { id, todos, index } = props
  return (
    <Draggable>
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >

          {/* {render droppable todos in the column} */}
        </div>
      )}

    </Draggable>
  )
}

export default Column