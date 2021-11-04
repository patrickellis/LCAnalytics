import {React,Component} from 'react';
import {fetchDatesFromIds,weeklyProgressFromDates} from '../scripts/github';
import {idsToRadar} from '../scripts/util';
import ActiveShapePieChart from './CustomActivePieChart';
import PieChart from './PieChart';
import PercentAreaChart from './PercentAreaChart';
import RadarChartCustom from './RadarChart';
import Categories from '../data/categoryList';
import CategoryToProblemIds from '../data/categoryToProblemIds.json';
import ProblemIdToCategories from '../data/problemIdToCategories.json';
import UserDashboard from './UserDashboard';
import CompanyDashboard from './CompanyDashboard';
console.log(Categories)
console.log(CategoryToProblemIds)
console.log(ProblemIdToCategories)
class Stats extends Component {
    constructor(props){
        super(props);
        this.state = {
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
            slugData: []
        };
        this.computeStats = this.computeStats.bind(this);
        this.updateProgress = this.updateProgress.bind(this);
        this.setSlugAndDatesData = this.setSlugAndDatesData.bind(this);
    }

    componentDidMount(){     
        
    }
    updateProgress(weeks){
        console.log("Updating progress ");
        let solvedOverTime = weeklyProgressFromDates(this.state.dateDict['oldest_commits'],weeks,this.state.numProblems,this.state.numCompleted); 
            this.setState({
                solvedOverTimeData : solvedOverTime,                
            })
    }
    setSlugAndDatesData(slugdata,datesdata,solvedOverTime){
        console.log("setting slug and dates");
        console.log(slugdata, " ### ", datesdata);
        this.setState({
            slugData : slugdata,
            dateDict: datesdata,
            solvedOverTimeData : solvedOverTime,
            overTimeDataComputed : true
        })
    }
    computeStats(){
        console.log("Computing stats #####")
        console.log(this.state.data);
        const numProblems = this.state.data.length;              
        let cpd = {};
        let db = {'Easy':0,'Medium':0,'Hard':0};
        let solvedCounter = 0;
        let commonIDS = [];
        
        for(let i = 0; i < numProblems; ++i){
            db[this.state.data[i]['Difficulty']] += 1;
            cpd[this.state.data[i]['#']] = true;
            if(this.state.userData['user_solved_dict'][this.state.data[i]['#']]){
                commonIDS.push(this.state.data[i]['#'])
                console.log('incrementing')
                solvedCounter += 1;
            }
        }        
        let radarData = idsToRadar(this.state.data,ProblemIdToCategories,Categories);
        console.log(radarData);
        console.log(commonIDS)
        let dates = fetchDatesFromIds('PatrickEllis','LeetCode',commonIDS,this.setSlugAndDatesData,numProblems,solvedCounter);
        {/*
        setTimeout(function(){ 
            console.log("this is a weekly call from computestats func")
            let solvedOverTime = weeklyProgressFromDates(dates['oldest_commits'],4,numProblems,solvedCounter); 
            this.setState({
                solvedOverTimeData : solvedOverTime,
                overTimeDataComputed : true
            })
        }.bind(this), 1000);*/}
        
        this.setState({
            radarData : radarData,            
            commonIDS : commonIDS,
            numCompleted : solvedCounter,
            companyProblemDict : cpd,
            numProblems : numProblems,
            statsComputed : true,
            difficultyBreakdown : db,
            chartDataCompleted : [
                { name: "Completed", value: solvedCounter },
                { name: "Yet to Complete", value: numProblems-solvedCounter }
              ]
        });
    }
    render(){
        if(!this.state.statsComputed && this.state.isLoaded){
            this.setState({
                statsComputed : true
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
            
           
            </>
        )
    }
}

export default Stats
