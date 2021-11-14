import React, { Component } from 'react';
import { useHistory } from "react-router-dom";
import { useEffect } from "react";
import filter from '../scripts/filter'
import companies from '../data/companyList'
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
 

function onFocus(){            
}
function onBlur(){
    setTimeout(function(){
        const box = document.querySelector('.ekk3vtk3');           
        const dropEl = document.querySelector('.drop')      
        if(!companies.includes(document.getElementById('search').value.toLowerCase())){
            document.getElementById('search').value="";
        }
        //document.getElementById('search').value="";
        dropEl.style.height = 0;
        box.style.borderBottomLeftRadius ='5px';
        box.style.borderBottomRightRadius ='5px';   
    }, 100);
}
function hideOnClickOutside(element) {
    const outsideClickListener = event => {
        if (!element.contains(event.target) && isVisible(element)) { // or use: event.target.closest(selector) === null
          element.style.display = 'none'
          removeClickListener()
        }
    }

    const removeClickListener = () => {
        document.removeEventListener('click', outsideClickListener)
    }

    document.addEventListener('click', outsideClickListener)
}

const isVisible = elem => !!elem && !!( elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length ) // source (2018-03-11): https://github.com/jquery/jquery/blob/master/src/css/hiddenVisibleSelectors.js 

function SearchBarFilter(props){
    let history = useHistory();

    const handleKeyDown = (e)=>{   
        const box = document.querySelector('.ekk3vtk3');        
        let input = capitalizeFirstLetter(e.target.value.toLowerCase());
        if(!companies.includes(input.toLowerCase())){

            document.getElementById('searchBox').style.border="1px solid #CF000F";
            return;
        }

        let data = props.data['6mo'][input];

        props.updateData(data,input);
        document.querySelector('.drop').style.height = 0;
        
        box.style.borderBottomLeftRadius ='5px';
        box.style.borderBottomRightRadius ='5px';
        let path = `/company`;
        history.push(path);
    }
    
    useEffect(() => {          
      filter();
      hideOnClickOutside(document.querySelector('.drop'));
    }, []);

    return (
                    
            <div class="search-container">
                <input 
                  aria-autocomplete="list" aria-controls="downshift-1344-menu" aria-labelledby="downshift-1344-label" autocomplete="off" placeholder="Search…" class="m-465o7i e199xoio3"
                    onFocus={onFocus}
                    onBlur={onBlur}
                    id="search" 
                    type="text" 
                    placeholder="Search for a company..."
                    autocomplete="off"
                    onKeyPress={event => {
                        if(event.key === 'Enter') {                      
                            handleKeyDown(event);                      
                            document.getElementById('search').value='';
                    }   
                }}
                />
                
            </div>        
    );
    
}
export default SearchBarFilter