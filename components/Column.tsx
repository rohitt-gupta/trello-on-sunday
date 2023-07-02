import React from 'react'
import { Draggable, Droppable } from 'react-beautiful-dnd'

type ColumnProps = {
  id: TypedColumn,
  todos: Todo[],
  index: number,
}

function Column(props: ColumnProps) {
  const { id, todos, index } = props
  return (
    <Draggable draggableId={id} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <Droppable droppableId={index.toString()} type='card'>
            {(provided, snapshot) => (

              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={`p-2 rounded-2xl shadow-sm ${snapshot.isDraggingOver ? 'bg-green-200' : 'bg-white/50'}`}
              >
                <h2>
                  {id}
                </h2>

              </div>
            )}
          </Droppable >
          {/* {render droppable todos in the column} */}
        </div>
      )}

    </Draggable>
  )
}

export default Column