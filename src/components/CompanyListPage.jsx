import {React,Component} from 'react';

import CompanyTable from './CompanyTable';
import CompaniesTable from './CompaniesTable'
import CompanyNav from './CompanyNav';
import {fetchGithubRepo} from '../scripts/github'
import Stats from './StatsSection';
import RadarChart from './RadarChart';
import StatsHeader from './StatsHeader';
import {setActiveLink} from '../scripts/util';

const client_id = 'c3dfbec01089dd36fa64';
class CompanyListPage extends Component {
    constructor(props){
        super(props);
        this.state = {
            data : this.props.data
        };
    }
    
    componentDidMount(){        
        //const userData = await fetchGithubRepo('patrickellis','LeetCode','main',this.setUserData);
        //await new Promise(r => setTimeout(r, 500));
        setActiveLink(1);
    }

    render(){
        return(
            <>                                                    
                <CompaniesTable updateData={this.props.updateData} data={this.state.data}/>
            </>
        )
    }
}


export default CompanyListPage
