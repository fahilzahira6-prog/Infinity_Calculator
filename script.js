/* GET HTML ELEMENTS*/
const previousDisplay = document.getElementById("previousDisplay");
const currentDisplay = document.getElementById("currentDisplay");

const numberButtons = document.querySelectorAll("[data-number]");
const operatorButtons = document.querySelectorAll("[data-operation]");
const actionButtons = document.querySelectorAll("[data-action]");

const themeToggle = document.getElementById("themeToggle");

const calculatorLink = document.getElementById("calculatorLink");
const historyLink = document.getElementById("historyLink");
const converterLink = document.getElementById("converterLink");
const settingsLink = document.getElementById("settingsLink");

const calculatorPage = document.getElementById("calculatorPage");
const historyPage = document.getElementById("historyPage");
const converterPage = document.getElementById("converterPage");
const settingsPage = document.getElementById("settingsPage");

const historyList = document.getElementById("historyList");
const clearHistoryBtn = document.getElementById("clearHistoryBtn");

const converterInput = document.getElementById("converterInput");
const converterType = document.getElementById("converterType");
const convertBtn = document.getElementById("convertBtn");
const converterResult = document.getElementById("converterResult");

const themeSelect = document.getElementById("themeSelect");


/*  VARIABLES */
let currentNumber = "";
let previousNumber = "";
let operation = null;
/* HISTORY */
let history = JSON.parse(
    localStorage.getItem("calculatorHistory")
) || [];

function updateDisplay(){
    currentDisplay.textContent = currentNumber || "0";
    if(previousNumber && operation){
        previousDisplay.textContent =`${previousNumber} ${operation}`;
    }
    else{
        previousDisplay.textContent = "";
    }
}
function addNumber(number){
    if(number === "." && currentNumber.includes(".")){
        return;
    }
    currentNumber += number;
    updateDisplay();
}

function chooseOperation(operator){
    if(currentNumber === "") return;
    if(previousNumber !== ""){
        calculate();
    }
    previousNumber = currentNumber;
    currentNumber = "";
    operation = operator;
    updateDisplay();
}

function calculate(){
    const firstNumber = parseFloat(previousNumber);
    const secondNumber = parseFloat(currentNumber);
    if(isNaN(firstNumber) || isNaN(secondNumber)){
        return;
    }
    let result = 0;
    switch(operation){
        case "+":
            result = firstNumber + secondNumber;
            break;
        case "-":
            result = firstNumber - secondNumber;
            break;
        case "*":
            result = firstNumber * secondNumber;
            break;
        case "/":
            if(secondNumber === 0){
                alert("Cannot divide by zero.");
                return;
            }
            result = firstNumber / secondNumber;
            break;
    }
    const finalResult = Number(
        result.toFixed(10)
    ).toString();
    saveHistory(
        `${previousNumber} ${operation} ${currentNumber}`,
        finalResult
    );
    currentNumber = finalResult;
    previousNumber = "";
    operation = null;
    updateDisplay();
}

function equals(){
    calculate();
}

function clearCalculator(){
    currentNumber = "";
    previousNumber = "";
    operation = null;
    updateDisplay();
}

function backspace(){
    currentNumber = currentNumber.slice( 0, -1 );
    updateDisplay();
}

function changeSign(){
    if(currentNumber === "") return;
    currentNumber = (parseFloat(currentNumber) * -1).toString();
    updateDisplay();
}

numberButtons.forEach(button=>{
    button.addEventListener("click",()=>{
        addNumber( button.dataset.number );
    });
});

operatorButtons.forEach(button=>{
    button.addEventListener("click",()=>{
        chooseOperation( button.dataset.operation );
    });
});

actionButtons.forEach(button=>{
    button.addEventListener("click",()=>{
        const action = button.dataset.action;
        switch(action){
            case "clear":
                clearCalculator();
                break;
            case "backspace":
                backspace();
                break;
            case "sign":
                changeSign();
                break;
            case "equals":
                equals();
                break;
        }
    });
});

/*  HISTORY*/
function saveHistory(expression, result){
    history.unshift({
        expression, result
    });
    localStorage.setItem(
        "calculatorHistory",
        JSON.stringify(history)
    );
    displayHistory();
}

