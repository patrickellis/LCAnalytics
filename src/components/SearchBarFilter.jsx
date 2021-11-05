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
    const box = document.querySelector('.ekk3vtk3');       
    console.log("blur");
    const dropEl = document.querySelector('.drop')        
    //document.getElementById('search').value="";
    dropEl.style.height = 0;
    box.style.borderBottomLeftRadius ='5px';
    box.style.borderBottomRightRadius ='5px';  
}

function SearchBarFilter(props){
    let history = useHistory();

    const handleKeyDown = (e)=>{   
        const box = document.querySelector('.ekk3vtk3');        
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
        document.querySelector('.drop').style.height = 0;
        
        box.style.borderBottomLeftRadius ='5px';
        box.style.borderBottomRightRadius ='5px';
        let path = `/company`;
        history.push(path);
    }
    
    useEffect(() => {          
      filter();
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