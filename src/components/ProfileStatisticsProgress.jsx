import {React,Component} from 'react';
import AreaChart from './AreaChart';
import SelectComponent from './SelectComponent';
class ProfileStatisticsProgress extends Component {
    constructor(props){
        super(props);

    }

    async componentDidMount(){                
    }
    render(){        
        return(
            <>          
                <div class="profLowerSection">
                    <SelectComponent options={this.props.options} updateProgress={this.props.updateProgress}/>                            
                    <AreaChart data={this.props.data}/>
                </div>      
            </>
        )
    }
}

export default ProfileStatisticsProgress
