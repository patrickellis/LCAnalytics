import {React,Component} from 'react';
import problemIdToCategories from '../data/problemIdToCategories.json'
import {getURLfromId} from '../scripts/github'
import Pagination from './Pagination';
import DifficultyCircle from './DifficultyCircle';
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
function getColor(item){
    var itemname = item.toLowerCase();    
    itemname = itemname.split(' ').join('-');    
    for(let i = 0; i < TAGS.length; ++i){
        if(TAGS[i]==itemname){     
            var idx = i;      
            if(idx >= COLORS.length){
                idx = idx % COLORS.length;
            }            
            var blockColor = COLORS[idx];
            var backgroundColor = blockColor.replace(')',',0.20)');            
            return [blockColor,backgroundColor];
        }
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

class ProfileTableNew extends Component {
    constructor(props){
        super(props);
        this.state = {
            SRSdata : this.props.userData['SRS_data'],
            isLoaded : true,
            data: [],
            userData: this.props.userData,   
            tagsChecked: true,
            tagFilter: 'All',
            filteredData: [],     
            currentIndex : 1,
            totalCount : 0,
            pageSize : 25,
            currentData : []
        };        
        this.isSolved = this.isSolved.bind(this);
        this.setEventListeners = this.setEventListeners.bind(this);       
        this.sortByAcceptance = this.sortByAcceptance.bind(this);
        this.sortBydifficulty = this.sortBydifficulty.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.onCheckChange = this.onCheckChange.bind(this);
        this.onSelectChange = this.onSelectChange.bind(this);
        this.setCurrentPage = this.setCurrentPage.bind(this); 
        this.getCategories = this.getCategories.bind(this);
        this.sortByCompleted = this.sortByCompleted.bind(this);
        this.sortByDueDate = this.sortByDueDate.bind(this);
        this.resetClick = this.resetClick.bind(this);
    }
    componentDidMount(){     
        let newData = [];
        let ids_solved = this.props.userData.ids_solved;

        for(let i = 0; i < ids_solved?.length; ++i){            
            newData.push(this.props.userData['SRS_data']['id_to_obj'][ids_solved[i]]);            
        }
        this.setState({            
            data : newData,
            filteredData : newData,   
            currentData : newData.slice(0,25),         
            currentIndex : 1,
            totalCount : this.state.data.length,
            pageSize : 25            
        })
        /*
        
        let newData = []  

        for(let i = 0; i < this.state.data.length; ++i){
            let item = this.state.data[i];
            let level = item['level'];
            if(level == 1) level = 'Easy';
            if(level == 2) level = 'Medium';
            if(level == 3) level = 'Hard';
            item['difficulty'] = level;
            newData.push(item);
        }        
        this.setState({
            data : newData
        })        
        */
    }
    setCurrentPage(page){
        this.setState({            
            currentIndex : page,
            currentData : this.state.filteredData.slice((page-1) * 25, (page-1)*25+25)
        })
    }
    componentWillReceiveProps(nextProps) {        
        // You don't have to do this check first, but it can help prevent an unneeded render
        
        if (nextProps.isLoaded !== this.state.isLoaded) {
          this.setState({                
               isLoaded: nextProps.isLoaded,              
               userData : nextProps.userData
            });
        }       
        this.setState({
            data : nextProps.data,
        },()=>this.onSelectChange());
        
      }
    setEventListeners(){
        // nothing done here for now      
    }
    sortByCompleted(){        
        var newData = this.state.filteredData;        
        if(newData.length < 2) return;
        if(this.isSolved(newData[0]['#'])){
            newData.sort((a,b) => {
                let as = this.isSolved(a['#']);
                let bs = this.isSolved(b['#']);
                return as > bs ? 1 : as == bs ? 0 : -1;
            })}
        else{
            newData.sort((a,b) => {
                let as = this.isSolved(a['#'])?1:0;
                let bs = this.isSolved(b['#'])?1:0;
                return as > bs ? -1 : as == bs ? 0 : 1;
            });
        }
        this.setState({
            filteredData : newData,
            currentData : newData.slice((this.state.currentIndex-1) * 25, (this.state.currentIndex-1)*25+25)
        })
        }
    sortBydifficulty(){        
        var newData = this.state.filteredData;
        if(newData.length < 2) return;
        const dtoi = {'Easy':0,'Medium':1,'Hard':2}
        if(dtoi[newData[0]['difficulty']] > dtoi[newData[newData.length-1]['difficulty']]){
            newData.sort((a,b) => dtoi[a['difficulty']] > dtoi[b['difficulty']] ? 1 : -1)
        } else {
            newData.sort((a,b) => dtoi[a['difficulty']] < dtoi[b['difficulty']] ? 1 : -1)
        }        
        this.setState({
            filteredData : newData,
            currentData : newData.slice((this.state.currentIndex-1) * 25, (this.state.currentIndex-1)*25+25)
        })
    }

    sortByDueDate(){        
        var newData = this.state.filteredData;
        const id_to_level = this.props.userData.SRS_data['id_to_level'];
        if(newData.length < 2) return;
        // id_to_level[a['id']]
        if(parseInt(id_to_level[newData[0]['id']]) > parseInt(id_to_level[newData[newData.length-1]['id']])){
            newData.sort((a,b) => (parseInt(id_to_level[a['id']]) > parseInt(id_to_level[b['id']]))? 1 : -1)
        } else {
            newData.sort((a,b) => (parseInt(id_to_level[a['id']]) < parseInt(id_to_level[b['id']]))? 1 : -1)
        }                
        this.setState({
            filteredData : newData,
            currentData : newData.slice((this.state.currentIndex - 1)* 25, (this.state.currentIndex-1)*25+25)
        })
    }
    
    sortByAcceptance(){        
        var newData = this.state.filteredData;
        if(newData.length < 2) return;
        if(parseFloat(newData[0]['Frequency']) > parseFloat(newData[1]['Frequency'])){
            newData.sort((a,b) => (parseFloat(a['Acceptance'].substr(0,a['Acceptance'].length-1)) > parseFloat(b['Acceptance'].substr(0,b['Acceptance'].length-1)))? 1 : -1)
        } else {
            newData.sort((a,b) => (parseFloat(a['Acceptance'].substr(0,a['Acceptance'].length-1)) < parseFloat(b['Acceptance'].substr(0,b['Acceptance'].length-1)))? 1 : -1)
        }        
        this.setState({
            filteredData : newData,
            currentData : newData.slice(this.state.currentIndex * 25, this.state.currentIndex*25+25)
        })
    }
    onCheckChange(){        
        this.setState({
            tagsChecked : !this.state.tagsChecked
        })
    }
    getCategories(id){
        const keys = Object.keys(problemIdToCategories);
        if(inArray(keys,id)){
            return problemIdToCategories[id];
        }
        return []
    }
    onSelectChange(){
    
        let tag = document.getElementById('tags-select').value;
        let filteredData = []
        for(let i = 0; i < this.state.data.length; ++i){
            if(tag == 'All'){
                filteredData = this.state.data;
                break;
            }
            if(inArray(this.getCategories(this.state.data[i]['id']),tag))
                filteredData.push(this.state.data[i]);
        }
        this.setState({
            tagFilter : document.getElementById('tags-select').value,
            filteredData : filteredData,
            currentData : filteredData.slice(0,25),
            currentIndex: 1,
            totalCount : filteredData.length            
        })
    }

    isSolved(id){
        if(this.state.userData['user_solved_dict']){
            return this.state.userData['user_solved_dict'][id];
        }
        return false;        
    }
    resetClick(id){        
        // 1. update item in state 
        let data = this.state.SRSdata;
        data['id_to_level'][id] = 1;
        this.setState({SRSdata : data},()=>this.forceUpdate());
        // 2. update localstorage
        if (localStorage.getItem("resetIds") === null) {
            let resetIds = {id : new Date()};
            localStorage.setItem('resetIds',JSON.stringify(resetIds));    
            return;        
          }        
        let resetIds = JSON.parse(localStorage.getItem('resetIds'));        
        resetIds[id] = new Date();
        localStorage.setItem('resetIds',JSON.stringify(resetIds));                
    }
    handleClick(id){
        window.open(getURLfromId(id), '_blank').focus();        
    }
    /** 
                <Pagination
                className="pagination-bar"
                currentPage={this.state.currentIndex}
                totalCount={this.state.numProblems}
                pageSize={25}
                onPageChange={page => this.setCurrentPage(page)}
            />*/

    render() {
        const {isLoaded, currentData} = this.state;
        const data = this.state.SRSdata;
      return(
          <>                
                <div class="tableContainer">
                    { isLoaded &&  
                    <table class="m-3gmgrq mainTable">
                        
                         <thead class="thead">                                        
                            <tr class="m-1itvjt0 ejhqg10">
                                <th class="m-1itvjt0" style={{minWidth:'3rem'}}></th>                                
                                {/*<th class="m-1itvjt0 idHeader">#</th>*/}
                                <th class="m-1itvjt0 titleHeader2">Title</th>   
                                <th class="m-1itvjt0 tagsHeader">
                                 <div class="switchtextcont">
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
                                <th class="m-1itvjt0 tablehover difficultyHeader" onClick={this.sortBydifficulty}>
                                    difficulty
                                    <span class="w-3.5 h-3.5 ml-2 text-gray-5 dark:text-dark-gray-5 group-hover:text-gray-7 dark:group-hover:text-dark-gray-7"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor"><path d="M18.695 9.378L12.83 3.769a1.137 1.137 0 00-.06-.054c-.489-.404-1.249-.377-1.7.06L5.303 9.381a.51.51 0 00-.16.366c0 .297.27.539.602.539h12.512a.64.64 0 00.411-.146.501.501 0 00.028-.762zM12.77 20.285c.021-.017.042-.035.062-.054l5.863-5.609a.5.5 0 00-.028-.762.64.64 0 00-.41-.146H5.743c-.332 0-.601.242-.601.54a.51.51 0 00.16.365l5.769 5.606c.45.437 1.21.464 1.698.06z"></path></svg></span>
                                </th>
                                <th class="m-1itvjt0 tablehover frequencyHeader"  onClick={this.sortByDueDate}>
                                    Due Again In
                                    <span class="w-3.5 h-3.5 ml-2 text-gray-5 dark:text-dark-gray-5 group-hover:text-gray-7 dark:group-hover:text-dark-gray-7"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor"><path d="M18.695 9.378L12.83 3.769a1.137 1.137 0 00-.06-.054c-.489-.404-1.249-.377-1.7.06L5.303 9.381a.51.51 0 00-.16.366c0 .297.27.539.602.539h12.512a.64.64 0 00.411-.146.501.501 0 00.028-.762zM12.77 20.285c.021-.017.042-.035.062-.054l5.863-5.609a.5.5 0 00-.028-.762.64.64 0 00-.41-.146H5.743c-.332 0-.601.242-.601.54a.51.51 0 00.16.365l5.769 5.606c.45.437 1.21.464 1.698.06z"></path></svg></span>
                                </th>
                                <th class="m-1itvjt0 tablehover frequencyHeader">                                    
                                    Actions
                                </th>
                                <th class="m-1itvjt0"></th>
                            </tr>
                        </thead>
                       
                        <tbody>                            
                            {currentData.map(item =>                              
                                this.state.tagFilter == 'All'?                               
                                <tr class="m-14j0amg e98qpmo0">                                    
                                    <td onClick={()=>this.handleClick(item['id'])}></td>
                                    
                                    {/*<td>{item['id']}.</td>*/}
                                    <td onClick={()=>this.handleClick(item['id'])}class="problemslugtext bold">{item['title']}</td>     
                                    <td onClick={()=>this.handleClick(item['id'])} class="tags">                                                                       
                                                                                
                                            <>
                                            <div class="upperdiv" style={this.getCategories(item['id']).length <= 3 ? {top : '0.5rem'} : {}}>                                       
                                            {this.getCategories(item['id']).slice(0,3).map(e =>     
                                                this.state.tagsChecked?                                        
                                                <span class="tagItem" style={{background:getTagStyle(e)[1],color:getTagStyle(e)[0]}}>• {e}</span>
                                                :
                                                <span class="tagItem" style={{background:'#000'}}>***</span>                                                                                  
                                            )}</div>
                                            <div class="upperdiv">                                       
                                            {this.getCategories(item['id']).slice(3,7).map(e =>     
                                                this.state.tagsChecked?                                        
                                                <span class="tagItem" style={{background:getTagStyle(e)[1],color:getTagStyle(e)[0]}}>• {e}</span>
                                                :
                                                <span class="tagItem" style={{background:'#000'}}>***</span>                                                                                  
                                            )}</div>
                                            </>                                                                          
                                                                                                                                              
                                    </td>                               
                                    {/*<td>{item['Acceptance']}</td>*/}
                                    <td onClick={()=>this.handleClick(item['id'])} style={item['difficulty']=='Easy'?{color:'rgba(0,175,155,1)'}:item['difficulty']=='Medium'?{color:'rgba(255,184,0,1'}:{color:'rgba(255,45,85,1)'}}>                                        
                                        <DifficultyCircle difficulty={item['difficulty']}/>
                                        {/**<div style={{display:'inline-block'}}>{item['difficulty']}</div>**/}
                                    </td>                                    
                                    <td onClick={()=>this.handleClick(item['id'])}><div class="">{data['level_to_gap'][data['id_to_level'][item['id']]]} days</div></td>
                                    <td><div class="reset" onClick={()=>this.resetClick(item['id'])}>Reset</div></td>
                                    <td class="bookend"></td>                                    
                                </tr>
                                :
                                inArray(this.getCategories(item['id']),this.state.tagFilter)?                                
                                <tr onClick={()=>this.handleClick(item['id'])} class="m-14j0amg e98qpmo0">                                    
                                    <td></td>
                                                                    
                                    <td class="problemslugtext">{item['title']}</td>     
                                    <td class="tags">                                                                                                                           
                                         
                                            <>
                                            <div class="upperdiv" style={this.getCategories(item['id']).length <= 3 ? {top : '0.5rem'} : {}}>                                       
                                                {this.getCategories(item['id']).slice(0,3).map(e => 
                                                    this.state.tagsChecked?                                            
                                                    <span class="tagItem" style={{background:getTagStyle(e)[1],color:getTagStyle(e)[0]}}>• {e}</span>
                                                    :
                                                    <span class="tagItem" style={{background:'#000'}}>***</span>

                                                 )}</div>
                                            <div class="upperdiv">                                       
                                            {this.getCategories(item['id']).slice(3,7).map(e =>     
                                                this.state.tagsChecked?                                        
                                                <span class="tagItem" style={{background:getTagStyle(e)[1],color:getTagStyle(e)[0]}}>• {e}</span>
                                                :
                                                <span class="tagItem" style={{background:'#000'}}>***</span>                                                                                  
                                            )}</div>
                                            </>
                                        
                                                                                                                                              
                                    </td>                               
                                    {/*<td>{item['Acceptance']}</td>*/}
                                    <td onClick={()=>this.handleClick(item['id'])} style={item['difficulty']=='Easy'?{color:'rgba(0,175,155,1)'}:item['difficulty']=='Medium'?{color:'rgba(255,184,0,1'}:{color:'rgba(255,45,85,1)'}}>                                        
                                        <DifficultyCircle difficulty={item['difficulty']}/>
                                        {/**<div style={{display:'inline-block'}}>{item['difficulty']}</div>**/}
                                    </td>    
                                    <td><div class="">{data['level_to_gap'][data['id_to_level'][item['id']]]} days</div></td>
                                    <td><div class="reset">Reset</div></td>
                                    <td class="bookend"></td>                                    
                                </tr>     
                                : <></>                           
                            )}
                            
                        </tbody>
                    </table>    
                     }
                    </div>         
                    <div class="paginationContainer">
                    <Pagination
                    className="pagination-bar"
                    currentPage={this.state.currentIndex}
                    totalCount={this.state.totalCount}
                    pageSize={25}
                    onPageChange={page => this.setCurrentPage(page)}/>
                </div>             
        </>
      )
    }
  }
  
  export default ProfileTableNew