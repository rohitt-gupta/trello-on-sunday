// import { openai } from "@/openai";
import { NextResponse } from "next/server";
import OpenAI from 'openai';

export async function POST(request: Request) {
  // todos in the body of the POST req
  const { todos } = await request.json();
  // console.log("helloTodos", todos);

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          "When responding, welcome the user always as Rohit and say welcome to the Trello Clone App! Limit the response to 200 characters",
      },
      {
        role: "user",
        content: `Hi there, provide a summary of the following todos. Count how many todos are in each category such as To do, in progress, and done, then tell the user to have a productive day! Here's the data: ${JSON.stringify(
          todos
        )}`,
      },
    ],
  });

  // console.log("response", response);


  // const { data } = response;

  return NextResponse.json(response.choices[0].message);
}