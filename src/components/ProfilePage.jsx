import {React,Component} from 'react';
import AreaChart from './AreaChart';
import CompanyTable from './CompanyTable';
import CompaniesTable from './CompaniesTable'
import CompanyNav from './CompanyNav';
import {fetchGithubRepo} from '../scripts/github'
import Stats from './StatsSection';
import RadarChart from './RadarChart';
import StatsHeader from './StatsHeader';
import {setActiveLink} from '../scripts/util';
import ProfileTable from './ProfileTable';
import UserProfileNav from './UserProfileNav';
import SelectComponent from './SelectComponent';
import {weeklyProgressFromDates} from '../scripts/github.js';
import Heatmap from './Heatmap';
import ProfileStatisticsProblems from './ProfileStatisticsProblems';
import ProfileStatisticsProgress from './ProfileStatisticsProgress';
import ProfileStatisticsRadar from './ProfileStatisticsRadar';
import '../styles/profileStatistics.css';
import AllProblemsTable from './AllProblemsTable';
import AllProblemsTableNew from './AllProblemsTableNew';
import CompanyTableNew from './CompanyTableNew'

import LCpatterns from '../data/Lists/LeetcodePatterns';
import AllLists from '../data/Lists/AllLists';







//const data = problems.reverse();
function inArray(arr,item){
    for(let i = 0; i < arr.length; ++i){
        if(arr[i] == item)
            return true        
    }
    return false;
}

class ProfilePage extends Component {
    constructor(props){
        super(props);
        this.state = {
            data : this.props.data,
            solvedOverTime : this.props.userData.solvedOverTime,
            displayIndex : 0,
            displayingList : false,
            isCompanyList : false,
            listId : "",
            listCompletion : {}
        };
        this.updateProgress = this.updateProgress.bind(this);
        this.toggleDisplay = this.toggleDisplay.bind(this);
        this.handleListClick = this.handleListClick.bind(this);
        this.computeListCompletion = this.computeListCompletion.bind(this);
        this.isSolved = this.isSolved.bind(this);
        this.removeCompanyFromUserLists = this.removeCompanyFromUserLists.bind(this);
    }
    
    componentDidMount(){        
        setActiveLink(0);        
        this.computeListCompletion();
        
    }
    componentWillReceiveProps(){
        console.log("receiving props");
        this.computeListCompletion();
    }
    computeListCompletion(){
        let trackedCompanies = localStorage.getItem('Lists')===null?[]:JSON.parse(localStorage.getItem('Lists'));
        console.log(trackedCompanies);
        const listkeys = Object.keys(AllLists);
        var listCompletion = {}
        for(let i = 0; i < listkeys.length; ++i){
            let counter = 0;
            let qList = AllLists[listkeys[i]];            
            for(let j = 0; j < qList.length; ++j){
                counter += this.isSolved(qList[j]['id'])                                
            }            
            listCompletion[listkeys[i]] = counter;
        }        
        
        for(let i = 0; i < trackedCompanies.length; ++i){
            let cd =  this.props.companyData[trackedCompanies[i]];
            console.log(cd);
            let counter = 0;
            for(let j = 0; j < cd.length; ++j){
                counter += this.isSolved(cd[j]['#']);
            }
            
            {/*
            for(let j = 0; j < this.props.companyData['Amazon'].length; ++i){
                counter += (this.isSolved(this.props.companyData['6mo']['Amazon'][j]['#']));
            }*/}
            listCompletion[trackedCompanies[i]] = counter;
        }
        
        console.log(listCompletion);
        this.setState({
            listCompletion:listCompletion,
            trackedCompanies : trackedCompanies
        });
    }
    isSolved(id){
        if(!this.props.userData['user_solved_dict'] || this.props.userData['user_solved_dict'][id] == undefined) return false;
        return this.props.userData['user_solved_dict'][id];
    }

