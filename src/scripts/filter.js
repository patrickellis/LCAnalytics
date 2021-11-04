
import words from '../data/companyList'
function filter(){    
    // can we use data from https://github.com/zeke/all-the-cities ?
    // lets try   
    const containerEl = document.querySelector('.container')
    const formEl = document.querySelector('#search')
    const dropEl = document.querySelector('.drop')

    const formHandler = (e) => {
        const userInput = e.target.value.toLowerCase()

        if(userInput.length === 0) {
            dropEl.style.height = 0
            return dropEl.innerHTML = ''              
        }

        const filteredWords = words.filter(word => word.toLowerCase().includes(userInput)).sort().splice(0, 5)
        
        dropEl.innerHTML = ''
        filteredWords.forEach(item => {
            const listEl = document.createElement('li')
            listEl.addEventListener('click', ()=>{
                console.log('clicked')
                formEl.value=item;
                formEl.focus();
            })
            listEl.textContent = item
            if(item === userInput) {
                listEl.classList.add('match')
            }
            dropEl.appendChild(listEl)
        })

        if(dropEl.children[0] === undefined) {
            return dropEl.style.height = 0
        }

        let totalChildrenHeight = dropEl.children[0].offsetHeight * filteredWords.length
        dropEl.style.height = totalChildrenHeight + 'px'

    }

    formEl.addEventListener('input', formHandler)
    
}

export default filter