import {React,Component} from 'react';


class Checkbox extends Component {
    constructor(props){
        super(props);             
    }
    render() {            
      return(
        <div class="checkbox-container">
            <input
                class="checkbox"
                type="checkbox"
                checked={this.props.hideSolved}
                onClick={this.props.handleCheckClick}
            />
            <p class="checkbox-text">{this.props.text}</p>
        </div>      
      )
    }
  }
  
  export default Checkbox