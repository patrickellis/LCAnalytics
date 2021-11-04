import {React,Component} from 'react';
import CompanyTable from './CompanyTable';
import {fetchGithubRepo} from '../scripts/github'
import Stats from './StatsSection';
import RadarChart from './RadarChart';


class StatsHeader extends Component {
    constructor(props){
        super(props);
        this.state = {
        };
    }


    render(){
        return(
            <>                                    
            <header class="m-1o5u912"><div class="m-ht4nkg"><div class="m-ke934a"><div class="m-kdvz65"><div></div><div class="m-wrdtjf"><div class="m-171jxkh"><button class="e123adl01 m-15tgr3f">Refresh data</button></div></div></div></div></div></header>
            </>
        )
    }
}


export default StatsHeader