    toggleDisplay(id){                
        this.setState({
            displayIndex : id,
        })
    }
    updateProgress(weeks){        
        let solvedOverTime = weeklyProgressFromDates(this.props.userData['oldest_commits'],weeks,this.state.numProblems,this.props.userData.ids_solved.length,false); 
            this.setState({
                solvedOverTime : solvedOverTime,                
            })
    }
    handleListClick(id){

        if(inArray(this.state.trackedCompanies,id))
        {
            this.setState({
                isCompanyList : true,
                displayingList : true,
                listId : id
            })
        }
        else
        {
            this.setState({
                displayingList : true,
                listId : id,
                isCompanyList : false
            })
        }
    }
    removeCompanyFromUserLists(company){
        
        let lists = JSON.parse(localStorage.getItem('Lists'));
        console.log("removing company from list, list before removal: ", lists);
        for(let i = 0; i < lists.length; ++i){
            if(lists[i]==company){
                lists.splice(i,1);
                break;
            }                
        }
        console.log("removing company from list, list after removal: ", lists);
        localStorage.setItem('Lists',JSON.stringify(lists));
        this.setState({
            trackedCompanies : lists
        })
    }
    render(){
        let idx = this.state.displayIndex;
        const listkeys = Object.keys(AllLists);
        const options = [
            {value: "4", label: "1 Month"},
            {value: "12", label: "3 Months"},
            {value: "24", label: "6 Months"}
        ]
        let {trackedCompanies} = this.state;
        

        return(            
            <>       
                <div class="m-ke934a"><div class="m-kdvz65"><div></div><div class="m-wrdtjf"><div class="m-171jxkh"></div></div></div></div>                                                                                                    
                <div class="m-ht4nkg">
                    
                    <UserProfileNav toggleDisplay={this.toggleDisplay}/>
                    {idx == 0 &&
                        <>
                        <div style={{width:'100%',paddingTop:'0px'}}>
                            <div class="upperContent">
                            <ProfileStatisticsProblems difficulties = {this.props.userData.difficulties}/>
                            <ProfileStatisticsRadar radar_data={this.props.userData.radar_data}/>
                            </div>
                        
                        <div class="lowerContent">
                            <ProfileStatisticsProgress options={options} updateProgress={this.updateProgress} data={this.state.solvedOverTime}/>
                        </div>
                        <Heatmap/>
                        </div>
                        </>
                    }        
                {idx == 2 &&
                    (                    
                    this.state.displayingList?
                        this.state.isCompanyList?
                        <>
                        <button class="backButton m-tuly59" onClick={()=>this.setState({displayingList : false})}>back</button>
                        <CompanyTableNew setLoadingStatusTopLevel={this.props.setLoadingStatusTopLevel} data={this.props.companyData[this.state.listId]} userData={this.props.userData} isLoaded={true}/>
                        </>
                        :
                        <>
                        <button class="backButton m-tuly59" onClick={()=>this.setState({displayingList : false})}>back</button>
                        <AllProblemsTable data={AllLists[this.state.listId]} userData={this.props.userData}/>
                        </>
                    :
                    <div class="tableContainer">
                        <table class="m-3gmgrq mainTable">
                            <thead class="thead">
                            <th class="m-1itvjt0"></th>
                            <th class="m-1itvjt0">List</th>                            
                            <th class="m-1itvjt0">Completion</th>   
                            <th class="m-1itvjt0">Progress Bar</th>
                            <th class="remove-company"></th>
                            </thead>
                            <tbody>
                                {listkeys.map(item =>
                                {
                                    let listCompletion = this.state.listCompletion[item];
                                    let listLength = AllLists[item].length;
                                    let completedWidth = listCompletion/listLength * 100;
                                    return(
                                    <tr onClick={()=>this.handleListClick(item)} class="m-14j0amg e98qpmo0">
                                        <td></td>
                                        <td>{item}</td>                                        
                                        <td>{this.state.listCompletion[item]} / {AllLists[item].length}</td>          
                                        <td>
                                            <div class="m-1s5vw6 e5mzqaz1">
                                                <div data-progress="47" class="m-148kaov e5mzqaz0" style={{width: completedWidth+'%'}}></div>                                                
                                                <div class="m-oxskvv" style={{left: completedWidth+'%'}}></div>                                                
                                            </div>      
                                        </td>
                                        <td></td>
                                    </tr>
                                    )
                                }
                                )}
                                
                                {trackedCompanies.map(item=>
                                    {
                                        let listCompletion = this.state.listCompletion[item];
                                        let listLength = this.props.companyData[item].length;
                                        let completedWidth = listCompletion/listLength * 100;
                                        return(
                                        <tr class="m-14j0amg e98qpmo0">
                                            <td></td>
                                            <td onClick={()=>this.handleListClick(item)}>{item}</td>                                        
                                            <td onClick={()=>this.handleListClick(item)}>{this.state.listCompletion[item]} / {this.props.companyData[item].length}</td>          
                                            <td onClick={()=>this.handleListClick(item)}>
                                                <div class="m-1s5vw6 e5mzqaz1">
                                                    <div data-progress="47" class="m-148kaov e5mzqaz0" style={{width: completedWidth+'%'}}></div>                                                
                                                    <div class="m-oxskvv" style={{left: completedWidth+'%'}}></div>                                                
                                                </div>      
                                            </td>
                                            <td><button onClick={()=>this.removeCompanyFromUserLists(item)}class="remove-company-button">-</button></td>
                                        </tr>
                                        )
                                    })}
                                
                            </tbody>
                        </table>
                    </div>
                    )
                }
                {idx == 3 &&
                    <ProfileTable userData={this.props.userData} isLoaded={true}/>
                }
                {idx == 4 && 
                    <AllProblemsTableNew data={this.state.data} userData={this.props.userData} />                    
                }
                </div>
                                                
            </>       
            
        )
    }
}


export default ProfilePage