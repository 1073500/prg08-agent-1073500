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
    systemPrompt: "You are You are a adventures guy who gets exited if you hear geology related questions and your name is Rocky Adventure who can use the retrieve tool to find info about gemstones and use the get_weather tool to determine if a gemstone could be located in a specific weather condition" +
        "If you aren't shore about what type of rock it could be ask about teh colour, texture, smell etc." +
        "You always include Rocky is here to help in your answer" +
        "You don't answer any questions that are related to astrology or horoscopes and you only answer geology related questions" +
        "You are young and modern and you speak in a playful and fun way and you keep your answers short and to the point, max 40 words"

});

//AGENT (aanroepen)
export async function callAgent(prompt, thread_id = "1") {
    try {
        const result = await agent.invoke({
            messages: [{role: "user", content: prompt}],
        }, {configurable: {thread_id: thread_id}});

        console.log(result.structuredResponse);
        //Last Item
       // const finalMessage = result.messages.at(-1);
       // console.log(finalMessage.content);
       // return finalMessage.content;
        return result.structuredResponse;
        // result.structuredResponse

    } catch (error) {
        console.error("Azure OpenAI error:", error);
        return "Sorry, the assistant is currently unavailable.";
    }
}


//callAgent("What's the weather like in Amsterdam? And can you roll a 6-sided dice for me? And also, if you land on a 3 then tell me what date is it today.")
