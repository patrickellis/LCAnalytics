import React, { Component } from 'react';
import { useHistory } from "react-router-dom";
import { useEffect } from "react";
import filter from '../scripts/filter'
import companies from '../data/companyList'
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  
function onFocus(){            
    console.log("focus");
}
function onBlur(){
    console.log("blur");
    const dropEl = document.querySelector('.drop')        
    //document.getElementById('search').value="";
    dropEl.style.height = 0    
}

function SearchBarFilter(props){
    let history = useHistory();

    const handleKeyDown = (e)=>{   
        let input = capitalizeFirstLetter(e.target.value.toLowerCase());
        if(!companies.includes(input.toLowerCase())){
            console.log("input not in company list", input);
             console.log("len:",input.length)
            document.getElementById('search').style.border="1px solid red";
            return;
        }

        let data = props.data['6mo'][input];
        console.log(data);
        console.log(e.target.value);
        props.updateData(data,input);
        let path = `/company`;
        history.push(path);
    }
    
    useEffect(() => {          
      filter();
    }, []);

    return (
                    
            <div class="search-container">
                <input 
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
                <ul class="drop"></ul>
            </div>        
    );
    
}
export default SearchBarFilter