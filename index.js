const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

console.log("hello");

const input = document.getElementById('user-input'); // Remove the '#' symbol
const btn = document.getElementById('send-button');   // Remove the '#' symbol

btn.addEventListener('click', async () => {
  let text = input.value;

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    const result = await model.generateContent(text);
    console.log(await result.response.text());  // Awaiting the response's text method
  } catch (error) {
    console.error("Error generating content:", error);
  }
});

async function generateStory() {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = "As 35 is my BMI, according to my BMI category give me veg and non veg diet plan, and healthy shake recommendations and also supplements recommendations you can give me in general that does not need any kind of medical";

  try {
    const result = await model.generateContent(prompt);
    console.log(await result.response.text());  // Awaiting the response's text method
  } catch (error) {
    console.error("Error generating content:", error);
  }
}

generateStory();
