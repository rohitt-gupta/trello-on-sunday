import { databases } from "@/appwrite"

/**
 * Os in this function we are going to pull the data from database / appWrite cloud.
 * databases is some variable we are importing from the @appwrite module
 * .listDocuments taken 2 parameters and afterwards some queries as well.
 * .listDocuments(databaseID, collectionId)
 */
export const getTodosGroupedByColumn = async () => {
  const data = await databases.listDocuments(
    process.env.NEXT_PUBLIC_DATABASE_ID!, process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!
  );

  const todos = data.documents;
  // console.log("todos", todos);

  /**
   * todos= [
    {
        "status": "todo",
        "title": "Take the dogs out for a walk",
        "image": null,
        "$id": "64724779b625e1e39f95",
        "$createdAt": "2023-05-27T18:10:01.747+00:00",
        "$updatedAt": "2023-05-27T18:10:01.747+00:00",
        "$permissions": [],
        "$collectionId": "647246aed92ca2c06143",
        "$databaseId": "64724695cf2d3cc14f25"
    },
    {
        "status": "inprogress",
        "title": "Crushing The Trello Clone build",
        "image": null,
        "$id": "647c5be1d12bbf9770e9",
        "$createdAt": "2023-06-04T09:39:45.857+00:00",
        "$updatedAt": "2023-06-04T09:39:45.857+00:00",
        "$permissions": [],
        "$collectionId": "647246aed92ca2c06143",
        "$databaseId": "64724695cf2d3cc14f25"
    },
    {
        "status": "todo",
        "title": "Go to the gym",
        "image": null,
        "$id": "647c5c6754571323cc51",
        "$createdAt": "2023-06-04T09:41:59.346+00:00",
        "$updatedAt": "2023-06-04T09:41:59.346+00:00",
        "$permissions": [],
        "$collectionId": "647246aed92ca2c06143",
        "$databaseId": "64724695cf2d3cc14f25"
    },
    {
        "status": "done",
        "title": "Did Dance practice today",
        "image": null,
        "$id": "647c5c7bae73e3d47577",
        "$createdAt": "2023-06-04T09:42:19.715+00:00",
        "$updatedAt": "2023-06-04T09:42:19.715+00:00",
        "$permissions": [],
        "$collectionId": "647246aed92ca2c06143",
        "$databaseId": "64724695cf2d3cc14f25"
    }
]
   */
  /**
   * Map(3) {'todo' => {…}, 'inprogress' => {…}, 'done' => {…}}
   * {'todo' => 
   * {    "id": "todo",
    "todos": [
        {
            "$id": "64724779b625e1e39f95",
            "$createdAt": "2023-05-27T18:10:01.747+00:00",
            "title": "Take the dogs out for a walk",
            "status": "todo"
        },
        {
            "$id": "647c5c6754571323cc51",
            "$createdAt": "2023-06-04T09:41:59.346+00:00",
            "title": "Go to the gym",
            "status": "todo"
        }
    ] }
}
   */
  const columns = todos.reduce((acc, todo) => {
    if (!acc.get(todo.status)) {
      acc.set(todo.status, {
        id: todo.status,
        todos: []
      })
    }
    acc.get(todo.status)!.todos.push({
      $id: todo.$id,
      $createdAt: todo.$createdAt,
      title: todo.title,
      status: todo.status,
      ...(todo.image) && { image: JSON.parse(todo.image) }
    });
    return acc;
  }, new Map<TypedColumn, Column>())



  // if the columns doesnt have  any inprogress, todo and done, add them with empty todos
  const columntypes: TypedColumn[] = ["todo", 'inprogress', 'done']
  for (const columntype of columntypes) {
    if (!columns.get(columntype)) {
      columns.set(columntype, {
        id: columntype,
        todos: [],
      })
    }
  }

  // now we will always have a map of three
  // now we have to sort the columns 
  // console.log("todoAfter", columns);

  const board: Board = {
    columns: columns,
  }

  return board
}