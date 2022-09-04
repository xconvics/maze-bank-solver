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

// const inputs = [
//     [3, 4, 2],
//     [4, 1, 3],
//     [2, 5, 1]
// ]

const inputs = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
]

const addSign = "+";
const subSign = "-";
const multSign = "x";
const divSign = ":";

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


const hack = () => {
    initHack();

    console.log("STARTING...")

    const solved = bruteforceRecursive(inputs, 0, 0);

    console.log("DONE")
    console.log(solved)

    if(typeof solved === "object") {
        console.log("SOLVED");
        solved.forEach((arr, i) => arr.forEach((output, j) => {
            outputs[i * 3 + j].value = output;
        })); 
    } else {
        console.log("FAILED TO SOLVE");
        alert("Failed to solve");
    }
    
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

    while(nextRow < 3 && newInputs[col][row] < 10) {
        newInputs[col][row] = newInputs[col][row] + 1;

        if(validate(validators, newInputs)) {
            console.log("FOUND!");
            console.log(newInputs);
            return newInputs;
        }

        const got = bruteforceRecursive(newInputs, nextCol, nextRow);
        if(typeof got === "object") return got;
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