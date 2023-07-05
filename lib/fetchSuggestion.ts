import formatTodosForAI from "./formatTodosForAI";

const fetchSuggestion = async (board: Board) => {
  const todos = formatTodosForAI(board);
  console.log("FORMATTED TODOS to send >>> ", todos);

  const res = await fetch("/api/generateSummary", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ todos }),
  });

  const responseJson = await res.json();
  console.log("API Response:", responseJson);

  const { message } = responseJson.choices[0];

  return message.content;
};
export default fetchSuggestion;