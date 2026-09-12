class BindableFunction {
    constructor (downFunction, upFunction) {
        this.downFunction = downFunction;
        this.upFunction = upFunction;
    }
}

class BindableVariable {
    constructor (variable, downValue, upValue) {
        this.variable = variable; // make sure this is a pointer, not a copy.
        this.downValue = downValue;
        this.upValue = upValue;
    }
}

export default class Binds {
    constructor(element = document) {

        const binds = {x:1};
        element.addEventListener('keydown', () => { this.keyDown() });
        element.addEventListener('keyup', () =>  { this.keyUp() });
    }

    bindToVariable(key, variable, downValue = true, upValue = false) {
        const bind = new BindableVariable(variable, downValue, upValue);

        // this.binds[key] = bind;
        let keyw = "test";
        console.log(this.binds);
    }

    bindToFunction(key, downFunction = () => {}, upFunction = () => {}) { }

    keyDown(event) {

        let key = event.key;

        this.binds[key] && console.log("exists"); 

    }

    keyUp(event) {

        let key = event.key;
    }
}