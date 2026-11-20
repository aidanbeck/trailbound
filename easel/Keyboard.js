class LogicBind {
    constructor(downLogic, upLogic) {
        this.downLogic = downLogic;
        this.upLogic = upLogic;
        this.isDown = false;
    }
    
    onDown() {
        this.downLogic && this.downLogic();
        this.isDown = true;
    }
    
    onUp() {
        this.upLogic && this.upLogic();
        this.isDown = false;
    }
}

class ValueBind {
    constructor(setter, downValue, upValue) {
        this.setter = setter;
        this.downValue = downValue;
        this.upValue = upValue;
        this.isDown = false;
    }
    
    onDown() {
        this.setter(this.downValue);
        this.isDown = true;
    }
    
    onUp() {
        this.setter(this.upValue);
        this.isDown = false;
    }
}

class ToggleBind { // This only works on key down, but that is an acceptable limitation for now.
    constructor(setter, values) {
        this.setter = setter;
        this.values = values;
        this.valueIndex = 0;
        this.isDown = false;
    }

    onDown() {
        const value = this.values[this.valueIndex];
        this.setter(value);
        this.isDown = true;
        this.valueIndex++;

        if (this.valueIndex > this.values.length - 1) {
            this.valueIndex = 0;
        }
    }
    
    onUp() {
        this.isDown = false;
    }
}

export default class Keyboard {
    constructor(element = document) {
        this.binds = {};
        element.addEventListener('keydown', this.keyDown.bind(this));
        element.addEventListener('keyup', this.keyUp.bind(this));
    }

    bindLogic(key, downLogic = null, upLogic = null) {
        if (typeof this.binds[key] == 'undefined') { this.binds[key] = []; } // create array to hold bind if none exists
        
        const bind = new LogicBind(downLogic, upLogic);
        this.binds[key].push(bind);
    }

    bindValue(key, setter, downValue = true, upValue = false) {
        if (typeof this.binds[key] == 'undefined') { this.binds[key] = []; }  // create array to hold bind if none exists

        const bind = new ValueBind(setter, downValue, upValue);
        this.binds[key].push(bind);
    }

    bindToggle(key, setter, values = [true, false]) {
        if (typeof this.binds[key] == 'undefined') { this.binds[key] = []; }  // create array to hold bind if none exists

        const bind = new ToggleBind(setter, values);
        this.binds[key].push(bind);
    }
    
    keyDown(event) {
        const key = event.key;
        const binds = this.binds[key];
        if (!binds) { return; }
        
        for (const bind of binds) {
            !bind.isDown && bind.onDown();
        }
    }

    keyUp(event) {
        const key = event.key;
        const binds = this.binds[key];
        if (!binds) { return; }
        
        for (const bind of binds) {
           bind.isDown && bind.onUp();
        }
    }
}
