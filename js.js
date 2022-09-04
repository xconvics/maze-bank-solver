const resultsHorizontal = document.querySelectorAll("[data-results-horizontal]");
const resultsVertical = document.querySelectorAll("[data-results-vertical]");
const resultsHorizontalCopy = document.querySelectorAll("[data-results-horizontal-copy]");
const resultsVerticalCopy = document.querySelectorAll("[data-results-vertical-copy]");
const signsHorizontal = document.querySelectorAll("[data-sign-horizontal]");
const signsVertical = document.querySelectorAll("[data-sign-vertical]");
const outputs = document.querySelectorAll("input[disabled]")
const button = document.querySelector("[data-hack]");
let horizontalValidators = []
let verticalValidators = []
let validators = []


const inputs = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
]

let addSign;
let subSign;
let multSign;
let divSign;
let maxNumber;


const loadStorage = () => {
    addSign = localStorage.getItem("addSign") || "+";
    subSign = localStorage.getItem("subSign") || "-";
    multSign = localStorage.getItem("multSign") || "x";
    divSign = localStorage.getItem("divSign") || ":";
    maxNumber = Number(localStorage.getItem("maxNumber")) || 9;
}
loadStorage();

// // TODO: remove
// resultsHorizontal[0].value = 9;
// resultsHorizontal[1].value = 7;
// resultsHorizontal[2].value = 6;
// resultsVertical[0].value = 9;
// resultsVertical[1].value = 8;
// resultsVertical[2].value = 0;

// signsHorizontal[0].value = "+";
// signsHorizontal[1].value = "+";
// signsHorizontal[2].value = "+";
// signsHorizontal[3].value = "x";
// signsHorizontal[4].value = "+";
// signsHorizontal[5].value = "-";

// signsVertical[0].value = "+";
// signsVertical[1].value = "-";
// signsVertical[2].value = "-";
// signsVertical[3].value = "+";
// signsVertical[4].value = "+";
// signsVertical[5].value = "+";




const operation = (sign) => {
    switch(sign.toLowerCase()) {
        case addSign:
            return (a, b) => a + b;
        case subSign:
            return (a, b) => a - b;
        case multSign:
            return (a, b) => a * b;
        case divSign:
            return (a, b) => a / b;
    }
}

const validateInputs = () => {
    return [...signsHorizontal, ... signsVertical].every((signInput) => {
        const sign = signInput.value;
        return sign === addSign || sign === subSign || sign === multSign || sign === divSign;
    })
}

const initHack = () => {
    horizontalValidators = [];
    verticalValidators = [];
    validators = []

    resultsHorizontal.forEach((result, index) => {
        const value = Number(result.value);
        const sign1 = signsHorizontal[index * 2].value.toLowerCase();
        const sign2 = signsHorizontal[index * 2 + 1].value.toLowerCase();
    
        if(sign2 === multSign || sign2 === divSign) {
            horizontalValidators.push((inputs) => {
                const a = inputs[index][0];
                const b = inputs[index][1];
                const c = inputs[index][2];
                return operation(sign1)(a, operation(sign2)(b, c)) === value;
            });
        } else {
            horizontalValidators.push((inputs) => {
                const a = inputs[index][0];
                const b = inputs[index][1];
                const c = inputs[index][2];
                return operation(sign2)(operation(sign1)(a, b), c) === value;
            });
        }
    });
    
    resultsVertical.forEach((result, index) => {
        const value = Number(result.value);
        const sign1 = signsVertical[index].value.toLowerCase();
        const sign2 = signsVertical[index + 3].value.toLowerCase();
        
        if(sign2 === multSign || sign2 === divSign) {
            verticalValidators.push((inputs) => {
                const a = inputs[0][index];
                const b = inputs[1][index];
                const c = inputs[2][index];
                return operation(sign1)(a, operation(sign2)(b, c)) === value;
            });
        } else {
            verticalValidators.push((inputs) => {
                const a = inputs[0][index];
                const b = inputs[1][index];
                const c = inputs[2][index];
                return operation(sign2)(operation(sign1)(a, b), c) === value;
            });
        }
    });

    validators = [...horizontalValidators, ...verticalValidators];
}

const validate = (validators, inputs) => {
    return validators.every(validator => validator(inputs));
}


const hack = async () => {
    if(!validateInputs()) {
        alert(`Operation signs must be one of the following: ${addSign}, ${subSign}, ${multSign}, ${divSign}\nYou can change them in setting (left upper corner)`);
        return;
    }
    initHack();

    console.log("STARTING...")

    button.textContent = "HACKING...";

    setTimeout(async () => {
        const solved = bruteforceRecursive(inputs, 0, 0);

        console.log("DONE")
    
        if(typeof solved === "object") {
            console.log("SOLVED");
            solved.forEach((arr, i) => arr.forEach((output, j) => {
                outputs[i * 3 + j].value = output;
            })); 
        } else {
            console.log("FAILED TO SOLVE");
            alert("Failed to solve");
        }
    
        button.textContent = "HACK";
    })
    
}

bruteforceRecursive = (inputs, col, row) => {
    const newInputs = inputs.map((arr) => {
        return arr.slice();
    });

    let nextCol = col + 1;
    let nextRow = row;
    if(nextCol > 2) {
        nextCol = 0;
        nextRow += 1
    }

    while(newInputs[col][row] < maxNumber) {
        newInputs[col][row] = newInputs[col][row] + 1;

        if(validate(validators, newInputs)) {
            console.log("FOUND!");
            console.log(newInputs);
            return newInputs;
        }

        if(nextRow < 3) {
            const got = bruteforceRecursive(newInputs, nextCol, nextRow);
            if(typeof got === "object") return got;
        }   
    }
    
}

button.addEventListener("click", hack);

resultsHorizontal.forEach((result, index) => {
    result.addEventListener("input", () => { resultsHorizontalCopy[index].value = result.value })
});
resultsHorizontalCopy.forEach((result, index) => {
    result.addEventListener("input", () => { resultsHorizontal[index].value = result.value })
});
resultsVertical.forEach((result, index) => {
    result.addEventListener("input", () => { resultsVerticalCopy[index].value = result.value })
});
resultsVerticalCopy.forEach((result, index) => {
    result.addEventListener("input", () => { resultsVertical[index].value = result.value })
});

// SETTINGS
const settings = document.querySelector("[data-settings]");
const settings_btn = document.querySelector("[data-settings-btn]");
const settings_bg = document.querySelector("[data-settings-bg]");
const settings_save = document.querySelector("[data-settings-save]");

const addSignInput = document.querySelector("[data-add-sign]");
const subSignInput = document.querySelector("[data-sub-sign]");
const multSignInput = document.querySelector("[data-mult-sign]");
const divSignInput = document.querySelector("[data-div-sign]");
const maxNumberInput = document.querySelector("[data-max-number]");

addSignInput.value = addSign;
subSignInput.value = subSign;
multSignInput.value = multSign;
divSignInput.value = divSign;
maxNumberInput.value = maxNumber;


settings_btn.addEventListener("click", () => {
    settings.classList.toggle("hidden");
});
settings_bg.addEventListener("click", () => {
    settings.classList.add("hidden");
});
settings_save.addEventListener("click", () => {
    localStorage.setItem("addSign", addSignInput.value);
    localStorage.setItem("subSign", subSignInput.value);
    localStorage.setItem("multSign", multSignInput.value);
    localStorage.setItem("divSign", divSignInput.value);
    localStorage.setItem("maxNumber", maxNumberInput.value);

    loadStorage();

    settings.classList.add("hidden");
});