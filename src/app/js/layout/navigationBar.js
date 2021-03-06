import React, {Component} from 'react';
import axios from 'axios';

import { Navbar, Nav, NavItem } from 'react-bootstrap';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect,
    NavLink,
    HashRouter,
} from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";

import Login from '../auth/login.js';
import Register from '../auth/register.js';
import Home from './home.js';

import Post from '../post/post_detail.js';
import Post_Creation from '../post/post_create.js';
import Post_Edit from '../post/post_edit.js';

import Profile from '../profile/profile.js';
import Edit_Profile from '../profile/edit_profile.js';
import CollectedPosts from '../component/fetch_collected_posts.js';

import Message from '../message/message.js';

axios.defaults.withCredentials = true;

// import styles from '../../css/main.css';

class NavigationBar extends Component{

    constructor(props){
        super(props);

        let current_user = localStorage.getItem("user");
        if(current_user != null && current_user != undefined && current_user != "") current_user = JSON.parse(current_user); 
    
        this.state = {
          userInfo: current_user == null ? "" : current_user,
          update_nav: false,
        }
        
        this.logoutUser = this.logoutUser.bind(this);
        this.auth_user_profile = this.auth_user_profile.bind(this);
        this.update_nav_fun = this.update_nav_fun.bind(this);
    }

    update_nav_fun(){
        this.setState({update_nav: !this.state.update_nav});
    }

    auth_user_profile(event){

        let name = event.target.getAttribute('name');
        window.location.assign(name);

    }

    logoutUser(event){

        const config = {
            headers: {
                'Content-Type': 'application/json',
            }
        }
        
        
        axios.get(this.props.apiUrl+'/api/auth/logout', config)
             .then(result => {
               console.log(result);
    
               this.setState({
                loginError: "",
                userInfo: "",
              });

              localStorage.removeItem('user');
              window.location.assign('/');

             })
             .catch(error => {
              console.log("ERRRR:: ",error);

              localStorage.setItem("user", "");
            }
        );

    }

    render() {
        return (
            <HashRouter hashType="noslash">
                <Navbar bg="light" expand="sm">
                    <Navbar.Brand>
                        <LinkContainer to="/">
                            <NavItem className={this.props.styles.nav_button}>Presentation-Plus</NavItem>
                        </LinkContainer>
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        {
                            this.state.userInfo !== "" ? 
                            <Nav className="ml-auto">
                                <LinkContainer to={"/profile/detail/"+this.state.userInfo.id}>
                                    <NavItem  
                                        className={this.props.styles.nav_button+" mr-3"}
                                     >
                                            {this.state.userInfo.name}
                                    </NavItem>
                                </LinkContainer>
                                <LinkContainer to={"/message"}>
                                    <NavItem  
                                        className={this.props.styles.nav_button+" mr-3"}
                                     >
                                            Messages
                                    </NavItem>
                                </LinkContainer>
                                <NavItem className="mr-3"><CollectedPosts styles={this.props.styles} update_nav={this.state.update_nav} apiUrl={this.props.apiUrl}/></NavItem >
                                <NavItem  onClick={this.logoutUser} className={this.props.styles.nav_button}>Logout</NavItem >
                            </Nav>
                            :
                            <Nav className="ml-auto">
                                <LinkContainer to="/register" className={this.props.styles.nav_button+" mr-3"}>
                                    <NavItem >Register</NavItem>
                                </LinkContainer>
         
                                <LinkContainer to="/login" className={this.props.styles.nav_button+" mr-3"}>
                                    <NavItem>Login</NavItem>
                                </LinkContainer>
                            </Nav>
                        }
                        
                    </Navbar.Collapse>
                </Navbar>

                <br />
                <br />

                <Switch>
                    <Route exact path="/" 
                        render={
                            (props) => 
                                <Home urlInfo={props} styles={this.props.styles} apiUrl={this.props.apiUrl}
                                />
                            } 
                    />
                    <Route exact path="/login" 
                        render={
                            (props) => 
                                <Login urlInfo={props} styles={this.props.styles} apiUrl={this.props.apiUrl}/>
                            } 
                    />
                    <Route exact path="/register" 
                        render={
                            (props) => 
                                <Register urlInfo={props} styles={this.props.styles} apiUrl={this.props.apiUrl}/>
                            } 
                    />

                    <Route exact path="/message" 
                        render={
                            (props) => 
                                <Message urlInfo={props} styles={this.props.styles} apiUrl={this.props.apiUrl} user={this.state.userInfo}/>
                            } 
                    />      

                    <Route exact path="/post/detail/:id" 
                        render={
                            (props) => 
                                <Post urlInfo={props} styles={this.props.styles} update_nav_fun={this.update_nav_fun} apiUrl={this.props.apiUrl}/>
                            } 
                    />
                    <Route exact path="/post/create" 
                        render={
                            (props) => 
                                <Post_Creation urlInfo={props} styles={this.props.styles} apiUrl={this.props.apiUrl}/>
                            } 
                    />
                    <Route exact path="/post/edit/:id" 
                        render={
                            (props) => 
                                <Post_Edit urlInfo={props} styles={this.props.styles} apiUrl={this.props.apiUrl}/>
                            } 
                    />

                    <Route exact path="/profile/detail/:id" 
                        render={
                            (props) => 
                                <Profile urlInfo={props} styles={this.props.styles} apiUrl={this.props.apiUrl} />
                            } 
                    />
                    <Route exact path="/profile/edit" 
                        render={
                            (props) => 
                                <Edit_Profile urlInfo={props} styles={this.props.styles} user={this.state.userInfo} apiUrl={this.props.apiUrl}/>
                            } 
                    />
                    
                    <Redirect to="/"/>
                </Switch>
            </HashRouter>
            
        );
    }
}

export default NavigationBar;