document.addEventListener("DOMContentLoaded", function() {
  // BMI Calculation Function
  const bmiForm = document.getElementById('bmi-form');

  bmiForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const weight = parseFloat(document.getElementById('weight').value);
    const height = parseFloat(document.getElementById('height').value) / 100; // Convert height to meters
    const age = parseInt(document.getElementById('age').value);
    const gender = document.querySelector('input[name="gender"]:checked');

    if (!weight || !height || !age || !gender) {
      alert('Please fill out all fields.');
      return;
    }

    const bmi = weight / (height * height);
    let category = '';

    if (bmi < 18.5) {
      category = 'Underweight';
    } else if (bmi >= 18.5 && bmi < 24.9) {
      category = 'Normal';
    } else if (bmi >= 25 && bmi < 29.9) {
      category = 'Overweight';
    } else {
      category = 'Obese';
    }

    document.getElementById('bmi-value').textContent = bmi.toFixed(1);
    document.getElementById('bmi-category').textContent = category;
  });

  // Detect if the message is related to diet, nutrition, or fitness
  function isNutritionOrFitnessRelated(message) {
    const keywords = ['bmi','hi', 'weight', 'height', 'exercise', 'diet', 'nutrition', 'calories', 'meal', 'protein', 'carbohydrates', 'workout', 'fat', 'vitamins'];
    return keywords.some(keyword => message.toLowerCase().includes(keyword));
  }

  // Extract weight and height from the user's message for BMI calculation
  function extractBMIValues(message) {
    const weightRegex = /\bweight\s*(\d+)\b/;
    const heightRegex = /\bheight\s*(\d+)\b/;

    const weightMatch = message.match(weightRegex);
    const heightMatch = message.match(heightRegex);

    if (weightMatch && heightMatch) {
      return { weight: parseFloat(weightMatch[1]), height: parseFloat(heightMatch[1]) };
    }

    return null;
  }

  function sendMessage() {
    let userInput = document.getElementById("user-input").value;
    document.getElementById("user-input").value = "";

    if (userInput.trim() === "") return; // Prevent empty messages

    // Display user message in chat
    const chatBox = document.getElementById("chat-box");
    const userMessage = document.createElement("div");
    userMessage.className = "text-white bg-green-600 p-2 rounded-md self-end w-2/4 text-right shadow-md mb-2";
    userMessage.textContent = userInput;
    chatBox.appendChild(userMessage);

    // Add loading indicator
    const loadingMessage = document.createElement("div");
    loadingMessage.className = "text-white bg-gray-500 p-2 rounded-md self-start w-2/4 shadow-md mb-2";
    loadingMessage.textContent = "Fitmate is typing...";
    chatBox.appendChild(loadingMessage);
    chatBox.scrollTop = chatBox.scrollHeight;

    // Determine if the message is related to nutrition or fitness
    // const relatedToNutritionOrFitness = isNutritionOrFitnessRelated(userInput);
    let bmiValues = null;

    

    // If BMI-related values are present, calculate BMI
    if (bmiValues) {
      const { bmi, category } = calculateBMI(bmiValues.weight, bmiValues.height);
      chatBox.removeChild(loadingMessage);

      const serverMessage = document.createElement("div");
      serverMessage.className = "text-white bg-gray-700 p-2 rounded-md self-start w-2/3 shadow-md mb-2";
      serverMessage.textContent = `Your BMI is ${bmi}, which falls under the category of "${category}".`;
      chatBox.appendChild(serverMessage);
      chatBox.scrollTop = chatBox.scrollHeight;
    }  
    if(true){
      // If the message is related to nutrition or fitness, call ChatGPT backend
      fetch('http://localhost:3000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: userInput })
      })
        .then(response => response.json())
        .then(data => {
          chatBox.removeChild(loadingMessage);
          const serverMessage = document.createElement("div");
          serverMessage.className = "text-white bg-gray-700 p-2 rounded-md self-start w-2/3 shadow-md mb-2";
          serverMessage.textContent = `Fitmat: ${data.response}`;
          chatBox.appendChild(serverMessage);
          chatBox.scrollTop = chatBox.scrollHeight;
        })
        .catch(error => {
          console.error("Error:", error);
          chatBox.removeChild(loadingMessage);
          const errorMessage = document.createElement("div");
          errorMessage.className = "text-red-600 bg-gray-700 p-2 rounded-md self-start w-2/3 shadow-md mb-2";
          errorMessage.textContent = "Error: Unable to fetch response.";
          chatBox.appendChild(errorMessage);
        });
    } else {
      // Not related to nutrition or fitness, give a default response
      chatBox.removeChild(loadingMessage);
      const serverMessage = document.createElement("div");
      serverMessage.className = "text-white bg-gray-700 p-2 rounded-md self-start w-2/3 shadow-md mb-2";
      serverMessage.textContent = "I am your nutrition and fitness assistant. Please ask me about diet, nutrition, or fitness.";
      chatBox.appendChild(serverMessage);
      chatBox.scrollTop = chatBox.scrollHeight;
    }
  }

  // Event listeners
  document.getElementById("send-button").addEventListener("click", sendMessage);
  document.getElementById("user-input").addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
      sendMessage();
    }
  });
});
