import {React,Component} from 'react';

class BeatLoader extends Component{
    constructor(props){
        super(props);
    };
    render(){
        return(
            <div class="loaderDiv" id="loaderDiv">
                <div class="loaderContainer">
                    <BeatLoader color={'rgb(255,255,255)'} loading={true} size={12} />    
                    </div>
            </div>
        );
    }
};

export default BeatLoader