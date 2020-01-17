import React, {Component} from 'react';
import axios from 'axios';

import { Navbar, Nav, NavItem } from 'react-bootstrap';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect
} from "react-router-dom";
import { Button, Container, Row, Col, Image, md } from 'react-bootstrap';

import Paging from '../layout/paging.js';

// import styles from '../css/main.css';

class Profile extends Component{
    
    constructor(props){
        super(props);

        let current_user = localStorage.getItem("user");
        if(current_user != null && current_user != undefined && current_user != "") current_user = JSON.parse(current_user); 

        this.state = {
            user_info: "",
            posts: [],
            loaded_data: false,

            auth_user: null ? "" : current_user,
        }

        this.user_post_pagination = this.user_post_pagination.bind(this);
        this.follow_unfollow = this.follow_unfollow.bind(this);

    }

    follow_unfollow(event){

        var url = "http://www.presentation-plus.com/api/profile/follow_unfollow";

        var data = {profile_id: this.state.user_info.profile_id};

        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true
        }

        axios.post(url, data, config)
             .then(result => {
                console.log(result);

                this.setState(prevState => {
                    var user_info = {...prevState.user_info};

                    if(user_info != ""){
                        user_info.follow = !user_info.follow
                    }

                    if(user_info.follow) user_info.followerCount++;
                    else user_info.followerCount--;

                    return {user_info: user_info};
                })
             })
             .catch(error => {
                console.log("ERRRR:: ",error);
                alert("The user does not exists");
                window.location.href = '/';
            }
        );

    }

    user_post_pagination(event) {

        var url = event.target.getAttribute('name');

        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true
        }

        var data = {profile_id: this.state.user_info.profile_id, need_post: 1};

        axios.post(url, data, config)
             .then(result => {
                console.log(result);

                this.setState({
                    posts: result.data.posts,
                    loaded_data: true,
                })
             })
             .catch(error => {
                console.log("ERRRR:: ",error);
                alert("The user does not exists");
                window.location.href = '/';
            }
        );

    }

    componentDidMount(){

        let id = this.props.urlInfo.match.params.id;
        // console.log(id);

        let data = {profile_id: id, need_post: 1};

        const config = {
            headers: {
                'Content-Type': 'application/json',
            }
        }

        axios.post('http://www.presentation-plus.com/api/profile/detail', data, config)
             .then(result => {
                console.log(result);

                this.setState({
                    user_info: result.data.user,
                    posts: result.data.posts,
                    loaded_data: true,
                })

                console.log(this.state);
             })
             .catch(error => {
                console.log("ERRRR:: ",error);
                alert("Unable to visit the user profile");
                window.location.href = '/';
            }
        );
    }

    render(){

        console.log(this.state);

        let content = [], count = 0;
        let follow_status = 'success', follow_text = "Follow"; 
        let profile_portrait = "";
        let post_types = {1:'Normal', 2:'Slides', 3:'Video', 4:'Comic'};


        if(this.state.loaded_data) {
            if(this.state.user_info.follow) {
                follow_status = 'secondary';
                follow_text = "Unfollow"; 
            }
    
            if(this.state.user_info.portrait.includes('profile_portrait/')) profile_portrait = "http://www.presentation-plus.com/storage/" + this.state.user_info.portrait;
            else profile_portrait = this.state.user_info.portrait;

            this.state.posts.data.forEach((post, idx) => {

                let image_path = post.image_url.includes('post_cover/') ? "http://www.presentation-plus.com/storage/"+post.image_url : post.image_url;
    
                content.push(
                    <Col sm md={3} className="pb-2" key={idx}>

                            <Container >
                            <Row>
                                <Link to={'/post/detail/'+post.id}>
                                    <div className={this.props.styles.post_cover_div}>
                                        <div className={this.props.styles.post_cover_content}>
                                            <span><i className="far fa-eye"></i> {post.viewed}</span>   <span><i className="fas fa-thumbs-up"></i> {post.liked}</span>
                                        </div>
                                        <Image src={image_path} thumbnail className={this.props.styles.post_cover_img} />
                                    </div>
                                </Link>
                            </Row>
                            <Row>
                                <Container >
                                    <Row>  
                                        <div ><Link to={'/post/detail/'+post.id}>{post.title}</Link></div>
                                    </Row>
                                    
                                    {/* <Col  >{post_types[post.type]}</Col> */}
                                    {/* <Row>
                                        
                                        <Col >
                                            <span><i className="far fa-eye"></i> {post.viewed}</span>   <span><i className="fas fa-thumbs-up"></i> {post.liked}</span>
                                        </Col>
                                    </Row> */}
                                    <Row>
                                        <div >
                                            <Link to={'/profile/detail/'+post.user_id}>{post.name}</Link>
                                        </div>
                                    </Row>
                                </Container>
                            </Row>
                        </Container>
                    </Col>
                )
    
            });
        }

        
        
        if(this.state.loaded_data){
            return(
                <Container>
                    <Row className=''>
                        <Col  lg={4}><Image width="300" height="300" src={profile_portrait}></Image></Col>
                        <Col  lg={8}>
                            <Row><Col><h1>{this.state.user_info.name}</h1></Col></Row>
                            <Row>
                                <Col  lg={2}><h6>Follower: {this.state.user_info.followerCount}</h6></Col> 
                                <Col  lg={2}><h6>Following: {this.state.user_info.followingCount}</h6></Col> 
                                <Col  lg={2}><h6>Post: {this.state.user_info.postCount}</h6></Col> 
                            </Row>
                            <br></br>
                            <Row><Col><h5>Signagure: {this.state.user_info.signature}</h5></Col></Row>
                            <br></br>
                            <Row>
                                {this.state.auth_user != "" ?
                                    this.state.auth_user.id != this.state.user_info.id ?
                                        <Col key={'follow_unfollow'}  lg={3}><Button variant={follow_status} onClick={this.follow_unfollow}>{follow_text}</Button></Col>   
                                        :
                                        [<Col key={'edit'}  lg={1}>
                                            <Link to={'/profile/edit'}>
                                                <Button variant="primary">Edit</Button>
                                            </Link>
                                        </Col>, 
                                        <Col key={'post'}  lg={2}>
                                            <Link to={'/post/create'}>
                                                <Button variant="danger">Add Post</Button>
                                            </Link>
                                        </Col>]
                                    :
                                    <span></span>
                                }
                                
                            </Row>
                        </Col>
                    </Row>
                    <br></br>
                    <br></br>
                    <Row><Col>User Posts:</Col></Row>
                    <hr></hr>
                    <Row className='justify-content-md-center'>
                        {content}
                    </Row>
                    <br></br>
                    <br></br>
                    <br></br>
                    <Row className='justify-content-md-center ml-1'>
                        <Paging data_info = {this.state.posts} pagination={this.user_post_pagination} styles={this.props.styles}/>
                    </Row>
                    <br></br>
                    <br></br>
                </Container>
            );
        }
        else return(<Container>In Loading...</Container>)
    }
}

export default Profile;