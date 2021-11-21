import {React,Component} from 'react';

import CompanyTable from './CompanyTable';
import {fetchGithubRepo} from '../scripts/github'
import Stats from './StatsSection';
import RadarChart from './RadarChart';
import ActiveShapePieChart from './CustomActivePieChart';
import PieChart from './PieChart';
import PercentAreaChart from './PercentAreaChart';
import RadarChartCustom from './RadarChart';
import BeatLoader from "react-spinners/BeatLoader";

const easy = 23
const medium = 45
const hard = 54

class CompanyNav extends Component {
    constructor(props){
        super(props);
        this.state = { 
            loading : false           
        };
        this.flipNavClasses = this.flipNavClasses.bind(this);
        this.switchTimePeriod = this.switchTimePeriod.bind(this);
        this.setLoadingStatus = this.setLoadingStatus.bind(this);
    }
    switchTimePeriod(id, period){
        //this.props.setLoadingStatus();
        const headers = document.getElementsByClassName('timeSelectItem');
            for(let i = 0; i < headers.length; ++i){
                if(i==id){
                    if(!headers[i].classList.contains('activeLink'))
                        headers[i].classList.add('activeLink');
                }
                else if(headers[i].classList.contains('activeLink')){
                    headers[i].classList.remove('activeLink');
                }
            } 
        this.setState({
            loading : true
        },()=>{
            document.getElementById('time-period').selectedIndex = '0';
            document.getElementById('loaderDiv').style.display = 'block';
            setTimeout(function(){ this.props.updateDataTimePeriod(this.props.name,period,this.setLoadingStatus); }.bind(this), 10);
            // 1yr, 2yr, 6mo, all_time            
            
        })       
    }
    setLoadingStatus(){        
        this.setState({
            loading : !this.state.loading
        })
    }
    flipNavClasses(){
        this.props.toggleDisplay();
        const allquestions = document.getElementById('allquestions');
        const studyorder = document.getElementById('studyorder'); 
        if(allquestions.classList.contains('selected')){
            allquestions.classList.remove('selected');
            allquestions.classList.add('unselected');
            studyorder.classList.remove('unselected');
            studyorder.classList.add('selected');
        }
        else{
            allquestions.classList.add('selected');
            allquestions.classList.remove('unselected');
            studyorder.classList.add('unselected');
            studyorder.classList.remove('selected');
        }
    }
    async componentDidMount(){      
        // const allquestions = document.getElementById('allquestions');
        // const studyorder = document.getElementById('studyorder');       
        // allquestions.addEventListener("click", this.flipNavClasses);
        // studyorder.addEventListener("click", this.flipNavClasses);
    }
    render(){              
        return(
            <div class="nav-container">
                <div class="loaderDiv" id="loaderDiv">
                    <div class="loaderContainer">
                        <BeatLoader color={'rgb(49,41,85)'} loading={true} size={15} />    
                        </div>
                 </div>
                 {/*
                <nav class="stroke">
                    <ul>
                        <li class="selected" id="allquestions">All Questions</li>
                        <li class="unselected" id="studyorder">Study Order (Beta)</li>       
                    </ul>
                </nav>
                 */}
                <div class="timeSelectContainer">
                    <div onClick={()=>this.switchTimePeriod(0,'6mo')} class="timeSelectItem activeLink">6 Months</div>
                    <div onClick={()=>this.switchTimePeriod(1, '1yr')} class="timeSelectItem">1 Year</div>
                    <div onClick={()=>this.switchTimePeriod(2,'2yr')} class="timeSelectItem">2 Years</div>
                    <div onClick={()=>this.switchTimePeriod(3,'all_time')} class="timeSelectItem">All Time</div>
                </div>
                        
                            
            </div>
        )
    }
}

export default CompanyNav
