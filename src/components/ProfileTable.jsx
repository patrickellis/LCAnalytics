import {React,Component} from 'react';
import Table from 'react-bootstrap/Table'
import problemIdToCategories from '../data/problemIdToCategories.json'
import {fetchGithubRepo,getURLfromId} from '../scripts/github'
import {userHasSolvedProblem} from '../scripts/util'
import getJSON from '../scripts/JSONloader'

const TAGS = ['two-pointers','string','dynamic-programming','hash-table','math','depth-first-search','sorting','greedy','breadth-first-search',
'tree','binary-search','matrix','two-pointers','bit-manipulation','stack','design','heap-priority-queue','backtracking','graph','simulation',
'prefix-sum','sliding-window','linked-list','counting','union-find','recursion','binary-search-tree','trie','monotonic-stack','ordered-set',
'divide-and-conquer','bitmask','queue','memoization','geometry','game-theory','enumeration','hash-function','segment-tree','topological-sort',
'interactive','binary-indexed-tree','string-matching','data-stream','rolling-hash','shortest-path','randomized','combinatorics','iterator',
'concurrency','monotonic-queue','number-theory','merge-sort','brainteaser','probability-and-statistics','doubly-linked-list',
'quickselect','bucket-sort','minimum-spanning-tree','counting-sort','suffix-array','shell','line-sweep','reservoir-sampling',
'strongly-connected-component','eulerian-circuit','radix-sort','rejection-sampling','biconnected-component']

