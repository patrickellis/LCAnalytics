import {React,Component} from 'react';
import { HashRouter as Router, Switch, Route, Link } from "react-router-dom";
import '../styles/navbar.css';
import {setActiveLink} from '../scripts/util';
import SearchBar from './SearchBarFilter';
import { getAuth, signOut } from "firebase/auth";
import { Redirect } from "react-router-dom"


class NavBar extends Component {
    constructor(props){
        super(props);
        this.state = {
            redirect : false,
        };     
        this.logout = this.logout.bind(this);   
    }

    async componentDidMount(){       
        const settingIcon = document.getElementById('cogwheel');
        settingIcon.addEventListener('mouseenter', function(){
            document.getElementById('dropdown2').style.opacity='1';
        }) 
        settingIcon.addEventListener('mouseleave', function(){
            document.getElementById('dropdown2').style.opacity='0';
        })       
    }
    logout(){              
        // for (let i = 0; i < window.localStorage.length; i++) {
        //     let key = window.localStorage.key(i);
        //     if (key.slice(0,8) === "firebase") {
        //         localStorage.removeItem(key);
        //     }
        // }
        localStorage.removeItem('userObject');
        
        const auth = getAuth();
        signOut(auth).then(() => {
        // Sign-out successful.
            this.props.signoutUser();
        }).catch((error) => {
        // An error happened.
        });

    }
    render(){       
        return(
            <>
            <div class="m-fdciay">
            <div class="m-0">
                <div class="m-8qejy6">
                    <div class="m-8bmlvk">
                    <div class="search-input-small m-150iaol e1s5ctu70" >
                        <div class="m-boim1b ekk3vtk3" id="searchBox" role="combobox" aria-haspopup="listbox" aria-owns="downshift-1344-menu" aria-expanded="false">
                            <div class="m-1shozee ekk3vtk2">
                                <span id="downshift-1344-toggle-button" tabindex="-1">
                                    <img src="https://fastcdn.mobalytics.gg/assets/common/icons/system-icons/24-search.svg" alt="" loading="lazy" class="m-ez0ca8 ekk3vtk1"/>
                                    </span>
                                    {/*<input id="downshift-1344-input" aria-autocomplete="list" aria-controls="downshift-1344-menu" aria-labelledby="downshift-1344-label" autocomplete="off" placeholder="Search…" class="m-465o7i e199xoio3"/>*/}
                                    <SearchBar
                                        data = {this.props.data}
                                        updateData = {this.props.updateData}
                                    /> 
                                    {/*<button class="m-2nv37e ekk3vtk0">EUW</button>*/}
                                    </div>
                                    <div id="downshift-1344-menu" role="listbox" aria-labelledby="downshift-1344-label"></div>
                                        </div>
                                        <ul class="drop"></ul>
                                        </div>
                    <div class="navLinkContainer">
                    <div class="m-ijakdu">
                            <span class="m-1nu064n">
                                <Link to='/profile' replace>
                                <div class="m-1u0ilf6">
                                    <img src="https://fastcdn.mobalytics.gg/assets/common/icons/side-menu-icon/profile.svg" alt="Profile" loading="lazy" class="m-10p9pp6"/>
                                    <div class="navItem">Profile</div>
                                    </div>
                                    
                                </Link>                    
                            </span>
                        </div>
                        <div class="m-ijakdu">
                            <span class="m-1nu064n">
                                <Link to='/companies' replace>Companies</Link>                    
                            </span>
                        </div>
                        {/*
                        <div class="m-ijakdu activeLink">
                            <span class="m-1nu064n">
                                <Link to='/home' replace>Home</Link>                    
                            </span>
                        </div>
                        */}
                    </div>
                    </div>
                    <div class="m-8bmlvk">
                        <button class="m-tuly59" onClick={this.props.toggleModal}>
                            <div class="m-1p69bc5">Link a new Repository</div>
                        </button>
                        {/*<button class="m-vo4wxu">
                            <div class="m-1ezktkn">
                                <img src="https://fastcdn.mobalytics.gg/assets/common/icons/specific-icons/mobalytics-plus.svg" alt="Get plus"/>
                            </div>
                        </button>
                         */}
                         {/*
                        <div class="m-1wv4onu">
                            <div class="m-owqsqu">
                                <div class="m-1u0ilf6">
                                    <img src="https://fastcdn.mobalytics.gg/assets/common/icons/system-icons/question-info.svg" alt="support" class="m-trv7im"/>
                                </div>
                            </div>
                            <div class="m-101kwlt" id="dropdown1">
                            <div class="m-1lfs2rt">
                                <a href="https://support.mobalytics.gg/hc/en-us/requests/new" class="m-ka11ik" target="_blank" rel="noreferrer noopener">Provide feedback</a>
                                <a href="https://support.mobalytics.gg/hc/en-us" class="m-ka11ik" target="_blank" rel="noreferrer noopener">Check FAQ</a>
                                <a href="https://support.mobalytics.gg/hc/en-us/requests/new" class="m-ka11ik" target="_blank" rel="noreferrer noopener">Submit a bug</a>
                                <a href="https://support.mobalytics.gg/hc/en-us/requests/new" class="m-ka11ik" target="_blank" rel="noreferrer noopener">Ask a Question</a>
                            </div>
                            </div> 
                        </div>
                         */}
                        
                        <div class="m-1wv4onu" id="cogwheel">
                            <div class="m-owqsqu">
                                <div class="m-1u0ilf6">
                                    <img src="/settings.png" alt="settings" class="m-trv7im"/>
                                </div>
                            </div>
                        <div class="m-101kwlt" id="dropdown2">
                            <div class="m-wjum0u">                                                                  
                                <a class="m-ka11ik" onClick={()=>this.props.toggleSettingsModal(false)}> Settings</a>                                   
                            </div>
                            <div class="m-wjum0u">                                                                  
                                <a class="m-ka11ik" onClick={this.logout}>Logout</a>                                   
                            </div>
                        </div>
                    </div>
                    
                    </div>
                </div>
                </div>
                </div>
           
             </>)
        
    }
}

export default NavBar
