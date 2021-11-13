import {React,Component} from 'react';
import DonutRing from './DonutRing';
class ProfileStatisticsProblems extends Component {
    constructor(props){
        super(props);

    }

    async componentDidMount(){                
    }
    render(){      
        let easy = 0, medium = 0, hard = 0;
        let diff = this.props.difficulties;
        if(diff){
            easy = diff['Easy'];
            medium = diff['Medium'];
            hard = diff['Hard'];
        }
        const pieData = [
            {name: 'Easy', value: easy},
            {name: 'Medium', value: medium},
            {name: 'Hard', value: hard}
        ]  
        return(
            <>                
            <div class="profUpperSection statsPage leftSection">
                <h1>Problems Solved</h1>
                <p class="numSolved">{easy+medium+hard}</p>                    
                    <DonutRing data = {pieData}/>                    
            </div>
            </>
        )
    }
}

export default ProfileStatisticsProblems
