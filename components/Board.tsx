/* eslint-disable react/jsx-no-undef */
"use client";
import { useBoardStore } from "@/store/BoardStore";
import React, { useEffect } from "react";
import { DragDropContext, DropResult, Droppable } from "react-beautiful-dnd";
import Column from "./Column";

function Board() {
  /**
   * Got the state function from zustand boardState.
   */
  const [board, getboard, setBoardState, updateTodoInDB] = useBoardStore((state: any) => [
    state.board,
    state.getBoard,
    state.setBoardState as (searchString: string) => void,
    state.updateTodoInDB,
  ]);

  useEffect(() => {
    getboard();
  }, [getboard]);
  const handleOnDragEnd = (result: DropResult) => {
    const { destination, source, type } = result;

    // No changes if card is dragged outside of board
    if (!destination) return;

    // Handle column drag
    if (type === "column") {
      const entries = Array.from(board.columns.entries());
      const [removed] = entries.splice(source.index, 1);
      entries.splice(destination.index, 0, removed);
      const rearrangedColumns = new Map(entries as any);
      setBoardState({ ...board, columns: rearrangedColumns });
    }

    // Indexes are stores as numbers instead of ids with DND library
    const columns = Array.from(board.columns);
    const startColIndex: any = columns[Number(source.droppableId)];
    const finishColIndex: any = columns[Number(destination.droppableId)];

    let startCol: any = null

    if (startColIndex && startColIndex[0]) {
      startCol = {
        id: startColIndex[0],
        todos: startColIndex[1].todos,
      };
    }

    let finishCol: any = null

    if (finishColIndex && finishColIndex[0]) {
      finishCol = {
        id: finishColIndex[0],
        todos: finishColIndex[1].todos,
      };
    }

    if (!startCol || !finishCol) return;

    if (source.index === destination.index && startCol === finishCol) return;

    const newTodos = startCol.todos;
    const [todoMoved] = newTodos.splice(source.index, 1);

    if (startCol.id === finishCol.id) {
      // Same column task drag
      newTodos.splice(destination.index, 0, todoMoved);

      const newCol = {
        id: startCol.id,
        todos: newTodos,
      };

      const newColumns = new Map(board.columns);
      newColumns.set(startCol.id, newCol);

      setBoardState({ ...board, columns: newColumns });
    } else {
      // Dragging to a nother column
      const finishTodos = Array.from(finishCol.todos);
      finishTodos.splice(destination.index, 0, todoMoved);

      const newCol = {
        id: startCol.id,
        todos: newTodos,
      };

      const newColumns = new Map(board.columns);

      newColumns.set(startCol.id, newCol);
      newColumns.set(finishCol.id, {
        id: finishCol.id,
        todos: finishTodos,
      });

      //   Update in DB
      updateTodoInDB(todoMoved, finishCol.id);

      setBoardState({ ...board, columns: newColumns });
    }
  };

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Droppable droppableId='board' direction='horizontal' type='column'>
        {(provided) => (
          <div
            className='grid grid-cols-1 md:grid-cols-3 gap-5 max-w-7xl mx-auto '
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {Array.from(board.columns.entries()).map(([id, column], index) => (
              <Column
                key={id}
                id={id as TypedColumn}
                todos={(column as Column).todos}
                index={index}
              />
            ))}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default Board;
