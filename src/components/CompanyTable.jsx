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

console.log("Colors len: ", TAGS.length)
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
            console.log("using index: ", idx, "for colors array length: ", COLORS.length);
            var blockColor = COLORS[idx];
            var backgroundColor = blockColor.replace(')',',0.20)');            
            return [blockColor,backgroundColor];
        }
    }
    return ['rgb(0,0,0)','rgba(0,0,0,0.2)'];
}

function inArray(arr, item){
    for(let i = 0; i < arr.length; ++i){
        if(arr[i]==item)
            return true;
    }
    return false;
}

function getTagStyle(tag){
    return getColor(tag);
    if(tag =='String') return '#9b5de5';
    if(tag =='Depth First Search') return '#ef476f';
    if(tag =='Dynamic Programming') return '#06d6a0';
    if(tag =='Hash Table') return '#118ab2';
    if(tag =='Tree') return '#073b4c';
    if(tag =='Two Pointers') return '#ef476f';
    return '#555';
}
class CompanyTable extends Component {
    constructor(props){
        super(props);
        this.state = {
            isLoaded : this.props.isLoaded,
            data: this.props.data,
            userData: this.props.userData,   
            tagsChecked: true     
        };        
        this.isSolved = this.isSolved.bind(this);
        this.setEventListeners = this.setEventListeners.bind(this);
        this.sortByFrequency = this.sortByFrequency.bind(this);
        this.sortByAcceptance = this.sortByAcceptance.bind(this);
        this.sortByDifficulty = this.sortByDifficulty.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.onCheckChange = this.onCheckChange.bind(this);
    }
    componentDidMount(){        
            
    }
    componentWillReceiveProps(nextProps) {
        // You don't have to do this check first, but it can help prevent an unneeded render
        if (nextProps.isLoaded !== this.state.isLoaded) {
          this.setState({ 
              isLoaded: nextProps.isLoaded,
              data : nextProps.data,
               userData : nextProps.userData
            });
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
        console.log("checked");
        this.setState({
            tagsChecked : !this.state.tagsChecked
        })
    }
    isSolved(id){
        return this.state.userData['user_solved_dict'][id];
    }
    
    handleClick(id){
        window.open(getURLfromId(id), '_blank').focus();        
    }
    render() {
        const {isLoaded, data} = this.state;
        const keys = Object.keys(problemIdToCategories);
        console.log(keys);
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
                                    Frequency
                                    <span class="w-3.5 h-3.5 ml-2 text-gray-5 dark:text-dark-gray-5 group-hover:text-gray-7 dark:group-hover:text-dark-gray-7"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor"><path d="M18.695 9.378L12.83 3.769a1.137 1.137 0 00-.06-.054c-.489-.404-1.249-.377-1.7.06L5.303 9.381a.51.51 0 00-.16.366c0 .297.27.539.602.539h12.512a.64.64 0 00.411-.146.501.501 0 00.028-.762zM12.77 20.285c.021-.017.042-.035.062-.054l5.863-5.609a.5.5 0 00-.028-.762.64.64 0 00-.41-.146H5.743c-.332 0-.601.242-.601.54a.51.51 0 00.16.365l5.769 5.606c.45.437 1.21.464 1.698.06z"></path></svg></span>
                                </th>
                                
                                <th class="m-1itvjt0"></th>
                            </tr>
                        </thead>
                       
                        <tbody>                            
                            {this.state.data.map(item =>                         
                                <tr onClick={()=>this.handleClick(item['#'])} class="m-14j0amg e98qpmo0">                                    
                                    <td></td>
                                    <td class="solved">{this.isSolved(item['#'])?
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" class="w-[18px] h-[18px] text-green-s dark:text-dark-green-s"><path fill-rule="evenodd" d="M9.688 15.898l-3.98-3.98a1 1 0 00-1.415 1.414L8.98 18.02a1 1 0 001.415 0L20.707 7.707a1 1 0 00-1.414-1.414l-9.605 9.605z" clip-rule="evenodd"></path></svg>
                                        :
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" class="w-[18px] h-[18px] text-gray-5 dark:text-dark-gray-5"><path fill-rule="evenodd" d="M4 12a1 1 0 011-1h14a1 1 0 110 2H5a1 1 0 01-1-1z" clip-rule="evenodd"></path></svg>                                        
                                        }</td>
                                    <td>{item['#']}.</td>
                                    <td>{item['Title']}</td>     
                                    <td class="tags">                                                                       
                                        {                 
                                        inArray(keys,item['#'])?    
                                            <>
                                            <div class="upperdiv">                                       
                                                {problemIdToCategories[item['#']].slice(0,3).map(e => 
                                                    this.state.tagsChecked?                                            
                                                    <span class="tagItem" style={{background:getTagStyle(e)[1],color:getTagStyle(e)[0]}}>• {e}</span>
                                                    :
                                                    <span class="tagItem" style={{background:'#000'}}>***</span>

                                                 )}</div>
                                            <div class="upperdiv">                                       
                                            {problemIdToCategories[item['#']].slice(3,7).map(e =>     
                                                this.state.tagsChecked?                                        
                                                <span class="tagItem" style={{background:getTagStyle(e)[1],color:getTagStyle(e)[0]}}>• {e}</span>
                                                :
                                                <span class="tagItem" style={{background:'#000'}}>***</span>                                                                                  
                                            )}</div>
                                            </>
                                        :<></>}                                        
                                                                                                                                              
                                    </td>                               
                                    {/*<td>{item['Acceptance']}</td>*/}
                                    <td style={item['Difficulty']=='Easy'?{color:'rgba(0,175,155,1)'}:item['Difficulty']=='Medium'?{color:'rgba(255,184,0,1'}:{color:'rgba(255,45,85,1)'}}>{item['Difficulty']}</td>
                                    <td><div class="frequency-bar frequencyHeader" style={{width:item['Frequency']+'%'}}></div></td>
                                    <td class="bookend"></td>                                    
                                </tr>
                            )};
                            
                        </tbody>
                    </table>    
                     }
                    </div>                    
                
      )
    }
  }
  
  export default CompanyTable