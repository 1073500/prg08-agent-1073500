import 'dotenv/config';
import {AzureChatOpenAI} from "@langchain/openai"
import {createAgent} from "langchain";
import { MemorySaver } from "@langchain/langgraph";
import { SqliteSaver } from "@langchain/langgraph-checkpoint-sqlite";
import {getWeather, readDate, myCoolTool, myToolResponse, retrieve} from "./tools.js"

const checkpointer = new MemorySaver();
const model = new AzureChatOpenAI({temperature: 0.2});

//AGENT (bouwen)
const agent = createAgent({
    model,
    tools: [getWeather, myCoolTool, readDate, retrieve],
    checkpointer,
    responseFormat: myToolResponse,
    system: "You are an assistant who can use the retrieve tool to find info about gemstones and use the get_weather tool to determine if a gemstone could be located in a specific weather condition ",
});

//AGENT (aanroepen)
export async function callAgent(prompt, thread_id = "1") {
    try {
        const result = await agent.invoke({
                messages: [{role: "user", content: prompt}],
            },
            {configurable: {thread_id: thread_id}}
        );
        console.log(result.structuredResponse);
        //Last Item
        const finalMessage = result.messages.at(-1);
        console.log(finalMessage.content);
        return finalMessage.content;

        // result.structuredResponse

    } catch (error) {
        console.error("Azure OpenAI error:", error);
        return "Sorry, the assistant is currently unavailable.";
    }
}


//callAgent("What's the weather like in Amsterdam? And can you roll a 6-sided dice for me? And also, if you land on a 3 then tell me what date is it today.")
