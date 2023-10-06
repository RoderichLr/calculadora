class Calculator {
  constructor() {
    // Inicialización de propiedades y eventos
    this.current = document.getElementById("current"); // Pantalla de entrada actual
    this.previous = document.getElementById("previous"); // Pantalla de resultados previos
    
    this.buttons = Array.from(document.getElementsByTagName("button")); // Lista de botones
    this.endElementFocus = null; // Elemento HTML con foco
    this.keyDown = false; // Indica si se mantiene presionada una tecla
    this.lastCharIsOperator = false; // Indica si el último carácter ingresado es un operador
    this.backspaceInterval = null; // Intervalo para manejar el retroceso continuo
    this.valorOperacion = "0"; // Valor de la operación actual
    this.maxDigits = 14; // Máximo número de dígitos permitidos
    this.expresionRegular = /[+\-*/]{2,}/;
    this.operatorClasses = {
      Delete: "buttonOperatorC",
      Backspace: "buttonOperatorB",
      "/": "buttonOperatorD",
      "*": "buttonOperatorM",
      "-": "buttonOperatorS",
      "+": "buttonOperatorA",
    }; // Clases CSS para los botones de operadores
    
    // Eventos de escucha
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

    if (target.tagName === "BUTTON") {
      if (!this.mouseDown) {
        this.mouseDown = true;
        this.handleAction.call(this, target);
      }
    }
  }

  // Manejo de liberación de mouse después de hacer clic en un botón
  handleMouseUp(event) {
    const target = event.target;
    if (target) {
      this.mouseDown = false;
      if (target.value === "Backspace") {
        clearInterval(this.backspaceInterval);
      }
    }
  }

  // Manejo de pulsaciones de teclas
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

  // Manejo de liberación de teclas
  handleKeyUp(event) {
    const key = event.key;
    const button = this.buttons.find((b) => b.value === key);

    if (button) {
      button.classList.remove("buttonKey");
      button.classList.remove(this.operatorClasses[button.value]);

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

  handleEnter() {
    // Mueve el contenido de la pantalla actual a la pantalla previa
    
      this.current.innerHTML = this.previous.innerHTML!=="" ?this.previous.innerHTML:this.current.innerHTML;
      this.previous.innerHTML = "";
    
  }


  // Manejo del retroceso (backspace)
  handleBackspace() {
    //...........................

    if (this.keyDown || this.mouseDown) {
      this.backspaceInterval = setInterval(() => {
        this.current.innerHTML = this.current.innerHTML.slice(0, -1);
        this.lastCharIsOperator = isNaN(this.current.innerHTML);
        if (isNaN(this.current.innerHTML)) {
          this.evaluateExpression();
        }

        if (this.current.innerHTML === "") {
          this.clearCalculator();
        }
      }, 80);
    }
  }

  // Manejo de entrada de números y operadores
  handleDefault(value) {
    if (this.current.innerHTML.length > this.maxDigits) {
      this.previous.innerHTML = "Solo 15 dígitos";
      this.previous.style.fontSize = "25px";
    } else{
    if (!isNaN(value) || !this.lastCharIsOperator) {
      if (this.current.innerHTML === "0") {
        this.current.innerHTML = value;
      } else {
        
        this.current.innerHTML += value;
        
      }
      this.valorOperacion = this.current.innerHTML;

      // Si el valor ingresado es un operador, realiza la evaluación automáticamente
      if (!isNaN(value) && this.lastCharIsOperator) {
        if (this.expresionRegular.test(this.current.innerHTML)) {
          this.evaluateExpression();
        } else {
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

const calculator = new Calculator();
