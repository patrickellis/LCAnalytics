import {React,Component} from 'react';
import MoonLoader from "react-spinners/FadeLoader";

class RecentlySolvedTable extends Component {
    constructor(props){
        super(props);
       
      
    }
  

  
    render() {
      let noneSolved = this.props.slugData.length == 0;
      let idx = 1;
      return(
          <>                   
            <table class="m-3gmgrq dashTable">
                  <thead class="thead">                                        
                      <tr class="m-1itvjt0 ejhqg10">
                          <th class="m-1itvjt0"></th>
                          <th class="m-1itvjt0 id-col">#</th>
                          <th class="m-1itvjt0">Problem</th>
                          <th class="m-1itvjt0 last-solved">Last Solved</th>
                          <th class="m-1itvjt0"></th>
                      </tr>
                  </thead>
                  <tbody>
                      <tr>
                          <td colspan="15" class='m-1m0ike6'></td>
                      </tr>
                      {
                        this.props.slugData && this.props.slugData.map(item =>  {
                            return(                                             
                            <tr class="m-14j0amg">
                                <td></td>
                                <td style={{color:'#666'}}> {idx++}. </td>
                                <td> {item.title}</td>
                                <td class="lastSolved"> <span class="m-14c7t56 esfbxh91" style={{color: '#345bdf'}}>{item.daysAgo} days ago</span></td>
                                <td></td>
                            </tr>
                            )
                            })
                      }
                      {noneSolved?
                      <tr class="m-14j0amg">
                      <td></td>
                      <td></td>
                      <td>You haven't solved any problems on this company list yet.</td>
                      <td class="lastSolved"></td>
                      <td></td>
                  </tr>
                      :<></>}
                  </tbody>
              </table>                                     
            </>
      )
    }
  }
  
  export default RecentlySolvedTable