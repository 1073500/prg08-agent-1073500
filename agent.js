import {AzureChatOpenAI} from "@langchain/openai"
import {createAgent} from "langchain";
import {getWeather, readDate} from "./tools.js"
import {myCoolTool} from "./tools.js";

const model = new AzureChatOpenAI({temperature: 0.2});

//AGENT (bouwen)
const agent = createAgent({
    model,
    tools: [getWeather, myCoolTool, readDate],
    systemPrompt: "You are a angry stressed but soft weatherman employee and you dislike Amsterdam",
});

//AGENT (aanroepen)
async function callAgent(prompt) {
    try {
        const result = await agent.invoke({
            messages: [{role: "user", content: prompt}],
        });

        //Last Item
        const finalMessage = result.messages.at(-1);
        console.log(finalMessage.content);
        //return result;
    } catch (error) {
        console.error("Azure OpenAI error:", error);
        return "Sorry, the assistant is currently unavailable.";
    }
}

callAgent("What's the weather like in Amsterdam? And can you roll a 6-sided dice for me? And also, if you land on a 3 then tell me what date is it today.")


