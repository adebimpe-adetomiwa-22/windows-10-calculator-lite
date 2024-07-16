class Calculator {
    constructor() {
        // screen
        this.screen = document.querySelector('.screen-wrapper h2');
        this.sidebar = document.getElementById('sidebar');

        this.stack = document.querySelector('.screen-wrapper > div > .stack');
        this.stackCover = document.querySelector('.stack-cover');
        // this.noHistory = document.querySelector('.history > .no-history');
        this.bin = document.querySelector('.bin > div');
        this.toggleHistoryButton = document.querySelector(
            '.toggle-history-button'
        );
        this.toggleHistoryActive = false;

        // sidebar
        this.noHistory = document.querySelector('.history > .no-history');
        this.historyCover = document.querySelector('.history > .history-cover');

        this.sidebarActiveContent = 'history';

        [this.historyButton, this.memoryButton] = document.querySelectorAll(
            '.sidebar > .header > button'
        );

        this.history = document.querySelector(
            '.sidebar > .main > .sidebar-display > .history'
        );
        this.memory = document.querySelector(
            '.sidebar > .main > .sidebar-display > .memory'
        );
        this.currentSidebar = 'history';

        this.stackedValues = '';

        // reset
        [this.screen, this.stack].map((element) => (element.textContent = ''));

        // environment variable
        this.final = null;
        this.starter = true;
        this.saveBox = new Array();

        this.value1 = null;
        this.value2 = null;
        this.arith1 = null;
        this.arith2 = null;
        this.firstNumber = null;
        this.secondNumber = null;

        // operator exception
        this.currentOperator = null;

        // numbers
        this.numbers = document.querySelectorAll('.number, .period');
        this.addToScreen = '';
        this.holdScreen = '';

        // arithmetics
        this.arithmetics = document.querySelectorAll('.arithmetic');
        this.specialarithmetics =
            document.querySelectorAll('.other-arithmetic');

        this.arithActive = false;

        // delete button
        this.deleteButton = document.querySelector('.delete');

        // clear button
        this.clearButton = document.querySelector('.clear');

        // initializing
        this.init();
    }

    exceptions() {}

    startCalculation() {
        let val1 = Number(this.value1);
        let operator = this.arith1;
        let val2 = Number(this.value2);
        let result = null;

        switch (operator) {
            case 'plus':
                result = this.plus(val1, val2);
                break;
            case 'minus':
                result = this.minus(val1, val2);
                break;
            case 'times':
                result = this.times(val1, val2);
                break;
            case 'divide':
                result = this.divide(val1, val2);
                break;
            default:
                console.log('unknown operator');
        }

        // console.log(`${val1} ${operator} ${val2} = ${result}`);
        this.value1 = result;
        this.arith1 = this.arith2;

        // changging screen to display result
        this.addToScreen = result;
        this.updateScreen();
    }

    scrollStack() {
        // console.log('scroll stack');
        this.stackCover.scrollLeft = this.stackCover.scrollWidth;
    }

    arithClick() {
        this.arithmetics.forEach((arithmetic) => {
            arithmetic.addEventListener('click', (event) => {
                this.scrollStack();
                // exceptions
                if (!this.firstNumber) {
                    return;
                }
                if (this.addToScreen !== '') {
                    this.holdScreen = this.addToScreen;
                }

                if (this.arithActive) {
                    this.addToScreen = this.holdScreen;
                    // return;
                }
                // this.exceptions();
                //

                this.arithName = arithmetic.className.split(' ')[1];
                this.arithSymbol = arithmetic.textContent;
                this.currentOperator = this.arithName;

                // setting the values;
                if (this.starter) {
                    this.value1 = this.addToScreen;
                    this.arith1 = this.arithName;
                    this.starter = false;
                } else {
                    this.value2 = this.addToScreen;
                    this.arith2 = this.arithName;
                    if (!this.arithActive) {
                        this.startCalculation();
                    } else {
                        this.arith1 = this.arith2;
                        // return;
                    }
                }

                // external from equals
                // if (this.value2) {
                //     this.value1 = this.value2;
                //     this.value2 = this.addToScreen;
                // }

                this.updateStack();

                this.addToScreen = '';

                // console.log(
                //     this.addToScreen,
                //     this.value1,
                //     this.arith1,
                //     this.value2,
                //     this.arith2
                // );

                this.arithActive = true;
                this.equalsActive = false;
            });
        });
    }

    specialarithmeticClick() {
        this.specialarithmetics.forEach((specialArithmetic) => {
            specialArithmetic.addEventListener('click', (event) => {
                if (!this.firstNumber) {
                    return;
                }

                if (this.equalsActive) {
                    return;
                }
                this.specialArithName =
                    specialArithmetic.className.split(' ')[1];
                this.specialArithSymbol = specialArithmetic.textContent;

                if (this.specialArithName == 'equals') {
                    this.value2 = this.addToScreen;

                    this.toSave = `${this.stackedValues} ${this.value2} = `;

                    if (this.arithActive) {
                        this.value2 = null;
                    }

                    this.startCalculation();
                    this.value2 = this.addToScreen;
                    this.toSave += this.value2;

                    this.stackedValues = '';
                    this.stack.textContent = this.stackedValues;
                    this.starter = true;

                    this.save();

                    // auto scroll
                    // this.history.scrollTop = this.history.scrollHeight;

                    // show bin
                    if (this.sidebarActiveContent == 'history') {
                        this.bin.classList.add('active');
                    }
                    this.noHistory.classList.add('disabled');

                    // this.value1 = this.value2;
                    // this.value2 = this.addToScreen;
                    this.equalsActive = true;
                }
            });
        });
    }

    clearHistory() {
        this.bin.addEventListener('click', (event) => {
            this.saveBox = new Array();
            this.historyCover.innerHTML = '';
        });
    }

    save() {
        this.historyCover.innerHTML = '';
        this.saveBox.push(this.toSave);
        // console.log(this.saveBox);

        this.saveBox.forEach((saved) => {
            let all = saved.split(' ');

            let firstPath = all.slice(0, -1).join(' ');
            let secondPart = all[all.length - 1];

            let div = this.create('div');
            let p = this.create('p', false, firstPath);
            let h2 = this.create('h2', false, secondPart);

            div.append(p, h2);

            this.historyCover.prepend(div);

            // console.log(div);
        });
    }

    cancelBin() {
        this.bin.addEventListener('click', (event) => {
            this.bin.classList.remove('active');
            this.noHistory.classList.remove('disabled');
        });
    }

    sidebarEvents() {
        this.historyButton.addEventListener('click', (event) => {
            if (!this.history.classList.contains('show')) {
                this.sidebarActiveContent = 'history';

                this.history.classList.add('show');
                this.memory.classList.remove('show');

                this.historyButton.classList.add('active');
                this.memoryButton.classList.remove('active');

                if (this.saveBox.length >= 1) {
                    this.bin.classList.add('active');
                }
            }
        });

        this.memoryButton.addEventListener('click', (event) => {
            if (!this.memory.classList.contains('show')) {
                this.sidebarActiveContent = 'memory';
                this.memory.classList.add('show');
                this.history.classList.remove('show');

                this.memoryButton.classList.add('active');
                this.historyButton.classList.remove('active');
                this.bin.classList.remove('active');
            }
        });
    }

    updateStack() {
        if (!this.arithActive) {
            if (!this.value2) {
                this.stackedValues += `${this.value1} ${this.arithSymbol} `;
            } else {
                this.stackedValues += `${this.value2} ${this.arithSymbol} `;
            }
        } else {
            // console.log(this.stackedValues);
            this.stackedValues = this.stackedValues.slice(0, -2);
            // console.log(this.stackedValues);
            this.stackedValues += `${this.arithSymbol} `;
            // console.log(this.stackedValues);
        }

        this.stack.textContent = this.stackedValues;
    }

    togglingHistory() {
        this.toggleHistoryButton.addEventListener('click', (event) => {
            this.sidebar.classList.toggle('active');
        });
    }

    init() {
        this.clickNumbers();
        this.delete();
        this.clear();
        this.arithClick();
        this.specialarithmeticClick();
        this.cancelBin();
        this.sidebarEvents();
        this.clearHistory();
        this.togglingHistory();
    }

    clear() {
        this.clearButton.addEventListener('click', (event) => {
            // erasing envv
            this.value1 = null;
            this.value2 = null;
            this.arith1 = null;
            this.arith2 = null;

            this.stackedValues = '';
            this.stack.textContent = '';
            this.addToScreen = '';
            this.updateScreen();
            this.starter = true;
            this.firstNumber = null;
        });
    }

    delete() {
        this.deleteButton.addEventListener('click', (event) => {
            try {
                if (this.addToScreen !== '') {
                    this.addToScreen = this.addToScreen.slice(0, -1);
                    this.updateScreen();
                }
            } catch (error) {
                console.log(error);
            }
        });
    }

    clickNumbers() {
        this.numbers.forEach((number) => {
            number.addEventListener('click', (event) => {
                this.arithActive = false;
                this.noDelete = false;
                if (this.firstNumber) {
                    this.secondNumber = true;
                }
                this.firstNumber = number.textContent;

                let value = number.textContent;
                this.addToScreen += value;

                this.updateScreen();
                this.screen.scrollTop = this.screen.scrollHeight;

                this.equalsActive = false;
            });
        });
    }

    plus(val1, val2) {
        return val1 + val2;
    }

    minus(val1, val2) {
        return val1 - val2;
    }

    times(val1, val2) {
        return val1 * val2;
    }

    divide(val1, val2) {
        return val1 / val2;
    }

    percentage() {}

    square(val) {
        return val ** 2;
    }

    squareroot() {}

    oneDivision(val) {
        return 1 / val;
    }

    equals() {
        this.stackedValues = '';
        this.stack.textContent = '';
    }

    updateScreen() {
        this.screen.textContent = this.addToScreen;
    }

    create(element, elementClass = false, elementText = false) {
        let elementCreated = document.createElement(element);

        if (elementClass) {
            elementCreated.className = elementClass;
        }

        if (elementText) {
            let textNode = document.createTextNode(elementText);
            elementCreated.append(textNode);
        }

        return elementCreated;
    }
}

const calculator1 = new Calculator();
