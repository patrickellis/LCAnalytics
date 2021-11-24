import {React,Component} from 'react';
import CompanyTable from './CompanyTable';
import {fetchGithubRepo} from '../scripts/github'
import Stats from './StatsSection';
import RadarChart from './RadarChart';
import ActiveShapePieChart from './CustomActivePieChart';
import PieChart from './PieChart';
import PercentAreaChart from './PercentAreaChart';
import RadarChartCustom from './RadarChart';
import SelectComponent from './SelectComponent';
import { css } from "@emotion/react";
import ScaleLoader from "react-spinners/ScaleLoader";
import { HashRouter as Router, Switch, Route, Link } from "react-router-dom";
import RecentlySolvedTable from './RecentlySolvedTable';

class UserDashboard extends Component {
    constructor(props){
        super(props);
        this.state = {
            dataBufferCompleted : false
        };
    }

    componentDidMount(){     
        setTimeout(()=>this.setState({dataBufferCompleted : true}),150);           
    }
    render(){
        let noneSolved = this.props.slugData.length == 0;
        let idx = 1;
        const options = [
            {value: "4", label: "1 Month"},
            {value: "12", label: "3 Months"},
            {value: "24", label: "6 Months"}
        ]
        return(
            <>
                <div class="userdash">
                    <div>
                    <div class="uppersection">
                        <div class="upperleft"> 
                            <header class="m-1rp16vj e2l7c7j4">
                                <div class="m-yeouz0 e2l7c7j3">Recently Solved</div>       
                                      
                                
                            </header>     
                            <div class="upperleftcontent question-list">
                            
                                {/* <ActiveShapePieChart data={this.props.chartDataCompleted}/>*/}
                                                
                                <RecentlySolvedTable dataBufferCompleted={this.state.dataBufferCompleted} slugData={this.props.slugData}/>
                                
                            </div>                      
                        </div>
                        <div class="upperight">
                        <div class="urcontent">
                        <header class="m-1rp16vj e1jubrs70 pieHeader">
                            <div class="m-yeouz0 e1jubrs74">
                                {/*<img src="https://fastcdn.mobalytics.gg/assets/common/icons/lol-roles/16-bot-bright.svg" alt="Bot" class="m-ccezno e1jubrs73"/>*/}
                                     Questions Solved
                                </div>
                                {/*<img src="https://fastcdn.mobalytics.gg/assets/common/icons/info.svg" alt="Gamer Performance Index (GPI)" class="m-rdgkmw e1jubrs72"/>*/}
                        </header>
                            
                            <div class="upperightcontent">   
                                <div class="solvedContent">                                                         
                                     <p class="solvedtext" style={{color:'rgb(49, 41, 85)'}}>Currently solved {this.props.numCompleted} out of {this.props.numProblems}</p>
                                </div>
                                <ActiveShapePieChart data={this.props.chartDataCompleted}/>   
                                        
                            </div>
                            </div>
                        </div>                                                                        
                    </div>
                    <div class="lowersection">
                    <header class="m-1rp16vj e1jubrs70 pieHeader border-bottom">
                            <div class="m-yeouz0 e1jubrs74 ">                                
                                     Progress Tracking
                                </div>
                                {/*<img src="https://fastcdn.mobalytics.gg/assets/common/icons/info.svg" alt="Gamer Performance Index (GPI)" class="m-rdgkmw e1jubrs72"/>*/}
                        </header>
                    <div class="lowercontent">
                        <div class="areaChart">
                            <SelectComponent options={options} updateProgress={this.props.updateProgress}/>                            
                            </div>
                            <div class="areaGraph">
                            
                            {this.props.overTimeDataComputed &&
                                <>
                                <PercentAreaChart data={this.props.solvedOverTimeData}/>                                
                                <div class="divider"></div>
                                </>
                            }                                                    
                            </div>
                        </div>
                    </div>
                    </div>
                </div>
            </>
        )
    }
}

export default UserDashboard
