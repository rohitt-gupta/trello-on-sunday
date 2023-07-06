import { databases, storage } from '@/appwrite';
import { getTodosGroupedByColumn } from '@/lib/getTodosGroupedByColumn';
import { create } from 'zustand'


export interface BoardState {
  board: Board;
  getBoard: () => void;
  setBoardState: (board: Board) => void;
  updateTodoInDB: (todo: Todo, columnId: TypedColumn) => void;

  searchString: string;
  setSearchString: (searchString: string) => void;


  deleteTask: (taskIndex: number, todoId: Todo, id: TypedColumn) => void;


}

/**
 * This is a board state file
 * this is all we need to using Zustand as a state management lib.
 * It is very easy to use and implemnent.
 * 
 * Step 1: create the store just like the below function
 * Using create which is imported from zustand.
 * inside this create we set the variables or global states.
 * board is object with columns whth the given type def
 * and getboard is a function to get fetch the board data from appwrite cloud.
 * and then in the end setting the board to board.
 * 
 * 
 * While using it in some other component.
 * const getBoard = useBoardStore((state)=>state.getBoard).
 * We got our function.
 */

export const useBoardStore = create((set, get) => ({
  board: {
    columns: new Map<TypedColumn, Column>()
  },

  searchString: '',
  setSearchString: (searchString: string) => set({ searchString }),


  getBoard: async () => {
    const board = await getTodosGroupedByColumn();
    set({ board });
  },
  setBoardState: (board: Board) => set({ board }),

  deleteTask: async (taskIndex: number, todo: Todo, id: TypedColumn) => {
    console.log(taskIndex, todo, id);

    const newColumns = new Map((get() as any).board.columns);

    newColumns.get(id)?.todos.splice(taskIndex, 1);

    set({ board: { columns: newColumns } });

    if (todo.image) {
      await storage.deleteFile(todo.image.bucketId, todo.image.fileId)
    }

    console.log(todo.image);


    await databases.deleteDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
      todo.$id
    )


  },

  updateTodoInDB: async (todo: Todo, columnId: TypedColumn) => {
    await databases.updateDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
      todo.$id,
      {
        title: todo.title,
        status: columnId,
      }
    )
  },
}))

