import {React,Component} from 'react';
import CompanyData from '../data/companies/6mo/json/linkedin';
import CompanyTable from './CompanyTable';
import {fetchGithubRepo} from '../scripts/github'
import Stats from './StatsSection';
import RadarChart from './RadarChart';
import ActiveShapePieChart from './CustomActivePieChart';
import PieChart from './PieChart';
import PercentAreaChart from './PercentAreaChart';
import RadarChartCustom from './RadarChart';

const easy = 23
const medium = 45
const hard = 54

class CompanyNav extends Component {
    constructor(props){
        super(props);
        this.state = {            
        };
        this.flipNavClasses = this.flipNavClasses.bind(this);
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
        const allquestions = document.getElementById('allquestions');
        const studyorder = document.getElementById('studyorder');       
        allquestions.addEventListener("click", this.flipNavClasses);
        studyorder.addEventListener("click", this.flipNavClasses);
    }
    render(){              
        return(
            <div class="nav-container">
                <nav class="stroke">
                    <ul>
                        <li class="selected" id="allquestions">All Questions</li>
                        <li class="unselected" id="studyorder">Study Order (Beta)</li>       
                    </ul>
                </nav>
            </div>
        )
    }
}

export default CompanyNav
