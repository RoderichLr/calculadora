class Calculator {
  constructor(currentElementId, previousElementId, buttonElements) {
    // Elementos DOM
    this.current = document.getElementById(currentElementId);
    this.previous = document.getElementById(previousElementId);
    this.buttons = Array.from(buttonElements);
   

    // Variables de estado
    this.endElementFocus = null;
    this.keyDown = false;
    this.mouseDown = false;
    this.lastCharIsOperator = false;
    this.backspaceInterval = null;
    this.valorOperacion = "0";
    this.maxDigits = 14;
    this.expresionRegular = /[+\-*/]{2,}/;
    this.operatorClasses = {
      Delete: "button-operatorC",
      Backspace: "button-operatorB",
      "/": "button-operatorD",
      "*": "button-operatorM",
      "-": "button-operatorS",
      "+": "button-operatorA",
    };

    // Eventos
    document.addEventListener("focusin", this.endFocus.bind(this));
    document.addEventListener("keydown", this.handleKeyDown.bind(this));
    document.addEventListener("keyup", this.handleKeyUp.bind(this));
    document.addEventListener("mousedown", this.handleMouseDown.bind(this));
    document.addEventListener("mouseup", this.handleMouseUp.bind(this));
  }

  // Manejo del enfoque en elementos HTML
  endFocus(event) {
    this.endElementFocus = event.target;
  }

  // Manejo de clics de mouse en botones
  handleMouseDown(event) {
    const target = event.target;
    if (target.tagName === "BUTTON" && !this.mouseDown) {
      this.mouseDown = true;
      this.handleAction.call(this, target);
    }
  }

  // Manejo de liberación de mouse después de hacer clic en un botón
  handleMouseUp(event) {
    const target = event.target;
    if (target && target.value === "Backspace") {
      clearInterval(this.backspaceInterval);
    }
    this.mouseDown = false;
  }

  // Manejo de pulsaciones de teclas
  handleKeyDown(event) {
   
    const key = event.key;
    if (this.endElementFocus) {
      this.endElementFocus.blur();
    }
    const button = this.buttons.find((b) => b.value === key);

    if (button) {
      button.classList.add("button-key", this.operatorClasses[button.value]);
      if (!this.keyDown) {
        this.keyDown = true;
        this.handleAction.call(this, button);
      }
    }
  }

  // Manejo de liberación de teclas
  handleKeyUp(event) {
    const key = event.key;
    const button = this.buttons.find((b) => b.value === key);

    if (button) {
      button.classList.remove("button-key", this.operatorClasses[button.value]);
      if (this.operatorClasses[button.value]) {
        // Realiza alguna acción específica para operadores
      }
      this.keyDown = false;
      if (button.value === "Backspace") {
        clearInterval(this.backspaceInterval);
      }
    }
  }

  // Manejo de acciones según el botón presionado
  handleAction(valueBoard) {
    const buttonValue = valueBoard.value;

    switch (buttonValue) {
      case "Delete":
        this.clearCalculator();
        break;
      case "Enter":
        this.handleEnter();
        break;
      case "Backspace":
        this.handleBackspace();
        break;
      default:
        this.handleDefault(buttonValue);
        break;
    }
  }

  // Manejo de la tecla Enter
  handleEnter() {
    if (this.previous.innerHTML !== "") {
      this.current.classList.add("text-animation");
      this.current.addEventListener("animationend", () => {
        this.current.classList.remove("text-animation");
        if (this.previous.innerHTML !== "") {
          this.current.innerHTML = this.previous.innerHTML;
        }
        this.previous.innerHTML = "";
      });
    }
  }

  // Manejo del retroceso (backspace)
  handleBackspace() {
    let deleteTimer = null;
    const initialDeleteInterval = 400;
    let currentDeleteInterval = initialDeleteInterval;

    const startDelete = () => {
      this.current.innerHTML = this.current.innerHTML.slice(0, -1);
      this.lastCharIsOperator = isNaN(this.current.innerHTML);
      if (isNaN(this.current.innerHTML)) {
        this.evaluateExpression();
      }
      if (this.current.innerHTML === "") {
        this.clearCalculator();
      } else {
        deleteTimer = setTimeout(startDelete, currentDeleteInterval);
      }
    };

    const stopDelete = () => {
      if (deleteTimer !== null) {
        clearTimeout(deleteTimer);
        deleteTimer = null;
      }
    };

    if (this.keyDown || this.mouseDown) {
      document.addEventListener("keyup", stopDelete);
      document.addEventListener("mouseup", stopDelete);
      startDelete();
      setTimeout(() => {
        currentDeleteInterval = 50;
      }, 800);
    }
  }

  // Manejo de otros botones
  handleDefault(value) {
    if (this.current.innerHTML.length > this.maxDigits) {
      this.previous.innerHTML = "Solo 15 dígitos";
      this.previous.style.fontSize = "25px";
    } else {
      if (!isNaN(value) || (!this.lastCharIsOperator && this.current.innerHTML !== "0")) {
        if (this.current.innerHTML === "0") {
          this.current.innerHTML = value;
        } else {
          this.current.innerHTML += value;
        }
        this.valorOperacion = this.current.innerHTML;
        if (!isNaN(value) && this.lastCharIsOperator) {
          if (this.expresionRegular.test(this.current.innerHTML)) {
            this.evaluateExpression();
          }
        }
        this.lastCharIsOperator = isNaN(value);
        if (/[\+\-\*\/]/.test(this.valorOperacion) && !this.lastCharIsOperator) {
          this.evaluateExpression();
        }
      }
    }
  }

  // Evaluación de la expresión matemática
  evaluateExpression() {
    try {
      const currentValue = eval(this.current.innerHTML);
      this.previous.style.fontSize = "40px";
      if (currentValue.toString().length > 10) {
        this.previous.innerHTML = currentValue.toExponential(5);
      } else {
        this.previous.innerHTML = currentValue;
      }
      this.valorOperacion = this.previous.innerHTML;
      this.lastCharIsOperator = false;
    } catch (error) {
      this.previous.innerHTML = "";
    }
  }

  // Borrar la calculadora
  clearCalculator() {
    this.current.innerHTML = "0";
    this.previous.innerHTML = "";
    this.lastCharIsOperator = false;
    this.previous.style.fontSize = "40px";
  }
}

  const calculator = new Calculator("current", "previous", document.getElementsByTagName("button"));
  
   

