const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
//string of all symbols
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';


//initially
let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
//set strength circle color to grey
setIndicator("#ccc");


//set passwordLength
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordLength - min)*100/(max - min)) + "% 100%"
}

function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

//math.random krne se ans (0,1) ke beech mei aayega
//math.random*(max-min) krne se ans (0,max-min) ke beech mei aayega jisme (max-min) exclusive hai 
//possibility hai ki ye ek floating no. ho to isse round off kr dia math.floor lga kr ab integer hi aayega
//but abhi bhi iski range hai (0,max-min), isliye +min kr dia isme
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber() {
    return getRndInteger(0,9);
}

function generateLowerCase() {  
       return String.fromCharCode(getRndInteger(97,123))
}

function generateUpperCase() {  
    return String.fromCharCode(getRndInteger(65,91))
}

//uss index pr kaun sa character hai vo batata hai chatAt
function generateSymbol() {
    const randNum = getRndInteger(0, symbols.length);
    //randNum represents index in symbols string
    return symbols.charAt(randNum);
}

function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;
  
    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
      setIndicator("#0f0");
    } else if (
      (hasLower || hasUpper) &&
      (hasNum || hasSym) &&
      passwordLength >= 6
    ) {
      setIndicator("#ff0");
    } else {
      setIndicator("#f00");
    }
}

async function copyContent() {
    try {
        //this is used to copy the paragraph to clipboard
        //clipboard pr likhne ke liye writeText vala method available hai 
        //writeText krne se clipboard pr ek tarah se copy kr rhe hai 
        //writeText vala method ek promise return krta hai
        //promise ki 2 values hoti hai output mei ya to ye resolve hoga ya ye reject hoga 
        //jb  ye resolve hoga promise tabhi mana jayega ki hmne successfully clipboard pr copy kr dia
        //This is asynchronous operation.
        //we have to make sure ki ye copy vala text tabhi aaye jb ye promise resolve ho gya ho
        //to hmne promise resolve pr await keyword lga diya ki jb ye complete hoga tabhi aage ki lines execute hogi
        //aage ki line hogi ki vaha pr copied text show krdo
        //aisa nhi hona chahiye ki promise pending state mei ho aur hum copied ka text dikha de
        await navigator.clipboard.writeText(passwordDisplay.value);
        //jaise hi promise resolve ho jayega span ke andr copied vala text daal denge
        copyMsg.innerText = "copied";
    }
    //there is possibility ki error aa jaye so try catch ka use kiya 
    catch(e) {
        copyMsg.innerText = "Failed";
    }
    //to make copy wala span visible
    copyMsg.classList.add("active");

    setTimeout( () => {
        copyMsg.classList.remove("active");
        //2 sec ke baad class active remove ho jayegi i.e copied text invisible
    },2000);

}

function shufflePassword(array) {
    //Fisher Yates Method - shuffle krne ki algo
    for (let i = array.length - 1; i > 0; i--) {
        //random J, find out using random function
        // at every iteration ith index value is swapped with jth value choosen randomly 
        const j = Math.floor(Math.random() * (i + 1));
        //swap number at i index and j index
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach( (checkbox) => {
        if(checkbox.checked)
            checkCount++;
    });

    //special condition
    if(passwordLength < checkCount ) {
        passwordLength = checkCount;
        handleSlider();
    }
}

//sare checkboxes ke upar event listener lga dia jb bhi change ho
allCheckBox.forEach( (checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
})

//slider pr event listener lga diya
inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
})

//input ke andr koi value padi hai to copy kr payenge nhi to nhi 
copyBtn.addEventListener('click', () => {
    if(passwordDisplay.value)
        copyContent();
})

generateBtn.addEventListener('click', () => {
    //none of the checkbox are selected

    if(checkCount == 0) 
        return;

    if(passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

    // let's start the jouney to find new password
    console.log("Starting the Journey");
    //remove old password
    password = "";

    //let's put the stuff mentioned by checkboxes

    // if(uppercaseCheck.checked) {
    //     password += generateUpperCase();
    // }

    // if(lowercaseCheck.checked) {
    //     password += generateLowerCase();
    // }

    // if(numbersCheck.checked) {
    //     password += generateRandomNumber();
    // }

    // if(symbolsCheck.checked) {
    //     password += generateSymbol();
    // }

    let funcArr = [];

    if(uppercaseCheck.checked)
        funcArr.push(generateUpperCase);

    if(lowercaseCheck.checked)
        funcArr.push(generateLowerCase);

    if(numbersCheck.checked)
        funcArr.push(generateRandomNumber);

    if(symbolsCheck.checked)
        funcArr.push(generateSymbol);

    //compulsory addition
    for(let i=0; i<funcArr.length; i++) {
        password += funcArr[i]();
    }
    console.log("COmpulsory adddition done");

    //remaining adddition
    for(let i=0; i<passwordLength-funcArr.length; i++) {
        let randIndex = getRndInteger(0 , funcArr.length);
        console.log("randIndex" + randIndex);
        password += funcArr[randIndex]();
    }
    console.log("Remaining adddition done");
    //shuffle the password
    //Fisher Yates Method
    //isse array ko shuffle kr dia that means password ko shuffle kr dia
    password = shufflePassword(Array.from(password));
    console.log("Shuffling done");
    //show in UI
    passwordDisplay.value = password;
    console.log("UI adddition done");
    //calculate strength
    calcStrength();
});