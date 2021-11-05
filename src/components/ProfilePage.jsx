import {React,Component} from 'react';

import CompanyTable from './CompanyTable';
import CompaniesTable from './CompaniesTable'
import CompanyNav from './CompanyNav';
import {fetchGithubRepo} from '../scripts/github'
import Stats from './StatsSection';
import RadarChart from './RadarChart';
import StatsHeader from './StatsHeader';
import {setActiveLink} from '../scripts/util';

class ProfilePage extends Component {
    constructor(props){
        super(props);
        this.state = {
            
        };
    }
    
    componentDidMount(){        
        setActiveLink(0);
    }

    render(){
        return(
            <>       
                <div class="m-ke934a"><div class="m-kdvz65"><div></div><div class="m-wrdtjf"><div class="m-171jxkh"></div></div></div></div>                                                                                                    
                <h1>Profile</h1>
            </>
        )
    }
}


export default ProfilePage
