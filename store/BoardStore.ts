import { ID, databases, storage } from '@/appwrite';
import { getTodosGroupedByColumn } from '@/lib/getTodosGroupedByColumn';
import uploadImage from '@/lib/uploadImage';
import { todo } from 'node:test';
import { create } from 'zustand'


export interface BoardState {
  board: Board;
  getBoard: () => void;
  setBoardState: (board: Board) => void;
  updateTodoInDB: (todo: Todo, columnId: TypedColumn) => void;
  newTaskInput: string;
  setNewTaskInput: (input: string) => void;
  image: File | null;

  searchString: string;
  setSearchString: (searchString: string) => void;

  addTask: (todo: string, columnId: TypedColumn, image?: File | null) => void;
  deleteTask: (taskIndex: number, todoId: Todo, id: TypedColumn) => void;

  newTaskType: TypedColumn;
  setNewTaskType: (columnId: TypedColumn) => void;

  setImage: (image: File | null) => void;

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

export const useBoardStore = create<BoardState>()((set, get) => ({
  board: {
    columns: new Map<TypedColumn, Column>()
  },
  image: null,
  searchString: '',
  newTaskInput: "",
  newTaskType: "todo",
  setNewTaskInput: (input: string) => set({ newTaskInput: input }),
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

    set({ board: { columns: newColumns as Map<TypedColumn, Column> } });

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
  addTask: async (todo: string, columnId: TypedColumn, image?: File | null) => {
    let file: Image | undefined;

    if (image) {
      const fileUploaded = await uploadImage(image);
      if (fileUploaded) {
        file = {
          bucketId: fileUploaded.bucketId,
          fileId: fileUploaded.$id,
        };
      }
    }

    const { $id } = await databases.createDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
      ID.unique(),
      {
        title: todo,
        status: columnId,
        // include image if it exisits
        ...(file && { image: JSON.stringify(file) }),
      }
    );

    set({ newTaskInput: "" });

    set((state) => {
      const newColumns = new Map(state.board.columns);

      const newTodo: Todo = {
        $id,
        $createdAt: new Date().toISOString(),
        title: todo,
        status: columnId,
        // include image if exists
        ...(file && { image: file }),
      };

      const column = newColumns.get(columnId);

      if (!column) {
        newColumns.set(columnId, {
          id: columnId,
          todos: [newTodo],
        });
      } else {
        newColumns.get(columnId)?.todos.push(newTodo);
      }

      return {
        board: {
          columns: newColumns,
        },
      };
    });
  },

  // addTask: async (todo, columnId, image) => {
  //   let file: Image | undefined;

  //   // image upload to appwrite section 
  //   if (image) {
  //     const fileUploaded = await uploadImage(image);
  //     if (fileUploaded) {
  //       file = {
  //         bucketId: fileUploaded.bucketId,
  //         fileId: fileUploaded.$id,
  //       }
  //     }
  //   }

  //   // creating new document
  //   const { $id } = await databases.createDocument(
  //     process.env.NEXT_PUBLIC_DATABASE_ID!,
  //     process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
  //     ID.unique(),
  //     {
  //       title: todo,
  //       status: columnId,
  //       ...(file && { image: JSON.stringify(file) }),
  //     }
  //   );

  //   set({ newTaskInput: "" });

  //   set((state) => {

  //   })

  // },
  updateTodoInDB: async (todo, columnId) => {
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
  setImage: (image) => set({ image }),
  setNewTaskType: (columnId) => set({ newTaskType: columnId }),
}))

