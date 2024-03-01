class CalcController {
  //DOM - Document Object Model
  //BOM - Browser Object Model
  // Reação à eventos
  // dir(document)

    constructor(){
        this._audio = new Audio('click.mp3'); // Audio web API.
        this._audioOnOff = false;
        this._lastOperator = '';
        this._lastNumber = '';
        this._operation = [];
        this._locale = 'pt-BR';
        this._displayCalcEl =  document.querySelector('#display');
        this._dateEl = document.querySelector("#data");
        this._timeEl = document.querySelector('#hora');
        this._currentDate;
        this.initialize();
        this.initButtonsEvents();
        this.initKeyboard();

    }

    pasteFromClipboard() {
        document.addEventListener('paste', e =>{
           let text =  e.clipboardData.getData('Text');
           this.displayCalc = parseFloat(text)
        })
    }

    copyToClipboard() {

        let input = document.createElement('input');

        input.value =  this.displayCalc;

        document.body.appendChild(input);

        input.select();

        document.execCommand('Copy')

        input.remove();
        
    }


    initialize() {

        this.displayCalc = '0'
        //this.displayDate(this.data.toLocaleDateString('pt-BR'))
        //this.displayTime(this.data.toLocaleTimeString())
        setInterval(() => {
            
            this.setDisplayDateTime();
        
        }, 1000)

        this.setLastNumberToDisplay();
        this.pasteFromClipboard();

        /**Inicializar o doubleclick */

        document.querySelectorAll('.btn-ac').forEach(btn => {
            btn.addEventListener('dblclick', e => {
                this.toggleAudio();
            })
        })


    }

    toggleAudio(){

        // if (this._audioOnOff) {
        //     this._audioOnOff = false;
        // } else {
        //     this._audioOnOff = true;
        // }
        /**refatorando um */
        //this._audioOnOff = (this._audioOnOff) ? false : true;
        /**refatorando dois */
        this._audioOnOff = !this._audioOnOff;
    }

    playAudio(){

        if (this._audioOnOff) {
            this._audio.currentTime = 0;
            this._audio.play();
        }

    }

    initKeyboard() {

        this.playAudio()

        document.addEventListener('keyup', e => {
           
            switch(e.key) {
                case 'Escape': 
                    this.clearAll();
                    break;
                case 'Backspace': 
                    this.clearEntry();
                    break;
                case '+':
                case '-':
                case '/':
                case '*':
                case '%':
                    this.addOperation(e.key);
                    break;
                case '=':
                case 'Enter':
                    this.calc();
                    break;
                case '.':
                case ',':
                    this.addDot('.');
                    break;
                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                    this.addOperation(parseInt(e.key));
                    break;
                case 'c':
                    if (e.ctrlKey) {
                        this.copyToClipboard();
                    }
                    break;
            }
        })
    }

    addEventListenerAll(element, events, fn){
        events.split(' ').forEach(event => {
            element.addEventListener(event, fn, false); 
        })
    }

    clearAll(){

        this._operation = [];
        this._lastNumber ='';
        this._lastOperator = '';
        this.setLastNumberToDisplay();

    }

    clearEntry(){

        this._operation.pop();
        this.setLastNumberToDisplay();

    }

    setError(){

        this.displayCalc = 'Error';

    }

    getLastOperation(){

        return this._operation[this._operation.length -1];

    }

    setLastOperation(value) {

        this._operation[this._operation.length-1] = value;
        
    }


    
    pushOperation(value) {

        this._operation.push(value);

        if (this._operation.length > 3) {
            this.calc();
        }
    }

    getResult() {
        try {
            return eval(this._operation.join(""));

        } catch(e){
            setTimeout(() => {
                this.setError();
            }, 1)

        }
    }

    calc() {
        let last = '';

        this._lastOperator = this.getLastItem();

        if(this._operation.length < 3) {

            let firstItem = this._operation[0];
            this._operation = [firstItem, this._lastOperator, this._lastNumber];

        }


        if(this._operation.length > 3) {
            
            last = this._operation.pop();
            this._lastNumber = this.getResult();

        } else if (this._operation.length == 3) {
            this._lastNumber = this.getLastItem(false)
        }


        let result =  this.getResult();
      

        if (last === "%") {
            result /= 100; 
            this._operation =[result]
        } else {
            this._operation = [result];
            if (last) {
                this._operation.push(last)
            }
        }

        this.setLastNumberToDisplay();

    }

    getLastItem(isOperator = true) {
        let lastItem;

       for(let i = this._operation.length -1; i >= 0; i--) {

        if(this.isOperator(this._operation[i]) == isOperator){
            lastItem = this._operation[i];
            break
        }
       }

       if(!lastItem) {
            lastItem = (isOperator) ? this._lastOperator : this._lastNumber;
       }

       return lastItem;

    }

    setLastNumberToDisplay(){
      
       let lastNumber = this.getLastItem(false);
             
       if(!lastNumber) {

            lastNumber = 0;

       }

       this.displayCalc = lastNumber

    }


    isOperator(value){
        return (['+','-','*','/','%'].indexOf(value) > -1);
    }


    addOperation(value) {
    

        if (isNaN(this.getLastOperation())){
            // não é um numero 

            if (this.isOperator(value)) {

                this.setLastOperation(value);
                
            // } else if(isNaN(value)) {
                
            //    console.log("outra coisa")


            } else {
                //this.setLastOperation(value)
                this.pushOperation(value)
                this.setLastNumberToDisplay();
            }


        } else {

            if (this.isOperator(value)) {

                this.pushOperation(value);
               // this._operation.push(value);
            
            }  else {
                let newValue = this.getLastOperation().toString() + value.toString();
                this.setLastOperation(newValue);

                this.setLastNumberToDisplay();

            }


            
        }

    }


    addDot(){
        let lastOperation = this.getLastOperation();
        
        if (typeof lastOperation === 'string' && lastOperation.split('').indexOf('.') > -1) {
            return;
        }

        if(this.isOperator(lastOperation) || !lastOperation) {
            this.pushOperation('0.');
        } else {
            this.setLastOperation(`${lastOperation.toString()}.`);
        }
    }

    execButton(value) {

        this.playAudio();

        switch(value) {
            case 'ac': 
                this.clearAll();
                break;
            case 'ce': 
                this.clearEntry();
                break;
            case 'soma':
                this.addOperation('+');
                break;
            case 'subtracao':
                this.addOperation('-');
                break;
            case 'divisao':
                this.addOperation('/');                
                break;
            case 'multiplicacao':
                this.addOperation('*');
                break;
            case 'porcento':
                this.addOperation('%');
                break;
            case 'igual':
                this.calc();
                break;
            case 'ponto':
                this.addDot('.');

                break;
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.addOperation(parseInt(value));
                break;
            default:
                this.setError() 
        }

    }


    /** Inicializar os eventos de todos os botões do calculadora */
    initButtonsEvents(){
        let buttons = document.querySelectorAll("#buttons > g, #parts > g");
        

        Array.from(buttons).forEach( button => {
            this.addEventListenerAll(button, 'click drag', e => {
                
               
                let textButton = button.className.baseVal.replace('btn-','');

                this.execButton(textButton)

            })

            this.addEventListenerAll(button, 'mouseover mouseup mousedown', e => {
                button.style.cursor = 'pointer';
            })

        })
      
    }


    setDisplayDateTime() {
        this.displayDate = this.currentDate.toLocaleDateString(this._locale, {
            day: "2-digit",
            month: "short", 
            year:"numeric"}
            )
        this.displayTime = this.currentDate.toLocaleTimeString()
    }

    get displayTime() {
        return this._timeEl.innerHTML;
    }

    set displayTime(value) {
        this._timeEl.innerHTML = value;
    }


    get displayDate() {
        return this._dateEl.innerHTML;

    }

    set displayDate(value) {
        this._dateEl.innerHTML = value;
    }
 

    get displayCalc() {
        return this._displayCalcEl.innerHTML;
    }

    set displayCalc(value){
        if(value.toString().length > 10) {
            this.setError();
            return false;
        }

        this._displayCalcEl.innerHTML = value
    }

    get currentDate() {
        return new Date();
    }

    set currentDate(value) {
        this._currentDate = value
    }

}