import {React,Component} from 'react';
import Table from 'react-bootstrap/Table'

import {fetchGithubRepo,getURLfromId} from '../scripts/github'
import {userHasSolvedProblem} from '../scripts/util'
import getJSON from '../scripts/JSONloader'
import CompanyData from '../data/companies/6mo/json/linkedin';

console.log(CompanyData);

class CompanyTable extends Component {
    constructor(props){
        super(props);
        this.state = {
        
        };        
      
    }
    componentDidMount(){        
            
    }

    render() {

        
      return(
                      
                <div class="tableContainer">                    
                    <table class="m-3gmgrq mainTable">
                         <thead class="thead">                                        
                            <tr class="m-1itvjt0 ejhqg10">
                                <th class="m-1itvjt0"></th>
                                <th class="m-1itvjt0 filler"></th>
                                <th class="m-1itvjt0 solved">Solved</th>
                                <th class="m-1itvjt0">#</th>
                                <th class="m-1itvjt0">Title</th>                                
                                <th class="m-1itvjt0 tablehover acceptance" onClick={this.sortByAcceptance}>
                                    Acceptance
                                    <span class="w-3.5 h-3.5 ml-2 text-gray-5 dark:text-dark-gray-5 group-hover:text-gray-7 dark:group-hover:text-dark-gray-7"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor"><path d="M18.695 9.378L12.83 3.769a1.137 1.137 0 00-.06-.054c-.489-.404-1.249-.377-1.7.06L5.303 9.381a.51.51 0 00-.16.366c0 .297.27.539.602.539h12.512a.64.64 0 00.411-.146.501.501 0 00.028-.762zM12.77 20.285c.021-.017.042-.035.062-.054l5.863-5.609a.5.5 0 00-.028-.762.64.64 0 00-.41-.146H5.743c-.332 0-.601.242-.601.54a.51.51 0 00.16.365l5.769 5.606c.45.437 1.21.464 1.698.06z"></path></svg></span>
                                </th>
                                <th class="m-1itvjt0 tablehover" onClick={this.sortByDifficulty}>
                                    Difficulty
                                    <span class="w-3.5 h-3.5 ml-2 text-gray-5 dark:text-dark-gray-5 group-hover:text-gray-7 dark:group-hover:text-dark-gray-7"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor"><path d="M18.695 9.378L12.83 3.769a1.137 1.137 0 00-.06-.054c-.489-.404-1.249-.377-1.7.06L5.303 9.381a.51.51 0 00-.16.366c0 .297.27.539.602.539h12.512a.64.64 0 00.411-.146.501.501 0 00.028-.762zM12.77 20.285c.021-.017.042-.035.062-.054l5.863-5.609a.5.5 0 00-.028-.762.64.64 0 00-.41-.146H5.743c-.332 0-.601.242-.601.54a.51.51 0 00.16.365l5.769 5.606c.45.437 1.21.464 1.698.06z"></path></svg></span>
                                </th>
                                <th class="m-1itvjt0 tablehover"  onClick={this.sortByFrequency}>
                                    Frequency
                                    <span class="w-3.5 h-3.5 ml-2 text-gray-5 dark:text-dark-gray-5 group-hover:text-gray-7 dark:group-hover:text-dark-gray-7"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor"><path d="M18.695 9.378L12.83 3.769a1.137 1.137 0 00-.06-.054c-.489-.404-1.249-.377-1.7.06L5.303 9.381a.51.51 0 00-.16.366c0 .297.27.539.602.539h12.512a.64.64 0 00.411-.146.501.501 0 00.028-.762zM12.77 20.285c.021-.017.042-.035.062-.054l5.863-5.609a.5.5 0 00-.028-.762.64.64 0 00-.41-.146H5.743c-.332 0-.601.242-.601.54a.51.51 0 00.16.365l5.769 5.606c.45.437 1.21.464 1.698.06z"></path></svg></span>
                                </th>
                                <th class="m-1itvjt0 filler"></th>
                                <th class="m-1itvjt0"></th>
                            </tr>
                        </thead>
                       
                        <tbody>     
                            {/*}                       
                            {this.state.data.map(item =>                         
                                <tr onClick={()=>this.handleClick(item['#'])} class="m-14j0amg e98qpmo0">
                                    <td></td>
                                    <td></td>
                                    <td>{this.isSolved(item['#'])?
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" class="w-[18px] h-[18px] text-green-s dark:text-dark-green-s"><path fill-rule="evenodd" d="M9.688 15.898l-3.98-3.98a1 1 0 00-1.415 1.414L8.98 18.02a1 1 0 001.415 0L20.707 7.707a1 1 0 00-1.414-1.414l-9.605 9.605z" clip-rule="evenodd"></path></svg>
                                        :
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" class="w-[18px] h-[18px] text-gray-5 dark:text-dark-gray-5"><path fill-rule="evenodd" d="M4 12a1 1 0 011-1h14a1 1 0 110 2H5a1 1 0 01-1-1z" clip-rule="evenodd"></path></svg>                                        
                                        }</td>
                                    <td>{item['#']}.</td>
                                    <td>{item['Title']}</td>                                    
                                    <td>{item['Acceptance']}</td>
                                    <td style={item['Difficulty']=='Easy'?{color:'rgba(0,175,155,1)'}:item['Difficulty']=='Medium'?{color:'rgba(255,184,0,1'}:{color:'rgba(255,45,85,1)'}}>{item['Difficulty']}</td>
                                    <td><div class="frequency-bar" style={{width:item['Frequency']+'%'}}></div></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                            )};
                                    */}
                        </tbody>
                    </table>    
                     }
                    </div>                    
                
      )
    }
  }
  
  export default CompanyTable