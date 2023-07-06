import { Configuration, OpenAIApi } from "openai";

const confiuration = new Configuration({
  organization: "org-4568",
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(confiuration);

export default openai;