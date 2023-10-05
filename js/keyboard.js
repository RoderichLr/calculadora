class Calculator {
  constructor() {
    this.current = document.getElementById("current");
    this.previous = document.getElementById("previous");
    this.buttons = Array.from(document.getElementsByTagName("button"));
    this.endElementFocus = null;
    this.keyDown = false;
    this.lastCharIsOperator = false;
    this.backspaceInterval = null;
    this.valorOperacion = "0";
    this.maxDigits = 16; 
    this.operatorClasses = {
      Delete: "buttonOperatorC",
      Backspace: "buttonOperatorB",
      "/": "buttonOperatorD",
      "*": "buttonOperatorM",
      "-": "buttonOperatorR",
      "+": "buttonOperatorS",
    };

    document.addEventListener("focusin", this.endFocus.bind(this));
    document.addEventListener("keydown", this.handleKeyDown.bind(this));
    document.addEventListener("keyup", this.handleKeyUp.bind(this));

    document.addEventListener("mousedown", this.handleMouseDown.bind(this));
    document.addEventListener("mouseup", this.handleMouseUp.bind(this));
  }

  endFocus(event) {
    this.endElementFocus = event.target;
  }

  handleMouseDown(event) {
    const target = event.target;

    if (target.tagName === "BUTTON") {
      if (!this.mouseDown) {
        this.mouseDown = true;
        this.handleAction.call(this, target);
      }
    }
  }

  handleMouseUp(event) {
    const target = event.target;
    if (target) {
      this.mouseDown = false;
      if (target.value === "Backspace") {
        clearInterval(this.backspaceInterval);
      }
    }
  }

  handleKeyDown(event) {
    const key = event.key;
    this.endElementFocus.blur();
    const button = this.buttons.find((b) => b.value === key);

    if (button) {
      button.classList.add("buttonKey");
      button.classList.add(this.operatorClasses[button.value]);
      if (!this.keyDown) {
        this.keyDown = true;
        this.handleAction.call(this, button);
      }
    }
  }

  handleKeyUp(event) {
    const key = event.key;
    const button = this.buttons.find((b) => b.value === key);

    if (button) {
      button.classList.remove("buttonKey");
      button.classList.remove(this.operatorClasses[button.value]);

      if (this.operatorClasses[button.value]) {
      }

      this.keyDown = false;

      if (button.value === "Backspace") {
        clearInterval(this.backspaceInterval);
      }
    }
  }

  handleAction(valueBoard) {
    const buttonValue = valueBoard.value;

    switch (buttonValue) {
      case "Delete":
        this.clearCalculator();
        break;
      case "Enter":
        this.evaluateExpression();
        break;
      case "Backspace":
        this.handleBackspace();
        break;
      default:
        this.handleDefault(buttonValue);
        break;
    }
  }

  handleBackspace() {
    if (this.keyDown || this.mouseDown) {
      this.backspaceInterval = setInterval(() => {
        this.current.innerHTML = this.current.innerHTML.slice(0, -1);
        if (this.current.innerHTML === "") {
          this.clearCalculator();
        }
      }, 80);
    }
  }

  handleDefault(value) {
    if (!isNaN(value) || !this.lastCharIsOperator) {
      if (this.current.innerHTML === "0") {
        this.current.innerHTML = value;
      } else {
      
        if (this.current.innerHTML.length < this.maxDigits) {
          this.current.innerHTML += value;
        }
        else{
          this.previous.innerHTML = "Digite solo 16 numeros";
          this.previous.style.fontSize = '25px';
        }
      }
      this.valorOperacion = this.current.innerHTML;
      this.lastCharIsOperator = isNaN(value);
    }
  }
  

  evaluateExpression() {
    try {
      
      const currentValue = eval(this.current.innerHTML);
      this.previous.style.fontSize = '40px';
      if (currentValue.toString().length > 10) {
        this.previous.innerHTML = currentValue.toExponential(5);
      } else {
        this.previous.innerHTML = currentValue;
      }
      this.valorOperacion = this.previous.innerHTML;
      this.lastCharIsOperator = false;
    } catch (error) {
      this.previous.innerHTML = "Error";
      
    }
  }

  clearCalculator() {
    this.current.innerHTML = "0";
    this.previous.innerHTML = "";
    this.lastCharIsOperator = false;
    this.previous.style.fontSize = '40px';
  }
}

const calculator = new Calculator();
