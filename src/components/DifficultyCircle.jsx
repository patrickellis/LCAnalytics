import {React,Component} from 'react';


class DifficultyCircle extends Component {
    constructor(props){
        super(props);
       
      
    }
  

  
    render() {
            
      return(
          <>            
                <div style={{width:'70%',height:'fit-content'}}>
                        <div style={this.props.difficulty=='Easy'?{
                                margin:'auto',
                                display:'block',
                                borderRadius:'.75rem',
                                width:'1.5rem',
                                height:'1.5rem',
                                backgroundColor:'rgba(0,175,155,0.6)'
                        }:
                            this.props.difficulty=='Medium'?
                            {
                                display:'block',
                                margin:'auto',
                                borderRadius:'.75rem',
                                width:'1.5rem',
                                height:'1.5rem',
                                backgroundColor:'rgba(255,184,0,.6)'
                        }:
                        {
                            display:'block',
                            margin:'auto',
                            borderRadius:'.75rem',
                            width:'1.5rem',
                            height:'1.5rem',
                            backgroundColor:'rgba(255,45,85,.6)'
                        }
                        }></div>
                </div>
        </>
      )
    }
  }
  
  export default DifficultyCircle