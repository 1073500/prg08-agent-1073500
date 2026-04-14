import * as z from "zod";
import {tool} from "langchain";

//DYNAMIC WEATHER TOOL
export const getWeather = tool(
    async ({city}) => {
        const apiKey = process.env.MY_WEATHER_KEY;
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
        const response = await fetch(url);
        const data = await response.json();
        data.weather = data.weather || null;
        data.temp = data.temp || null;
        if (data.weather) {
            console.log(`Het is ${data.weather[0].description} en ${data.main.temp}°C in ${city}.`);
        } else {
            console.log(`Sorry, ik kon het weer voor ${city} niet ophalen.`);
        }

        // console.log(`🔧 de weather tool wordt uitgevoerd!`)
        return `The weather in ${city} is!`
    },
    {
        name: "get_weather", //naam tool
        description: "Get the weather for a given city", //wat kan je ermee
        schema:
            z.object({
                city: z.string().describe("Name of the city to get the weather for"),
            })
    },
);

//DICE TOOL
export const myCoolTool = tool (
    ({ sides }) => {
    console.log(`🔧  Ik rol een ${sides}-sided dobbelsteen!`)
    return Math.floor(Math.random() * sides) +1
    },
    {
        name: "my_cool_tool", //naam tool
        description: "Roll a dice!", //wat kan je ermee
        schema: {
            type: "object",
            properties: {
                sides: { type: "string" },
            },
            required: ["sides"],
        },
    },
);

//READ DATE TOOL
export const readDate = tool (

    ({  }) => {
        const today = new Date();
        const readableDate = today.toLocaleDateString("nl-NL", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });

        console.log(`🔧 de date tool wordt uitgevoerd!`)
        return `het is vandaag ${readableDate}!`
    },
    {
        name: "read_date", //naam tool
        description: "What is today's date", //wat kan je ermee
        schema: {
            type: "object",
            properties: {
                city: { type: "string" },
            },
        },
    },
);
