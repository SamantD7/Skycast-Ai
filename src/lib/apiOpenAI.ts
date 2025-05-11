
// Using OpenAI API for AI insights and chatbot

// Constants
const API_URL = "https://api.openai.com/v1/chat/completions";
const DEFAULT_MODEL = "gpt-3.5-turbo";

// Types
export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface ChatResponse {
  message: ChatMessage;
  error?: string;
}

// Function to generate weather insights
export async function generateWeatherInsights(
  weatherData: any,
  apiKey: string
): Promise<string> {
  try {
    const prompt = `
      Based on the following detailed weather data, provide 3-4 practical, personalized insights or recommendations:
      
      City: ${weatherData.current.city}, ${weatherData.current.country}
      Current Temperature: ${weatherData.current.temp}°C (feels like ${weatherData.current.feels_like}°C)
      Humidity: ${weatherData.current.humidity}%
      Wind: ${weatherData.current.wind_speed} m/s
      Weather Condition: ${weatherData.current.description}
      
      Forecast for next few days:
      ${weatherData.forecast?.slice(0, 3).map((day: any) => 
        `- ${new Date(day.dt * 1000).toLocaleDateString()}: ${day.temp}°C, ${day.description}, Precipitation: ${Math.round(day.pop * 100)}%`
      ).join('\n')}
      
      Provide actionable weather advice, clothing recommendations, activity suggestions, health precautions, or travel tips based on these specific conditions.
      Format as bullet points, with each insight being concise (15-20 words). Focus on practical advice that's immediately useful.
    `;

    const messages: ChatMessage[] = [
      { 
        role: "system", 
        content: "You are a helpful weather assistant providing brief, practical insights based on weather data. Focus on actionable recommendations, safety tips, and personalized advice. Be conversational but concise." 
      },
      { role: "user", content: prompt }
    ];

    console.log("Sending request to OpenAI API");
    
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        messages: messages,
        max_tokens: 250,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error("OpenAI API error:", data);
      throw new Error(data.error?.message || "Failed to generate insights");
    }
    
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error generating insights:", error);
    throw error;
  }
}

// Function to send chat messages to OpenAI
export async function sendChatMessage(
  messages: ChatMessage[],
  weatherData: any,
  apiKey: string
): Promise<ChatResponse> {
  try {
    // Add weather context to the system message
    const weatherContext = `
      Current weather in ${weatherData.current.city}, ${weatherData.current.country}:
      - Temperature: ${weatherData.current.temp}°C (feels like ${weatherData.current.feels_like}°C)
      - Condition: ${weatherData.current.description}
      - Humidity: ${weatherData.current.humidity}%
      - Wind: ${weatherData.current.wind_speed} m/s
      
      3-day forecast:
      ${weatherData.forecast?.slice(0, 3).map((day: any) => 
        `- ${new Date(day.dt * 1000).toLocaleDateString()}: ${day.temp}°C, ${day.description}, Precipitation chance: ${Math.round(day.pop * 100)}%`
      ).join('\n')}
    `;

    // Add or update the system message with weather context
    let updatedMessages = [...messages];
    const systemMessageIndex = updatedMessages.findIndex(msg => msg.role === "system");
    
    if (systemMessageIndex >= 0) {
      updatedMessages[systemMessageIndex] = {
        ...updatedMessages[systemMessageIndex],
        content: `${updatedMessages[systemMessageIndex].content}\n\nWeather Context: ${weatherContext}`,
      };
    } else {
      updatedMessages.unshift({
        role: "system",
        content: `You are a helpful weather assistant providing advice based on current and forecasted weather conditions. Weather Context: ${weatherContext}`,
      });
    }

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        messages: updatedMessages,
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || "Failed to get response");
    }
    
    return {
      message: data.choices[0].message,
    };
  } catch (error: any) {
    console.error("Error in chat:", error);
    return {
      message: { role: "assistant", content: "I'm sorry, I couldn't process your request at this time." },
      error: error.message,
    };
  }
}
