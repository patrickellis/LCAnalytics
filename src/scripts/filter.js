
import words from '../data/companyList'
/**
 * this function is the active filter that displays li elements for companies dynamically as they are typed in the search box
 */
function filter(){    
    const containerEl = document.querySelector('.container')
    const formEl = document.querySelector('#search')
    const dropEl = document.querySelector('.drop')
    const box = document.querySelector('.ekk3vtk3');
    const formHandler = (e) => {
        const userInput = e.target.value.toLowerCase()
        const lengthInput = userInput.length;
        if(userInput.length === 0) {
            box.style.borderBottomLeftRadius ='5px';
            box.style.borderBottomRightRadius ='5px';
            dropEl.style.height = 0
            return dropEl.innerHTML = ''              
        }

        const filteredWords = words.filter(word => word.toLowerCase().includes(userInput)).sort().splice(0, 5)
        
        dropEl.innerHTML = ''
        filteredWords.forEach(item => {
            const listEl = document.createElement('li')
            const spanColored = document.createElement('span');
            const spanUncolored = document.createElement('span');
            spanColored.classList.add('spanColored');
            spanUncolored.classList.add('spanUncolored');
            listEl.addEventListener('click', ()=>{                
                formEl.value=item;
                formEl.focus();
            })
            spanColored.textContent = item.slice(0,lengthInput);
            spanUncolored.textContent=item.slice(lengthInput,item.length);
            if(item === userInput) {
                listEl.classList.add('match')
            }
            listEl.appendChild(spanColored);
            listEl.appendChild(spanUncolored);
            dropEl.appendChild(listEl)
        })

        if(dropEl.children[0] === undefined) {
            box.style.borderBottomLeftRadius ='5px';
            box.style.borderBottomRightRadius ='5px';
            return dropEl.style.height = 0
        }
        
        box.style.borderBottomLeftRadius ='0px';
        box.style.borderBottomRightRadius ='0px';
        let totalChildrenHeight = dropEl.children[0].offsetHeight * filteredWords.length
        dropEl.style.height = totalChildrenHeight + 'px'

    }

    formEl.addEventListener('input', formHandler)
}

export default filter