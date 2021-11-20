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

class UserProfileNav extends Component {
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
    flipNavClasses(id){
        console.log("Flipping nav with id: ", id);
        // this needs to be generalised to function with 5 headers///
        
        const tabs = document.getElementsByClassName('upNav');
        if(tabs[id].classList.contains('selected')) return;
        this.props.toggleDisplay(id);
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
        /*
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
        */
    }
    async componentDidMount(){      
        const tabs = document.getElementsByClassName('upNav');
        for(let i = 0; i < tabs.length; ++i){
            tabs[i].addEventListener('click',()=>this.flipNavClasses(i));
        }        
    }
    render(){              
        return(                        
            <div class="nav-container">
                <nav class="stroke">
                    <ul>
                      <li class="selected upNav" id="statisticsTab">Statistics</li>    
                        {/*<li class="unselected upNav" id="goalsTab">Goal Tracking</li>*/}
                        <li class="unselected upNav" id="listsTab">Lists</li>    
                        <li class="unselected upNav" id="SRSTab">Spaced Repetition</li>
                        <li class="unselected upNav" id="allQuestionsTab">All Questions</li>    
                    </ul>
                </nav>
            </div>            
        )
    }
}

export default UserProfileNav
