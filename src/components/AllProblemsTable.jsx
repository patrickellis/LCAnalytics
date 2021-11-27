import {React,Component} from 'react';
import Table from 'react-bootstrap/Table'
import problemIdToCategories from '../data/problemIdToCategories.json'
import {fetchGithubRepo,getURLfromId} from '../scripts/github'
import {userHasSolvedProblem} from '../scripts/util'
import getJSON from '../scripts/JSONloader'
import problems from '../data/problems.json'
import { isObjectBindingPattern } from 'typescript';
import DifficultyCircle from './DifficultyCircle';

const data = problems.reverse();

const TAGS = ['two-pointers','string','dynamic-programming','hash-table','math','depth-first-search','sorting','greedy','breadth-first-search',
'tree','binary-search','matrix','two-pointers','bit-manipulation','stack','design','heap-priority-queue','backtracking','graph','simulation',
'prefix-sum','sliding-window','linked-list','counting','union-find','recursion','binary-search-tree','trie','monotonic-stack','ordered-set',
'divide-and-conquer','bitmask','queue','memoization','geometry','game-theory','enumeration','hash-function','segment-tree','topological-sort',
'interactive','binary-indexed-tree','string-matching','data-stream','rolling-hash','shortest-path','randomized','combinatorics','iterator',
'concurrency','monotonic-queue','number-theory','merge-sort','brainteaser','probability-and-statistics','doubly-linked-list',
'quickselect','bucket-sort','minimum-spanning-tree','counting-sort','suffix-array','shell','line-sweep','reservoir-sampling',
'strongly-connected-component','eulerian-circuit','radix-sort','rejection-sampling','biconnected-component']


const COLORS =["rgb(64,129,236)", "rgb(7,92,98)", "rgb(159,102,237)", "rgb(118,7,150)", "rgb(103,72,106)", "rgb(51, 138, 96)", "rgb(161,8,92)", "rgb(31,60,166)", "rgb(39,15,226)", "rgb(116,141,19)"]

function getLevel(level){
    if(level==1) return 'Easy';
    if(level==2) return 'Medium';
    return 'Hard';
}
function getColor(tag){
    const TAG = tag.toLowerCase().split(' ').join('-');        
    let idx = 0;
    for(let category of TAGS){  
        if(TAG == category){           
            var blockColor = COLORS[idx];
            var backgroundColor = blockColor.replace(')',',0.20)');            
            return [blockColor,backgroundColor];
        }
        idx = (idx + 1) % COLORS.length;
    } 
    return ['rgb(0,0,0)','rgba(0,0,0,0.2)'];
}

function inArray(arr, item){
    if(!arr) return false;
    for(let i = 0; i < arr.length; ++i){
        if(arr[i]==item)
            return true;
    }
    return false;
}

function getTagStyle(tag){
    return getColor(tag);
}

class AllProblemsTable extends Component {
    constructor(props){
        super(props);
        this.state = {
            isLoaded : true,
            data: this.props.data,
            userData: this.props.userData,   
            tagsChecked: true,
            tagFilter: 'All'     
        };        
        this.isSolved = this.isSolved.bind(this);
        this.setEventListeners = this.setEventListeners.bind(this);       
        this.sortByAcceptance = this.sortByAcceptance.bind(this);
        this.sortByDifficulty = this.sortByDifficulty.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.onCheckChange = this.onCheckChange.bind(this);
        this.onSelectChange = this.onSelectChange.bind(this);
    }
    componentDidMount(){     
        const keys = Object.keys(problemIdToCategories);  
        
    }
    componentWillReceiveProps(nextProps) {        
        // // You don't have to do this check first, but it can help prevent an unneeded render
        // if (nextProps.isLoaded !== this.state.isLoaded) {
        //   this.setState({ 
        //        isLoaded: nextProps.isLoaded,              
        //        userData : nextProps.userData
        //     });
        // }       
      }
    setEventListeners(){
        // nothing done here for now      
    }
    sortByDifficulty(){        
        var newData = this.state.data;
        if(newData.length < 2) return;
        const dtoi = {'Easy':0,'Medium':1,'Hard':2}
        if(newData[0]['level'] > newData[newData.length-1]['level']){
            newData.sort((a,b) => a['level'] > b['level'] ? 1 : -1)
        } else {
            newData.sort((a,b) => a['level'] < b['level'] ? 1 : -1)
        }        
        this.setState({
            data : newData
        })
    }

