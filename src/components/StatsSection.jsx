import {React,Component} from 'react';
import {fetchDatesFromIds,weeklyProgressFromDates} from '../scripts/github';
import {idsToRadar} from '../scripts/util';
import ActiveShapePieChart from './CustomActivePieChart';
import PieChart from './PieChart';
import PercentAreaChart from './PercentAreaChart';
import RadarChartCustom from './RadarChart';
import CategoryToProblemIds from '../data/categoryToProblemIds.json';
import UserDashboard from './UserDashboard';
import CompanyDashboard from './CompanyDashboard';
import ScaleLoader from "react-spinners/ScaleLoader";

class Stats extends Component {
    constructor(props){
        super(props);
        this.state = {
            renderloopcount : 0,
            isLoaded : this.props.isLoaded,
            statsComputed : false,
            overTimeDataComputed : false,
            data: this.props.data,
            companyProblemDict: {},
            difficultyBreakdown: {},
            userData: this.props.userData,
            radarData : [],
            numCompleted: 0,
            numProblems: 0,
            chartDataCompleted: [],
            solvedOverTimeData: {},
            commonIDS : [],
            dateDict: {},
            slugData: [],
            idList: [],
            computingStats: true
        };
        this.computeStats = this.computeStats.bind(this);
        this.updateProgress = this.updateProgress.bind(this);
        this.setSlugAndDatesData = this.setSlugAndDatesData.bind(this);        
    }

    componentDidMount(){     
        
    }
    async componentWillReceiveProps(nextProps){                
        if(nextProps.data != this.data){
        this.setState({
            data : nextProps.data,
            computingStats : true
        },async ()=>{            
            let res = await this.computeStats();
            this.setState({
                computingStats : false
            },this.props.setLoadingStatus)
        })
        
      }
    }
   
    updateProgress(weeks){        
        let solvedOverTime = weeklyProgressFromDates(this.state.dateDict['oldest_commits'],weeks,this.state.numProblems,this.state.numCompleted,true); 
            this.setState({
                solvedOverTimeData : solvedOverTime,                
            })
    }
    setSlugAndDatesData(slugdata,datesdata,solvedOverTime){
        this.setState({
            slugData : slugdata,
            dateDict: datesdata,
            solvedOverTimeData : solvedOverTime,
            overTimeDataComputed : true
        })
    }
    async computeStats(){ 
        const numProblems = this.state.data.length;              
        let cpd = {};
        let db = {'Easy':0,'Medium':0,'Hard':0};
        let solvedCounter = 0;
        let commonIDS = [];
        
        for(let i = 0; i < numProblems; ++i){
            db[this.state.data[i]['Difficulty']] += 1;
            cpd[this.state.data[i]['#']] = true;
            if(this.state.userData['user_solved_dict'] && this.state.userData['user_solved_dict'][this.state.data[i]['#']]){
                commonIDS.push(this.state.data[i]['#'])               
                solvedCounter += 1;                
            }
        }   
        var idList = []; 
        for(let i = 0; i < this.state.data.length; ++i){
            idList.push(this.state.data[i]['#']);
        }        
        console.timeEnd('computeStats');  
         
        this.setState({
            difficultyBreakdown : db,
            idList : idList
        })

        let radarData = idsToRadar(idList);
        let currentUser;
        let ghUsername;
        let token;
        let repo;
        let branch;

        if(!this.props.loadingFromLocalStorage){
            currentUser = this.props.user['auth']['currentUser'];
            ghUsername = currentUser['reloadUserInfo']['screenName'];
            token = this.props.user['responseToken'];
        }
        else{
            const userObject = JSON.parse(localStorage.getItem('userObject'));
            ghUsername = userObject.username;
            repo = userObject.repo;
            branch = userObject.branch;
            token = userObject.token;
            currentUser = "undefined";
        }     
        await fetchDatesFromIds(ghUsername,repo,commonIDS,this.setSlugAndDatesData,numProblems,solvedCounter,token);        
        this.setState({
            radarData : radarData,            
            commonIDS : commonIDS,
            numCompleted : solvedCounter,
            companyProblemDict : cpd,
            numProblems : numProblems,
            statsComputed : true,            
            chartDataCompleted : [
                { name: "Completed", value: solvedCounter },
                { name: "Yet to Complete", value: numProblems-solvedCounter }
              ]
        });
        document.getElementById('loaderDiv').style.display = 'none';
    }
    render(){
        if(!this.state.statsComputed && this.state.isLoaded && this.state.renderloopcount == 0){    
            this.setState({
                renderloopcount : this.state.renderloopcount+1
            })        
            this.computeStats();            
        }
        const options = [
            { value: '4', label: '1 Month' },
            { value: '12', label: '3 Months' },
            { value: '24', label: '6 Months' }
          ]
        const data = [
            { name: "Completed", value: 400 },
            { name: "Yet to Complete", value: 300 }
          ];
        return(
            <>
                {/*{this.state.overTimeDataComputed && <PercentAreaChart data={this.state.solvedOverTimeData}/>}*/}   
                {this.state.statsComputed &&            
                <div class='m-12f3mir'>                     
                    <CompanyDashboard                         
                        name = {this.props.name}
                        radarData={this.state.radarData}
                        easy={this.state.difficultyBreakdown['Easy']}
                        medium={this.state.difficultyBreakdown['Medium']}
                        hard={this.state.difficultyBreakdown['Hard']}    
                    />
                    <UserDashboard 
                        updateProgress={this.updateProgress}
                        overTimeDataComputed={this.state.overTimeDataComputed} 
                        solvedOverTimeData={this.state.solvedOverTimeData} 
                        chartDataCompleted={this.state.chartDataCompleted}
                        slugData={this.state.slugData}
                        numCompleted={this.state.numCompleted}
                        numProblems={this.state.numProblems}                        
                    />
                </div>
                }
           
            </>
        )
    }
}

export default Stats
