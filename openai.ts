import { Configuration, OpenAIApi } from "openai";

const confiuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(confiuration);

export default openai;