const COLORS =["rgb(64,129,236)", "rgb(7,92,98)", "rgb(159,102,237)", "rgb(118,7,150)", "rgb(103,72,106)", "rgb(51, 138, 96)", "rgb(161,8,92)", "rgb(31,60,166)", "rgb(39,15,226)", "rgb(116,141,19)"]

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
class ProfileTable extends Component {
    constructor(props){
        super(props);
        this.state = {
            tagsChecked: true,
            tagFilter: 'All'     

        };                
        this.setEventListeners = this.setEventListeners.bind(this);
        this.sortByFrequency = this.sortByFrequency.bind(this);
        this.sortByAcceptance = this.sortByAcceptance.bind(this);
        this.sortByDifficulty = this.sortByDifficulty.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.onCheckChange = this.onCheckChange.bind(this);
        this.onSelectChange = this.onSelectChange.bind(this);
    }
    componentDidMount(){        
            
    }
    componentWillReceiveProps(nextProps) {        
        // You don't have to do this check first, but it can help prevent an unneeded render
        if (nextProps.isLoaded != this.state.isLoaded) {
          this.setState({ 
              isLoaded: nextProps.isLoaded,
              data : nextProps.data,
               userData : nextProps.userData
            });
        }
        if(nextProps.data != this.state.data){            
            this.setState({
                data : nextProps.data
            })
        }
      }
    setEventListeners(){
        const freq = document.getElementById('FrequencyTab');        
    }
    sortByDifficulty(){        
        var newData = this.state.data;
        if(newData.length < 2) return;
        const dtoi = {'Easy':0,'Medium':1,'Hard':2}
        if(parseFloat(newData[0]['Frequency']) > parseFloat(newData[1]['Frequency'])){
            newData.sort((a,b) => (parseFloat(dtoi[a['Difficulty']]) > parseFloat(dtoi[b['Difficulty']]))? 1 : -1)
        } else {
            newData.sort((a,b) => (parseFloat(dtoi[a['Difficulty']]) < parseFloat(dtoi[b['Difficulty']]))? 1 : -1)
        }        
        this.setState({
            data : newData
        })
    }
    sortByFrequency(){        
        var newData = this.state.data;
        if(newData.length < 2) return;
        if(parseFloat(newData[0]['Frequency']) > parseFloat(newData[1]['Frequency'])){
            newData.sort((a,b) => (parseFloat(a['Frequency']) > parseFloat(b['Frequency']))? 1 : -1)
        } else {
            newData.sort((a,b) => (parseFloat(a['Frequency']) < parseFloat(b['Frequency']))? 1 : -1)
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
        if(!this.props.userData['user_solved_dict'] || this.props.userData['user_solved_dict'][id] == undefined) return false;
        return this.props.userData['user_solved_dict'][id];
    }
    
    handleClick(id){
        window.open(getURLfromId(id), '_blank').focus();        
    }
    render() {
        //const data = this.props.userData;        
        const data = this.props.userData['SRS_data'];
        const isLoaded = this.props.isLoaded;
        const keys = Object.keys(problemIdToCategories);        
      return(
                      
                <div class="tableContainer userProfileTable">
                    { isLoaded &&  
                    <table class="m-3gmgrq mainTable">
                        
                         <thead class="thead">                                        
                            <tr class="m-1itvjt0 ejhqg10">
                                <th class="m-1itvjt0"></th>
                                                                
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
                                            <option value="Heap">Heap</option>
                                            <option value="Linked List">Linked List</option>
                                            <option value="Intervals">Intervals</option>
                                            <option value="Sliding Window">Sliding Window</option>
                                            <option value="Sorting">Sorting</option>
                                            <option value="Topological Sort">Topological Sort</option>
                                            <option value="Trie">Trie</option>
                                            <option value="Two Pointers">Two Pointers</option>
                                            <option value="Union Find">Union Find</option>                                                                                        
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
                                <th class="m-1itvjt0 tablehover frequencyHeader"  onClick={this.sortByFrequency}>
                                    Due Again In
                                    <span class="w-3.5 h-3.5 ml-2 text-gray-5 dark:text-dark-gray-5 group-hover:text-gray-7 dark:group-hover:text-dark-gray-7"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor"><path d="M18.695 9.378L12.83 3.769a1.137 1.137 0 00-.06-.054c-.489-.404-1.249-.377-1.7.06L5.303 9.381a.51.51 0 00-.16.366c0 .297.27.539.602.539h12.512a.64.64 0 00.411-.146.501.501 0 00.028-.762zM12.77 20.285c.021-.017.042-.035.062-.054l5.863-5.609a.5.5 0 00-.028-.762.64.64 0 00-.41-.146H5.743c-.332 0-.601.242-.601.54a.51.51 0 00.16.365l5.769 5.606c.45.437 1.21.464 1.698.06z"></path></svg></span>
                                </th>
                                
                                <th class="m-1itvjt0"></th>
                            </tr>
                        </thead>
                       
                        <tbody>                            
                            {data['due'].map(id => {    
                                const item = data['id_to_obj'][id];  
                                const dueAgainIn = data['level_to_gap'][data['id_to_level'][id]];     
                                return(       
                                <tr onClick={()=>this.handleClick(item['#'])} class="m-14j0amg e98qpmo0">                                    
                                    <td></td>
                                    
                                    <td>{item.id}.</td>
                                    <td>{item.title}</td>     
                                    <td class="tags">                                                                       
                                        {                 
                                        inArray(keys,item.id)?    
                                            <>
                                            <div class="upperdiv">                                       
                                                {problemIdToCategories[item.id].slice(0,3).map(e => 
                                                    this.state.tagsChecked?                                            
                                                    <span class="tagItem" style={{background:getTagStyle(e)[1],color:getTagStyle(e)[0]}}>• {e}</span>
                                                    :
                                                    <span class="tagItem" style={{background:'#000'}}>***</span>

                                                 )}</div>
                                            <div class="upperdiv">                                       
                                            {problemIdToCategories[item.id].slice(3,7).map(e =>     
                                                this.state.tagsChecked?                                        
                                                <span class="tagItem" style={{background:getTagStyle(e)[1],color:getTagStyle(e)[0]}}>• {e}</span>
                                                :
                                                <span class="tagItem" style={{background:'#000'}}>***</span>                                                                                  
                                            )}</div>
                                            </>
                                        :<></>}                                        
                                                                                                                                              
                                    </td>                               
                                    {/*<td>{item['Acceptance']}</td>*/}
                                    <td style={item['difficulty']=='Easy'?{color:'rgba(0,175,155,1)'}:item['difficulty']=='Medium'?{color:'rgba(255,184,0,1'}:{color:'rgba(255,45,85,1)'}}>{item['difficulty']}</td>
                                    <td><div class="">{dueAgainIn} days</div></td>
                                    <td class="bookend"></td>                                    
                                </tr>
                                )}
                            )};
                            
                        </tbody>
                    </table>    
                     }
                    </div>                    
                
      )
    }
  }
  
  export default ProfileTable