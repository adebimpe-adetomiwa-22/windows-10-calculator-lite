class Calculator {
    constructor() {
        // screen
        this.screen = document.querySelector('.screen-wrapper h2');
        this.stack = document.querySelector('.screen-wrapper .stack');
        this.stackedValues = '';

        // reset
        [this.screen, this.stack].map((element) => (element.textContent = ''));

        // numbers
        this.numbers = document.querySelectorAll('.number, .period');
        this.addToScreen = '';
        // this.solve = new Array();
        this.blackBox = {
            num1: null,
            num2: null,
            mainOperator: {
                name: null,
                symbol: null,
            },
            restOperator: {
                name: null,
                symbol: null,
            },
        };

        // numbers to solve

        // let arithmetics
        this.arithmetics = document.querySelectorAll(
            '.arithmetic, .other-arithmetic'
        );
        this.arithActive = false;

        // delete button
        this.deleteButton = document.querySelector('.delete');

        // clear button
        this.clearButton = document.querySelector('.clear');

        // initializing
        this.init();
    }

    init() {
        this.clickNumbers();
        this.delete();
        this.clear();
        this.solve();
    }

    clear() {
        this.clearButton.addEventListener('click', (event) => {
            this.stackedValues = '';
            this.stack.textContent = '';
            this.addToScreen = '';

            // clearing the black box
            (this.blackBox.num1 = null),
                (this.blackBox.num2 = null),
                (this.blackBox.mainOperator.name = null),
                (this.blackBox.mainOperator.symbol = null),
                (this.blackBox.restOperator.name = null),
                (this.blackBox.restOperator.symbol = null),
                this.updateScreen();
        });
    }

    delete() {
        this.deleteButton.addEventListener('click', (event) => {
            // console.log(this.addToScreen);
            if (this.addToScreen !== '') {
                this.addToScreen = this.addToScreen.slice(0, -1);
                this.updateScreen();
            }
        });
    }

    clickNumbers() {
        this.numbers.forEach((number) => {
            number.addEventListener('click', (event) => {
                this.arithActive = false;
                this.noDelete = false;

                let value = number.textContent;
                this.addToScreen += value;

                this.updateScreen();
                this.screen.scrollTop = this.screen.scrollHeight;
            });
        });
    }

    solve() {
        this.arithmetics.forEach((arithmetic) => {
            arithmetic.addEventListener('click', (event) => {
                this.arithmetic = arithmetic;

                this.value = Number(this.addToScreen);
                this.signName = this.arithmetic.className.split(' ')[1];
                this.sign = this.arithmetic.textContent;

                this.specialFunctions();

                this.solveEquation();
            });
        });
    }

    specialFunctions() {
        // if (this.signName == 'equals') {
        //     console.log('equals to');
        //     this.equals();
        // }
    }

    switchOps() {
        this.blackBox.num1 = this.result;
        this.blackBox.mainOperator.name = this.blackBox.restOperator.name;
        this.blackBox.mainOperator.symbol = this.blackBox.restOperator.symbol;

        this.addToScreen = this.result;
        this.updateScreen();
    }

    equate() {
        let val1 = this.blackBox.num1;
        let val2 = this.blackBox.num2;
        let operator = this.blackBox.mainOperator.name;
        this.result = null;

        switch (operator) {
            case 'plus':
                this.result = this.plus(val1, val2);
                break;
            case 'minus':
                this.result = this.minus(val1, val2);
                break;
            case 'times':
                this.result = this.times(val1, val2);
                break;
            case 'divide':
                this.result = this.divide(val1, val2);
                break;
            case 'equals':
                this.equals();
                break;

            default:
                console.log('unknown operator');
        }

        // console.log(this.result);
        // if (this.result == 'equals') {
        //     console.log('...');
        // }

        this.switchOps();
    }

    solveEquation() {
        if (!this.arithActive) {
            if (this.blackBox.num1) {
                this.blackBox.restOperator.name = this.signName;
                this.blackBox.restOperator.symbol = this.sign;
                this.blackBox.num2 = this.value;
                this.equate();
            } else {
                this.blackBox.num1 = this.value;
                this.blackBox.mainOperator.name = this.signName;
                this.blackBox.mainOperator.symbol = this.sign;
            }
        } else {
            this.blackBox.restOperator.name = this.signName;
            this.blackBox.restOperator.symbol = this.sign;
            this.blackBox.num2 = this.value;
            this.equate();
        }

        this.addToScreen = '';
        this.updateStack();
        this.arithActive = true;
    }

    updateStack() {
        if (this.blackBox.restOperator.name == 'equals') {
            this.equals();
            return;
        }

        this.toAdd = this.blackBox.num2;

        this.blackBox.restOperator.name = this.signName;
        this.blackBox.restOperator.symbol = this.sign;

        if (!this.toAdd) {
            this.toAdd = this.blackBox.num1;
        }
        if (!this.blackBox.restOperator.symbol) {
            this.blackBox.restOperator.symbol =
                this.blackBox.mainOperator.symbol;
        }

        if (this.arithActive) {
            this.stackedValues = this.stackedValues.slice(0, -1);
            this.stackedValues += `${this.blackBox.restOperator.symbol}`;
        } else {
            this.stackedValues += `${this.toAdd}${this.blackBox.restOperator.symbol}`;
        }

        this.stack.textContent = this.stackedValues;

        return;
    }

    latestValue() {
        return Number(this.addToScreen);
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
}

const calculator1 = new Calculator();
