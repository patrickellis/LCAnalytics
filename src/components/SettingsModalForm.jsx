import React, { Suspense,Component } from 'react';

const initialFormData = {
    goal: 25,
    problemDifficultyAsText : false,
    SRS: {
        1 : 3, 
        2 : 7, 
        3 : 14, 
        4 : 28, 
        5 : 56,
        6 : 112,
        7 : 224,
        8 : 448
    }            
  };

class MyForm extends Component {
    constructor() {
      super();
      this.state = {
        formData : initialFormData
      };
      this.handleSubmit = this.handleSubmit.bind(this);
      this.handleChange = this.handleChange.bind(this);
      this.onCheckChange = this.onCheckChange.bind(this);
      this.onSRSChange = this.onSRSChange.bind(this);
    }
    onCheckChange(){  
        var fd = this.state.formData;
        fd['problemDifficultyAsText'] = !fd['problemDifficultyAsText'];      
        this.setState({
            formData : fd
        })
    }
    onSRSChange(e){
        let level_to_gap = {}
        let values = e.target.value.split(' ');
        let idx = 1;
        for(const value of values){
            level_to_gap[idx++] = parseInt(value);
        }
        this.setState({formData : {...this.state.formData,SRS:level_to_gap}})
    }
    handleChange(e){        
        this.setState({
            formData : {...this.state.formData,[e.target.name]: parseInt(e.target.value)}
        })
    }
    handleSubmit(event) {
      event.preventDefault();            
      console.log("FORM SUBMIT, data: ", this.state.formData);
      // set localstorage variables
      localStorage.setItem('level_to_gap',JSON.stringify(this.state.formData.SRS));
      localStorage.setItem('displayAsText',JSON.stringify(this.state.formData.problemDifficultyAsText));
      localStorage.setItem('goal',JSON.stringify(this.state.formData.goal));
      this.props.toggleSettingsModal(true);
    }
  
    render() {
      return (        
        <div class="settingsmodal" style={{padding:'3rem'}}>
            <div class="setting">
                <h4>Goal</h4>
                <input 
                    onChange={this.handleChange}
                    id="goal" 
                    name="goal" 
                    type="number"
                    placeholder="The goal number of problems you would like to solve per category (Default: 25 - Minimum: 5, Maximum: 25)"
                    />
                <br/>
            </div>
            <div class="setting">                
                <div class="switchContainer">
                    <label class="switch">                    
                    <input 
                        name="problemDifficultyAsText"
                        type="checkbox"
                        defaultChecked={this.state.formData.problemDifficultyAsText}
                        onChange={this.onCheckChange}
                    />
                    <span class="slider round"></span>                    
                    </label>    
                </div>
                 <h4 class="sliderheader">Display Problem Difficulties as Text (Default: Circle) </h4>                
            </div>
            <div class="setting">
                <h4>SRS Learning Gaps</h4>
                <div>
                    <select
                        name="SRS"
                        onChange={this.onSRSChange}
                    >                                                                    
                        <option value="3 7 14 28 56 112 224 448" selected="selected">3 7 14 28 56 112 224 448</option>
                        <option value="1 3 7 16 32 74 148 365">1 3 7 16 32 74 148 365</option>
                        <option value="5 10 20 40 80 160 320 640">5 10 20 40 80 160 320 640</option>
                    </select>
                </div>
                <br/>
            </div>
          <button class="m-tuly59 formsubmitbutton" onClick={this.handleSubmit}>Save</button>  
        </div>
      );
    }
  }
  export default MyForm