import { getTodosGroupedByColumn } from '@/lib/getTodosGroupedByColumn';
import { create } from 'zustand'


export interface BoardState {
  board:Board;
  getBoard:()=> void;
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

export const useBoardStore = create((set) => ({
  board: {
    columns: new Map<TypedColumn, Column>()
  },
  getBoard: async() =>{
    const board  =await getTodosGroupedByColumn();
    set({board});
  }
}))

