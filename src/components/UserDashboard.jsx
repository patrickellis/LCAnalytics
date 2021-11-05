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

class UserDashboard extends Component {
    constructor(props){
        super(props);
        this.state = {
  
        };
    }

    async componentDidMount(){                
    }
    render(){
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
                                <button class="e2l7c7j2 m-igyvwi">
                                    See all your Solved Questions   
                                    <img src="https://fastcdn.mobalytics.gg/assets/common/icons/see-more.svg" alt="See more" class="m-x0yz92 e2l7c7j1"/>
                                </button>
                            </header>     
                            <div class="upperleftcontent question-list">
                                <table class="m-3gmgrq dashTable">
                                    <thead class="thead">                                        
                                        <tr class="m-1itvjt0 ejhqg10">
                                            <th class="m-1itvjt0"></th>
                                            <th class="m-1itvjt0">#</th>
                                            <th class="m-1itvjt0">Problem</th>
                                            <th class="m-1itvjt0">Last Solved</th>
                                            <th class="m-1itvjt0"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td colspan="15" class='m-1m0ike6'></td>
                                        </tr>
                                        {this.props.slugData && this.props.slugData.map(item =>  {
                                            return(                                             
                                            <tr class="m-14j0amg">
                                                <td></td>
                                                <td> {idx++} </td>
                                                <td> {item.title}</td>
                                                <td class="lastSolved"> <span class="m-14c7t56 esfbxh91" style={{color: '#0773f6'}}>{item.daysAgo} days ago</span></td>
                                                <td></td>
                                            </tr>
                                            )
                                            })}
                                    </tbody>

                                </table>
                                {/* <ActiveShapePieChart data={this.props.chartDataCompleted}/>*/}
                                                
                                    
                                
                            </div>                      
                        </div>
                        <div class="upperight">
                        <div class="urcontent">
                        <header class="m-1rp16vj e1jubrs70 pieHeader">
                            <div class="m-yeouz0 e1jubrs74">
                                <img src="https://fastcdn.mobalytics.gg/assets/common/icons/lol-roles/16-bot-bright.svg" alt="Bot" class="m-ccezno e1jubrs73"/>
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
                    <header class="m-1rp16vj e1jubrs70 pieHeader">
                            <div class="m-yeouz0 e1jubrs74">                                
                                     Progress Tracking
                                </div>
                                {/*<img src="https://fastcdn.mobalytics.gg/assets/common/icons/info.svg" alt="Gamer Performance Index (GPI)" class="m-rdgkmw e1jubrs72"/>*/}
                        </header>
                    <div class="lowercontent">
                        <div class="areaChart">
                            <SelectComponent options={options} updateProgress={this.props.updateProgress}/>                            
                            </div>
                            <div class="areaGraph">
                            
                            {this.props.overTimeDataComputed?
                                <PercentAreaChart data={this.props.solvedOverTimeData}/>
                                :
                                <div class="loader">
                                <ScaleLoader color={'rgb(49, 41, 85)'} loading={true} size={150} />
                            </div>
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
