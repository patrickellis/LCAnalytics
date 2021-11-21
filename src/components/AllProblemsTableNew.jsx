import {React,Component} from 'react';
import problemIdToCategories from '../data/problemIdToCategories.json'
import DifficultyCircle from './DifficultyCircle';
import {getURLfromId} from '../scripts/github'
import Pagination from './Pagination';
import Categories from '../data/categoryList.js';
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

class AllProblemsTable extends Component {
    constructor(props){
        super(props);
        this.state = {
            isLoaded : true,
            data: this.props.data,
            userData: this.props.userData,   
            tagsChecked: true,
            tagFilter: 'All',
            filteredData: [],     
            currentIndex : 1,
            totalCount : 0,
            pageSize : 100,
            currentData : []
        };        
        this.isSolved = this.isSolved.bind(this);
        this.setEventListeners = this.setEventListeners.bind(this);       
        this.sortByAcceptance = this.sortByAcceptance.bind(this);
        this.sortByDifficulty = this.sortByDifficulty.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.onCheckChange = this.onCheckChange.bind(this);
        this.onSelectChange = this.onSelectChange.bind(this);
        this.setCurrentPage = this.setCurrentPage.bind(this); 
        this.sortByCompleted = this.sortByCompleted.bind(this);
        this.flipNavClasses = this.flipNavClasses.bind(this);
    }
    componentDidMount(){     
        /*
        let data = this.state.data;        
        data.sort((a,b) => a['id'] < b['id'] ? -1 : 1 );
        this.setState({
            data : data
        },this.setState({
            filteredData : this.state.data,
            currentData : this.state.data.slice(0,100),
            currentIndex : 1,
            totalCount : this.state.data.length,
            pageSize : 100            
        })
        )
        */
        this.setState({
            filteredData : this.state.data,
            currentData : this.state.data.slice(0,100),
            currentIndex : 1,
            totalCount : this.state.data.length,
            pageSize : 100            
        },() => {if(this.props.initialFilter.length > 3){
            document.getElementById('tags-select').value=this.props.initialFilter;
            this.flipNavClasses(3);
            this.onSelectChange();
       }})
        
       
        /*
        
        let newData = []  

        for(let i = 0; i < this.state.data.length; ++i){
            let item = this.state.data[i];
            let level = item['level'];
            if(level == 1) level = 'Easy';
            if(level == 2) level = 'Medium';
            if(level == 3) level = 'Hard';
            item['level_text'] = level;
            newData.push(item);
        }        
        this.setState({
            data : newData
        })        
        */
    }
    flipNavClasses(id){
        console.log("Flipping nav with id: ", id);
        // this needs to be generalised to function with 5 headers///
        
        const tabs = document.getElementsByClassName('upNav');
        if(tabs[id].classList.contains('selected')) return;
        
        for(let i = 0; i < tabs.length; ++i){
            if(i==id){                
                if(!tabs[i].classList.contains('selected')){
                    tabs[i].classList.add('selected');
                    tabs[i].classList.remove('unselected');
                }
            }
            else{
                tabs[i].classList.remove('selected');
                tabs[i].classList.add('unselected');
            }
        }
    }
    setCurrentPage(page){
        this.setState({            
            currentIndex : page,
            currentData : this.state.filteredData.slice((page-1) * 100, (page-1)*100+100)
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
      }
    setEventListeners(){
        // nothing done here for now      
    }
    sortByCompleted(){
        
        var newData = this.state.filteredData;
        console.log("sorting by completed",newData.length);
        if(newData.length < 2) return;
        if(this.isSolved(newData[0]['id'])){
            newData.sort((a,b) => {
                let as = this.isSolved(a['id']);
                let bs = this.isSolved(b['id']);
                return as > bs ? 1 : as == bs ? 0 : -1;
            })}
        else{
            newData.sort((a,b) => {
                let as = this.isSolved(a['id'])?1:0;
                let bs = this.isSolved(b['id'])?1:0;
                return as > bs ? -1 : as == bs ? 0 : 1;
            });
        }
        this.setState({
            filteredData : newData,
            currentData : newData.slice((this.state.currentIndex-1) * 100, (this.state.currentIndex-1)*100+100)
        })
        }
    
    sortByDifficulty(){        
        var newData = this.state.filteredData;
        if(newData.length < 2) return;
        const dtoi = {'Easy':0,'Medium':1,'Hard':2}
        if(newData[0]['level'] > newData[newData.length-1]['level']){
            newData.sort((a,b) => a['level'] > b['level'] ? 1 : -1)
        } else {
            newData.sort((a,b) => a['level'] < b['level'] ? 1 : -1)
        }        
        this.setState({
            filteredData : newData,
            currentData : newData.slice((this.state.currentIndex-1) * 100, (this.state.currentIndex-1)*100+100)
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
            currentData : newData.slice(this.state.currentIndex * 100, this.state.currentIndex*100+100)
        })
    }
    onCheckChange(){        
        this.setState({
            tagsChecked : !this.state.tagsChecked
        })
    }
    onSelectChange(){
        console.log('select changed :', document.getElementById('tags-select').value);
        let tag = document.getElementById('tags-select').value;
        let filteredData = []
        for(let i = 0; i < this.state.data.length; ++i){
            if(tag == 'All'){
                filteredData = this.state.data;
                break;
            }
            if(inArray(this.state.data[i]['tags'],tag))
                filteredData.push(this.state.data[i]);
        }
        this.setState({
            tagFilter : document.getElementById('tags-select').value,
            filteredData : filteredData,
            currentData : filteredData.slice(0,100),
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
    
    handleClick(id){
        window.open(getURLfromId(id), '_blank').focus();        
    }
    /** 
                <Pagination
                className="pagination-bar"
                currentPage={this.state.currentIndex}
                totalCount={this.state.numProblems}
                pageSize={100}
                onPageChange={page => this.setCurrentPage(page)}
            />*/

    render() {
        const {isLoaded, currentData} = this.state;
      return(
          <>
                <div class="paginationContainer">
                    <Pagination
                    className="pagination-bar"
                    currentPage={this.state.currentIndex}
                    totalCount={this.state.totalCount}
                    pageSize={100}
                    onPageChange={page => this.setCurrentPage(page)}/>
                </div>  

                <div class="tableContainer">
                    { isLoaded &&  
                    <table class="m-3gmgrq mainTable">
                        
                         <thead class="thead">                                        
                            <tr class="m-1itvjt0 ejhqg10">
                                <th class="m-1itvjt0"></th>
                                <th onClick={this.sortByCompleted} class="m-1itvjt0 solved">
                                <span class="completedToggle w-3.5 h-3.5 ml-2 text-gray-5 dark:text-dark-gray-5 group-hover:text-gray-7 dark:group-hover:text-dark-gray-7"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor"><path d="M18.695 9.378L12.83 3.769a1.137 1.137 0 00-.06-.054c-.489-.404-1.249-.377-1.7.06L5.303 9.381a.51.51 0 00-.16.366c0 .297.27.539.602.539h12.512a.64.64 0 00.411-.146.501.501 0 00.028-.762zM12.77 20.285c.021-.017.042-.035.062-.054l5.863-5.609a.5.5 0 00-.028-.762.64.64 0 00-.41-.146H5.743c-.332 0-.601.242-.601.54a.51.51 0 00.16.365l5.769 5.606c.45.437 1.21.464 1.698.06z"></path></svg></span>
                                </th>
                                <th class="m-1itvjt0 idHeader">#</th>
                                <th class="m-1itvjt0 titleHeader">Title</th>   
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
                                            {Categories.map(item => <option value={item}>{item}</option>)}                                        
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
                            {currentData.map(item =>   
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
                                                                                
                                            <>
                                            <div class="upperdiv" style={item['tags'].length <= 3 ? {top : '0.5rem'} : {}}>                                       
                                            {item['tags'].slice(0,3).map(e =>     
                                                this.state.tagsChecked?                                        
                                                <span class="tagItem" style={{background:getTagStyle(e)[1],color:getTagStyle(e)[0]}}>• {e}</span>
                                                :
                                                <span class="tagItem" style={{background:'#000'}}>***</span>                                                                                  
                                            )}</div>
                                            <div class="upperdiv">                                       
                                            {item['tags'].slice(3,7).map(e =>     
                                                this.state.tagsChecked?                                        
                                                <span class="tagItem" style={{background:getTagStyle(e)[1],color:getTagStyle(e)[0]}}>• {e}</span>
                                                :
                                                <span class="tagItem" style={{background:'#000'}}>***</span>                                                                                  
                                            )}</div>
                                            </>                                                                          
                                                                                                                                              
                                    </td>                               
                                    {/*<td>{item['Acceptance']}</td>*/}
                                    <td onClick={()=>this.handleClick(item['id'])} style={item['level_text']=='Easy'?{color:'rgba(0,175,155,1)'}:item['difficulty']=='Medium'?{color:'rgba(255,184,0,1'}:{color:'rgba(255,45,85,1)'}}>                                        
                                        <DifficultyCircle difficulty={item['level_text']}/>
                                        {/**<div style={{display:'inline-block'}}>{item['difficulty']}</div>**/}
                                    </td> 
                                    <td class="bookend"></td>                                    
                                </tr>
                                :
                                inArray(item['tags'],this.state.tagFilter)?                                
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
                                                    
                                         
                                            <>
                                            <div class="upperdiv" style={item['tags'].length <= 3 ? {top : '0.5rem'} : {}}>                                       
                                                {item['tags'].slice(0,3).map(e => 
                                                    this.state.tagsChecked?                                            
                                                    <span class="tagItem" style={{background:getTagStyle(e)[1],color:getTagStyle(e)[0]}}>• {e}</span>
                                                    :
                                                    <span class="tagItem" style={{background:'#000'}}>***</span>

                                                 )}</div>
                                            <div class="upperdiv">                                       
                                            {item['tags'].slice(3,7).map(e =>     
                                                this.state.tagsChecked?                                        
                                                <span class="tagItem" style={{background:getTagStyle(e)[1],color:getTagStyle(e)[0]}}>• {e}</span>
                                                :
                                                <span class="tagItem" style={{background:'#000'}}>***</span>                                                                                  
                                            )}</div>
                                            </>
                                        
                                                                                                                                              
                                    </td>                               
                                    {/*<td>{item['Acceptance']}</td>*/}
                                    <td onClick={()=>this.handleClick(item['id'])} style={item['level_text']=='Easy'?{color:'rgba(0,175,155,1)'}:item['difficulty']=='Medium'?{color:'rgba(255,184,0,1'}:{color:'rgba(255,45,85,1)'}}>                                        
                                        <DifficultyCircle difficulty={item['level_text']}/>
                                        {/**<div style={{display:'inline-block'}}>{item['difficulty']}</div>**/}
                                    </td> 
                                    <td class="bookend"></td>                                    
                                </tr>     
                                : <></>                           
                            )};
                            
                        </tbody>
                    </table>    
                     }
                    </div>                    
        </>
      )
    }
  }
  
  export default AllProblemsTable