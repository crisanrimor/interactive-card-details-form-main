document.addEventListener('DOMContentLoaded', () => {
    listenerForm();
})

const mainForm = document.querySelector('.main__form');
const cardFront = document.querySelector('.main__frontcard').children;
const cardBack = document.querySelector('.main__backcard').children;
const inputText = document.querySelectorAll('.main__input');


const listenerForm = () => {

    const content = [];
    
    mainForm.addEventListener('keyup', e => {
        const regx = /\d/;
        const regx2 = /([A-Za-z!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])+/g;
        
        if(e.target.id === 'cardholdername'){
            getValue(regx, e.target, e.target.nextElementSibling, cardFront[3].children[0], 'Jane Appleseed', 'Wrong format, letters only');
        }

        if(e.target.id === 'cardnumber'){
            getCardNumberValue(regx2, e, '0000 0000 0000 0000'.split(""), cardFront[2], content, 'Wrong format, numbers only');
        }

        if(e.target.id === 'cardmonth'){
            getValue(regx2, e.target, e.target.parentElement.nextElementSibling, cardFront[3].children[1].children[0], '00', 'Wrong format, numbers only');
        }

        if(e.target.id === 'cardyear'){
            getValue(regx2, e.target, e.target.parentElement.nextElementSibling, cardFront[3].children[1].children[1], '00', 'Wrong format, numbers only');
        }

        if(e.target.id === 'cardcvc'){
            getValue(regx2, e.target, e.target.nextElementSibling, cardBack[1], '000', 'Wrong format, numbers only');
        }

    });

    mainForm.lastElementChild.addEventListener('click', e => {
        e.preventDefault();
        let error = 0;
        const nowYear = new Date().getFullYear().toString().slice(2,4);

        inputText.forEach(element => {
            if(element.id === 'cardyear' || element.id === 'cardmonth'){

                if(element.value.length < 2 || parseInt(element.value) < 1){
                    showError(element, element.parentElement.nextElementSibling, "Incorrect date")
                    error++;
                }

                if(element.id === 'cardyear'){
                    if(element.value < nowYear){
                        showError(element, element.parentElement.nextElementSibling, "Incorrect date")
                        error++;
                    }
                }

                if(element.value === ''){
                    showError(element, element.parentElement.nextElementSibling, "Can't be blank")
                    error++;
                }
                
            }else{
                if(element.id === 'cardholdername'){
                    if(element.value.length < 6){
                        showError(element, element.nextElementSibling, "Must have at least 6 letters");
                        error++;
                    }
                }
    
                if(element.id === 'cardnumber'){
                    if(element.value.length < 19){
                        showError(element, element.nextElementSibling, "Must have 16 numbers");
                        error++;
                    }
                }
    
                if(element.id === 'cardcvc'){
                    if(element.value.length < 3){
                        showError(element, element.nextElementSibling, "Must have 3 numbers");
                        error++;
                    }
                }

                if(element.value === ''){
                    showError(element, element.nextElementSibling, "Can't be blank")
                    error++;
                }
            }

            if(element.classList.contains('error')){
                error++;
            }

        });
        
        if(error === 0){
            mainForm.innerHTML = `
            <div class="main__complete">
            <img src="images/icon-complete.svg" alt="">
            <h2 class="main__completedone">Thank you!</h2>
            <p class="main__completetext">We've added your card details</p>
            </div>
            <button type="submit" class="main__formbtn">Continue</button>
            `;
        };
    })

}

const getValue = (regex, target, contError, cardShow, defaultText, errorText) => {
    if(regex.test(target.value)){
        showError(target, contError, errorText)
    }else{
        removeError(target, contError);
        if(target.value.length === 0){
            cardShow.textContent = defaultText;
        }else{
            cardShow.textContent = target.value;
        }
    }
}

const getCardNumberValue = (regex, event, mask, cardShow, content, errorText) => {
    
    if(regex.test(event.target.value)){
        showError(event.target, event.target.nextElementSibling, errorText);
    }else{
        removeError(event.target, event.target.nextElementSibling);
        if(!isNaN(event.key - parseInt(event.key)) && content.length < mask.length - 3){
            content.push(event.key);
        }

        if(event.key === 'Backspace'){
            if(content.length > 0){
                content.pop();
            }
        }

        event.target.value = maskedValued(mask, content);
        
        for(let i = 0; i < mask.length; i++){
            if(event.target.value.length <= i){
                break;
            }else{
                if(mask[i] === '0'){
                    mask[i] = event.target.value[i];
                }
            }
        }
        cardShow.textContent = mask.join("");
    }

}

const maskedValued = (mask, content) => {
    let masked = '';
    let position = 0;
    let currentChar = 0;

    while(position < mask.length && currentChar < content.length){
        if(mask[position] === '0'){
            masked += content[currentChar];
            currentChar++;
        }else{
            masked += mask[position];
        }
        position++;
    }

    return masked;
}

const showError = (target, contError, errorText) => {
    target.classList.add('error');
    contError.style.display = 'block';
    contError.textContent = errorText;
}

const removeError = (target, contError) => {
    target.classList.remove('error');
    contError.style.display = 'none';
    contError.textContent = '';
}










