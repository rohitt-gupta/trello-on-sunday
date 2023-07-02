/* eslint-disable react/jsx-no-undef */
'use client'
import { useBoardStore } from '@/store/BoardStore'
import React, { useEffect } from 'react'
import { DragDropContext, DropResult, Droppable } from "react-beautiful-dnd"
import Column from './Column';


function Board() {
  /**
   * Got the state function from zustand boardState.
   */
  const [board, getboard] = useBoardStore((state: any) => [
    state.board,
    state.getBoard,
  ]
  );
  console.log("board", board);


  useEffect(() => {
    getboard();
  }, [getboard])
  // return <h1>HelloBoard</h1>

  const handleOnDragEnd = (result: DropResult, provided: unknown) => {

  }

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Droppable droppableId='board' direction='horizontal' type='column'>
        {(provided) =>
          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-7xl mx-auto "
            {...provided.droppableProps}
            ref={provided.innerRef}
          >{
              Array.from(board.columns.entries()).map(([id, column], index) => (
                <Column
                  key={id}
                  id={id}
                  todos={column.todos}
                  index={index}
                />
              ))}
          </div>
        }
      </Droppable>
    </DragDropContext>
  );
}

export default Board