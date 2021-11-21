import {React,Component} from 'react';
import Table from 'react-bootstrap/Table'
import { Route, Redirect } from 'react-router'
import {fetchGithubRepo,getURLfromId} from '../scripts/github'
import {userHasSolvedProblem} from '../scripts/util'
import getJSON from '../scripts/JSONloader'
import SearchBar from './SearchBarFilter'



class CompaniesTable extends Component {
    constructor(props){
        super(props);
        this.state = {
            data : this.props.data,
            redirect : false,
            tagFilter: ''
        };        
      
    }
    componentDidMount(){        
        this.setState({
            redirect : false
        })
    }

    handleClick(key){
        let data = this.state.data['6mo'][key];  
        let func = this.props.updateData;
        setTimeout(function(){                   
            func(data,key);
        }, 1);        
        this.setState({
            redirect : true
        })
    }

    render() {
        const keys = Object.keys(this.state.data['6mo']);
        let idx = 1;        
      return(
          <>            
            {this.state.redirect ? 
                <Redirect to ='/company'/>
                :                                
                <div class="tableContainer">    
                    <div class="m-ke934a"><div class="m-kdvz65"><div></div><div class="m-wrdtjf"><div class="m-171jxkh"></div></div></div></div>                                                       
                    <table class="m-3gmgrq mainTable">                        
                         <thead class="thead">                                        
                            <tr class="m-1itvjt0 ejhqg10">
                                <th class="m-1itvjt0"></th>
                                <th class="m-1itvjt0 filler"></th>
                                <th style={{minWidth:'5.5rem'}}class="m-1itvjt0 solved">#</th>
                                <th class="m-1itvjt0">Company</th>                                                               
                                <th class="m-1itvjt0 filler">                                    
                                </th>
                                <th class="m-1itvjt0"></th>
                            </tr>
                        </thead>
                       
                        <tbody>                                 
                            {keys.map(item =>                         
                                <tr onClick={()=>this.handleClick(item)} class="m-14j0amg e98qpmo0">
                                    <td></td>
                                    <td></td>    
                                    <td>{idx++}</td>                                
                                    <td>{item}</td>                                    
                                    <td></td>
                                    <td></td>
                                </tr>
                            )};
                                    
                        </tbody>
                            
                    </table>    
                     
                    </div>    
                 }                
                </>
      )
    }
  }
  
  export default CompaniesTable