    sortByAcceptance(){        
        var newData = this.state.data;
        if(newData.length < 2) return;
        if(parseFloat(newData[0]['Frequency']) > parseFloat(newData[1]['Frequency'])){
            newData.sort((a,b) => (parseFloat(a['Acceptance'].substr(0,a['Acceptance'].length-1)) > parseFloat(b['Acceptance'].substr(0,b['Acceptance'].length-1)))? 1 : -1)
        } else {
            newData.sort((a,b) => (parseFloat(a['Acceptance'].substr(0,a['Acceptance'].length-1)) < parseFloat(b['Acceptance'].substr(0,b['Acceptance'].length-1)))? 1 : -1)
        }        
        this.setState({
            data : newData
        })
    }
    onCheckChange(){        
        this.setState({
            tagsChecked : !this.state.tagsChecked
        })
    }
    onSelectChange(){        
        this.setState({
            tagFilter : document.getElementById('tags-select').value
        })
    }

    isSolved(id){
        if(this.state.userData['user_solved_dict']){
            return this.state.userData['user_solved_dict'][id];
        }
        return false;        
    }
    
    handleClick(id){
        window.open(getURLfromId(id), '_blank').focus();        
    }
    
    render() {
        const {isLoaded, data} = this.state;
        const keys = Object.keys(problemIdToCategories);      
        let displayAsText = false;
        if(localStorage.getItem('displayAsText')!=null){
            displayAsText = JSON.parse(localStorage.getItem('displayAsText'));
        }
      return(
                      
                <div class="tableContainer">
                    { isLoaded &&  
                    <table class="m-3gmgrq mainTable">
                        
                         <thead class="thead">                                        
                            <tr class="m-1itvjt0 ejhqg10">
                                <th class="m-1itvjt0"></th>
                                <th class="m-1itvjt0 solved"></th>
                                <th class="m-1itvjt0 idHeader">#</th>
                                <th class="m-1itvjt0 titleHeader">Title</th>   
                                <th class="m-1itvjt0 tagsHeader">
                                    <div class="tagsText">Tags</div>
                                    <div class="switchContainer">
                                        <label class="switch">
                                        <input 
                                        type="checkbox"
                                        defaultChecked={this.state.tagsChecked}
                                        onChange={this.onCheckChange}
                                        />
                                        <span class="slider round"></span>
                                     </label>    
                                    </div>
                                    <div class="selectContainer">
                                        <select name="tags" id="tags-select" onChange={this.onSelectChange}>                                            
                                            <option value="All">All</option>
                                            <option value="String">String</option>
                                            <option value="Backtracking">Backtracking</option>
                                            <option value="Binary Search">Binary Search</option>                    
                                            <option value="Bit Manipulation">Bit Manipulation</option>
                                            <option value="Breadth First Search">BFS</option>
                                            <option value="Depth First Search">DFS</option>
                                            <option value="Bucket Sort">Bucket Sort</option>
                                            <option value="Design">Design</option>
                                            <option value="Dynamic Programming">Dynamic Programming</option>                                            
                                            <option value="Graph">Graph</option>
                                            <option value="Greedy">Greedy</option>
                                            <option value="Heap Priority Queue">Heap</option>
                                            <option value="Linked List">Linked List</option>
                                            <option value="Intervals">Intervals</option>
                                            <option value="Sliding Window">Sliding Window</option>
                                            <option value="Sorting">Sorting</option>
                                            <option value="Topological Sort">Topological Sort</option>
                                            <option value="Trie">Trie</option>
                                            <option value="Two Pointers">Two Pointers</option>
                                            <option value="Union Find">Union Find</option>       
                                            <option value="Randomized">Randomized</option>                                                                                        
                                            <option value="Ordered Set">Ordered Set</option>       
                                            <option value="Strongly Connected Component">Strongly Connected Component</option>     
                                            <option value="Minimum Spanning Tree">Minimum Spanning Tree</option>     
                                            <option value="Memoization">Memoization</option>     
                                            <option value="Tree">Tree</option>     
                                            <option value="Doubly Linked List">Doubly Linked List</option>     
                                            <option value="Biconnected Component">Biconnected Component</option>   
                                            <option value="Radix Sort">Radix Sort</option>   
                                            <option value="Merge Sort">Merge Sort</option>   
                                        </select>
                                    </div>
                                </th>                                 
                                {/*
                                <th class="m-1itvjt0 tablehover acceptance" onClick={this.sortByAcceptance}>
                                    Acceptance
                                    <span class="w-3.5 h-3.5 ml-2 text-gray-5 dark:text-dark-gray-5 group-hover:text-gray-7 dark:group-hover:text-dark-gray-7"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor"><path d="M18.695 9.378L12.83 3.769a1.137 1.137 0 00-.06-.054c-.489-.404-1.249-.377-1.7.06L5.303 9.381a.51.51 0 00-.16.366c0 .297.27.539.602.539h12.512a.64.64 0 00.411-.146.501.501 0 00.028-.762zM12.77 20.285c.021-.017.042-.035.062-.054l5.863-5.609a.5.5 0 00-.028-.762.64.64 0 00-.41-.146H5.743c-.332 0-.601.242-.601.54a.51.51 0 00.16.365l5.769 5.606c.45.437 1.21.464 1.698.06z"></path></svg></span>
                                  </th>
                                */}
                                <th class="m-1itvjt0 tablehover difficultyHeader" onClick={this.sortByDifficulty}>
                                    Difficulty
                                    <span class="w-3.5 h-3.5 ml-2 text-gray-5 dark:text-dark-gray-5 group-hover:text-gray-7 dark:group-hover:text-dark-gray-7"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor"><path d="M18.695 9.378L12.83 3.769a1.137 1.137 0 00-.06-.054c-.489-.404-1.249-.377-1.7.06L5.303 9.381a.51.51 0 00-.16.366c0 .297.27.539.602.539h12.512a.64.64 0 00.411-.146.501.501 0 00.028-.762zM12.77 20.285c.021-.017.042-.035.062-.054l5.863-5.609a.5.5 0 00-.028-.762.64.64 0 00-.41-.146H5.743c-.332 0-.601.242-.601.54a.51.51 0 00.16.365l5.769 5.606c.45.437 1.21.464 1.698.06z"></path></svg></span>
                                </th>
                               
                                
                                <th class="m-1itvjt0"></th>
                            </tr>
                        </thead>
                       
                        <tbody>                            
                            {this.state.data.map(item =>   
                                this.state.tagFilter == 'All'?
                               
                                <tr onClick={()=>this.handleClick(item['id'])} class="m-14j0amg e98qpmo0">                                    
                                    <td></td>
                                    <td class="solved">{this.isSolved(item['id'])?
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" class="w-[18px] h-[18px] text-green-s dark:text-dark-green-s"><path fill-rule="evenodd" d="M9.688 15.898l-3.98-3.98a1 1 0 00-1.415 1.414L8.98 18.02a1 1 0 001.415 0L20.707 7.707a1 1 0 00-1.414-1.414l-9.605 9.605z" clip-rule="evenodd"></path></svg>
                                        :
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" class="w-[18px] h-[18px] text-gray-5 dark:text-dark-gray-5"><path fill-rule="evenodd" d="M4 12a1 1 0 011-1h14a1 1 0 110 2H5a1 1 0 01-1-1z" clip-rule="evenodd"></path></svg>                                        
                                        }</td>
                                    <td>{item['id']}.</td>
                                    <td class="bold">{item['title']}</td>     
                                    <td class="tags">                                                                       
                                        {                 
                                        inArray(keys,item['id'])?    
                                            <>
                                            <div class="upperdiv" style={problemIdToCategories[item['id']].length <= 3 ? {top : '0.5rem'} : {}}>                                       
                                            {problemIdToCategories[item['id']].slice(0,3).map(e =>     
                                                this.state.tagsChecked?                                        
                                                <span class="tagItem" style={{background:getTagStyle(e)[1],color:getTagStyle(e)[0]}}>• {e}</span>
                                                :
                                                <span class="tagItem" style={{background:'#000'}}>***</span>                                                                                  
                                            )}</div>
                                            <div class="upperdiv">                                       
                                            {problemIdToCategories[item['id']].slice(3,7).map(e =>     
                                                this.state.tagsChecked?                                        
                                                <span class="tagItem" style={{background:getTagStyle(e)[1],color:getTagStyle(e)[0]}}>• {e}</span>
                                                :
                                                <span class="tagItem" style={{background:'#000'}}>***</span>                                                                                  
                                            )}</div>
                                            </>
                                        :<></>}                                        
                                                                                                                                              
                                    </td>                               
                                    {/*<td>{item['Acceptance']}</td>*/}
                                    <td style={getLevel(item['level'])=='Easy'?{color:'rgba(0,175,155,1)'}:getLevel(item['level'])=='Medium'?{color:'rgba(255,184,0,1'}:{color:'rgba(255,45,85,1)'}}>
                                        
                                        {displayAsText ? 
                                            <div style={{display:'inline-block'}}>{getLevel(item['level'])}</div>
                                            :                                        
                                                <DifficultyCircle difficulty={getLevel(item['level'])}/>
                                            }
                                        </td>                                    
                                    <td class="bookend"></td>                                    
                                </tr>
                                :
                                inArray(problemIdToCategories[item['id']],this.state.tagFilter)?                                
                                <tr onClick={()=>this.handleClick(item['id'])} class="m-14j0amg e98qpmo0">                                    
                                    <td></td>
                                    <td class="solved">{this.isSolved(item['id'])?
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" class="w-[18px] h-[18px] text-green-s dark:text-dark-green-s"><path fill-rule="evenodd" d="M9.688 15.898l-3.98-3.98a1 1 0 00-1.415 1.414L8.98 18.02a1 1 0 001.415 0L20.707 7.707a1 1 0 00-1.414-1.414l-9.605 9.605z" clip-rule="evenodd"></path></svg>
                                        :
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" class="w-[18px] h-[18px] text-gray-5 dark:text-dark-gray-5"><path fill-rule="evenodd" d="M4 12a1 1 0 011-1h14a1 1 0 110 2H5a1 1 0 01-1-1z" clip-rule="evenodd"></path></svg>                                        
                                        }</td>
                                    <td>{item['id']}.</td>
                                    <td>{item['title']}</td>     
                                    <td class="tags">                                                                       
                                        {                 
                                        inArray(keys,item['id'])?    
                                            <>
                                            <div class="upperdiv">                                       
                                                {problemIdToCategories[item['id']].slice(0,3).map(e => 
                                                    this.state.tagsChecked?                                            
                                                    <span class="tagItem" style={{background:getTagStyle(e)[1],color:getTagStyle(e)[0]}}>• {e}</span>
                                                    :
                                                    <span class="tagItem" style={{background:'#000'}}>***</span>

                                                 )}</div>
                                            <div class="upperdiv">                                       
                                            {problemIdToCategories[item['id']].slice(3,7).map(e =>     
                                                this.state.tagsChecked?                                        
                                                <span class="tagItem" style={{background:getTagStyle(e)[1],color:getTagStyle(e)[0]}}>• {e}</span>
                                                :
                                                <span class="tagItem" style={{background:'#000'}}>***</span>                                                                                  
                                            )}</div>
                                            </>
                                        :<></>}                                        
                                                                                                                                              
                                    </td>                               
                                    {/*<td>{item['Acceptance']}</td>*/}
                                    <td style={getLevel(item['level'])=='Easy'?{color:'rgba(0,175,155,1)'}:getLevel(item['level'])=='Medium'?{color:'rgba(255,184,0,1'}:{color:'rgba(255,45,85,1)'}}>{getLevel(item['level'])}</td>                                                                      
                                    <td class="bookend"></td>                                    
                                </tr>     
                                : <></>                           
                            )};
                            
                        </tbody>
                    </table>    
                     }
                    </div>                    
                
      )
    }
  }
  
  export default AllProblemsTable