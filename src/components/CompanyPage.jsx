import {React,Component} from 'react';
import CompanyTable from './CompanyTable';
import problemIdToCategories from '../data/problemIdToCategories.json'
import CompanyTableNew from './CompanyTableNew'
import CompanyNav from './CompanyNav';
import {fetchGithubRepo} from '../scripts/github'
import { setActiveLink } from '../scripts/util';
import Stats from './StatsSection';
import RadarChart from './RadarChart';
import StatsHeader from './StatsHeader';
import BeatLoader from "react-spinners/BeatLoader";

const client_id = 'c3dfbec01089dd36fa64';
class CompanyPage extends Component {
    constructor(props){
        super(props);
        this.state = {            
            data: this.props.data,            
            displayQuestions : true
        };        
        this.toggleDisplay = this.toggleDisplay.bind(this);
    }
    toggleDisplay(){
        let cur = this.state.displayQuestions;
        cur = !cur;
        this.setState({
            displayQuestions : cur,
        })
    }
    componentWillUnmount(){
        this.props.setLoadingStatusTopLevel();
    }
    async componentDidMount(){                        
        setActiveLink(10);       

    }

    render(){        
        return(
            
            <>                 
            <div class="companypopup" id="companypopup">
                <div class="popupcontent">
                    <h3 id="popuptext"> Add to your tracked lists </h3>
                </div>
            </div>  
            {this.props.isLoaded &&             
            <>                
            <StatsHeader/>
            <div class="m-ht4nkg">
                <Stats loadingFromLocalStorage={this.props.loadingFromLocalStorage}  user={this.props.user} setLoadingStatus={this.props.setLoadingStatus} name={this.props.name} userData={this.props.userData} data={this.props.data} isLoaded={this.props.isLoaded}/>
                <div class="separator"></div>
                <CompanyNav setLoadingStatus={this.props.setLoadingStatus} name={this.props.name} updateDataTimePeriod={this.props.updateDataTimePeriod} toggleDisplay={this.toggleDisplay}/>
                {this.state.displayQuestions && 
                <CompanyTableNew setLoadingStatusTopLevel={this.props.setLoadingStatusTopLevel} userData={this.props.userData} data={this.props.data} isLoaded={this.props.isLoaded}/>
                }
            </div>
            </>
            }
        {!this.props.postLoadingBufferComplete || !this.props.isLoaded && 
            <div class="loaderDiv" id="loaderDiv">
                <div class="loaderContainer">
                    <BeatLoader color={'rgb(255,255,255)'} loading={true} size={12} />    
                    </div>
            </div> 
        }
            </>
        )
    }
}


export default CompanyPage