function displayHistory(){
    historyList.innerHTML = "";
    if(history.length === 0){
        historyList.innerHTML = `
            <div class="empty-message">
                <i class="fa-regular fa-clock"></i>
                <p>No calculations yet.</p>
            </div> `;
        return;
    }
    history.forEach(item=>{
        const historyItem = document.createElement("div");
        historyItem.className = "history-item";
        historyItem.innerHTML = `
            <span class="history-expression">
                ${item.expression}
            </span>
            <span class="history-result">
                = ${item.result}
            </span>`;
        historyList.appendChild(historyItem);
    });
}
clearHistoryBtn.addEventListener("click",()=>{
    history = [];
    localStorage.removeItem(
        "calculatorHistory"
    );
    displayHistory();
});

/*  NAVIGATION*/
function showPage(selectedPage, selectedLink){
    document.querySelectorAll(".page").forEach(page=>{
        page.classList.remove("active-page");
    });
    selectedPage.classList.add("active-page");
    document.querySelectorAll(".nav-link").forEach(link=>{
        link.classList.remove("active");
    });
    selectedLink.classList.add("active");
}

calculatorLink.addEventListener("click",()=>{
    showPage(
        calculatorPage,
        calculatorLink
    );
});

historyLink.addEventListener("click",()=>{
    showPage(
        historyPage,historyLink
    );
});

converterLink.addEventListener("click",()=>{
    showPage(
        converterPage,converterLink
    );
});

settingsLink.addEventListener("click",()=>{
    showPage(
        settingsPage, settingsLink
    );
});
displayHistory();

/* UNIT CONVERTER*/
function convertValue(){
    const value = parseFloat(converterInput.value);
    if(isNaN(value)){
        converterResult.textContent ="Result : Please enter a valid number.";
        return;
    }
    let result;
    switch(converterType.value){
        case "cm-m":
            result = value / 100;
            converterResult.textContent = `Result : ${result} m`;
            break;
        case "m-cm":
            result = value * 100;
            converterResult.textContent =`Result : ${result} cm`;
            break;
        case "kg-g":
            result = value * 1000;
            converterResult.textContent =`Result : ${result} g`;
            break;
        case "g-kg":
            result = value / 1000;
            converterResult.textContent =`Result : ${result} kg`;
            break;
        case "c-f":
            result = (value * 9 / 5) + 32;
            converterResult.textContent = `Result : ${result.toFixed(2)} °F`;
            break;
        case "f-c":
            result = (value - 32) * 5 / 9;
            converterResult.textContent =`Result : ${result.toFixed(2)} °C`;
            break;
    }
}
convertBtn.addEventListener("click", convertValue);

function applyTheme(theme){
    if(theme === "dark"){
        document.body.classList.add("dark");
    }
    else if(theme === "light"){
        document.body.classList.remove("dark");
    }
    else{
        const prefersDark = window.matchMedia( "(prefers-color-scheme: dark)").matches;
        document.body.classList.toggle("dark", prefersDark
        );
    }
    const icon = themeToggle.querySelector("i");
    if(document.body.classList.contains("dark")){
        icon.classList.remove("fa-moon");
        icon.classList.add("fa-sun");
    }
    else{
        icon.classList.remove("fa-sun");
        icon.classList.add("fa-moon");
    }
}

/* SETTINGS*/
const savedTheme =
    localStorage.getItem("theme") || "system";
themeSelect.value = savedTheme;
applyTheme(savedTheme);
themeSelect.addEventListener("change",()=>{
    localStorage.setItem(
        "theme",
        themeSelect.value
    );
    applyTheme(
        themeSelect.value
    );
});

themeToggle.addEventListener("click",()=>{
    const nextTheme =
        document.body.classList.contains("dark")
        ? "light"
        : "dark";
    themeSelect.value = nextTheme;
    localStorage.setItem(
        "theme",
        nextTheme
    );
    applyTheme(nextTheme);
});

/* KEYBOARD SUPPORT*/
document.addEventListener("keydown",(event)=>{
    const key = event.key;
    if(key >= "0" && key <= "9"){
        addNumber(key);
    }
    if(key === "."){
        addNumber(".");
    }
    if(key === "+" || key === "-" || key === "*" ||key === "/"){
        chooseOperation(key);
    }
    if( key === "Enter" ||key === "="){
        calculate();
    }
    if(key === "Backspace"){
        backspace();
    }
    if(key === "Escape"){
        clearCalculator();
    }
});
updateDisplay();
displayHistory();