import {React,Component} from 'react';
import RadarChart from './RadarChart';
class ProfileStatisticsRadar extends Component {
    constructor(props){
        super(props);

    }

    async componentDidMount(){                
    }
    render(){        
        return(
            <>                
                <div class="profUpperSection statsPage rightSection">
                    <h1>Versatility Chart</h1>
                    <div class="radarContainer">
                     <RadarChart data={this.props.radar_data}/>                    
                    </div>
                </div>
            </>
        )
    }
}

export default ProfileStatisticsRadar
