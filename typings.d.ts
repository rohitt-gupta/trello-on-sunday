
/**
 * These type defs can be accessed in any file without importing 
 */

interface Board {
  columns: Map<TypedColumn, Column>
}

type TypedColumn = "todo" | "inprogress" | "done"

interface Column {
  id: TypedColumn;
  todos: Todo[];
}

interface Todo {
  $id: string;
  $createdAt: string;
  title: string;
  status: TypedColumn;
  image?: Image; // "?" denotes that this property is optional
}

interface Image {
  bucketId: string;
  fileId: string;
}