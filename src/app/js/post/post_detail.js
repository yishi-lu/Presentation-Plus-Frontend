import React, {Component} from 'react';
import { Container, Row } from 'react-bootstrap';
import ReactHtmlParser from 'react-html-parser'; 

import {
    Link,
} from "react-router-dom";

import axios from 'axios';

import Comment from '../comment/comment_fetch.js';

class Post extends Component{

    constructor(props){
        super(props);

        let current_user = localStorage.getItem("user");
        if(current_user != null && current_user != undefined && current_user != "") current_user = JSON.parse(current_user); 
    
        this.state = {
          post_detail: {},
          auth_user: current_user,
          loaded_data: false,
        }


    }

    componentDidMount(){

        const post_id = this.props.urlInfo.match.params.id;

        const config = {
            headers: {
                'Content-Type': 'application/json',
            }
        }

        axios.get('http://www.presentation-plus.com/api/post/detail/'+post_id, config)
             .then(result => {
                console.log(result);

                this.setState({
                        post_detail: result.data.success,
                        loaded_data: true,
                    },
                    function(){

                        let image_path = this.state.post_detail.image_url.includes('post_cover/') ? 
                            "http://www.presentation-plus.com/storage/"+this.state.post_detail.image_url
                            : 
                            this.state.post_detail.image_url


                        this.setState(prevState => {

                            var wrapper= document.createElement('div');

                            var post_detail = {...prevState.post_detail};

                            var content = post_detail.content;

                            // console.log(content);

                            wrapper.innerHTML= content;

                            var getAllImages = wrapper.getElementsByTagName('img');

                            // console.log(getAllImages);

                            var post_content_image = post_detail.post_content_image;

                            for (var i = 0; i < getAllImages.length && i < post_content_image.length; i++) {
                    
                                getAllImages[i].src = "http://www.presentation-plus.com/storage/"+post_content_image[i].content_image;
                                getAllImages[i].style.maxWidth  = "1200px";

                    
                            }

                            post_detail.content = wrapper.innerHTML;

                            post_detail.image_url = image_path;

                            return {post_detail: post_detail};
                        });
                    }
                )

             })
             .catch(error => {
                console.log("ERRRR:: ",error);
                window.location.href = '/';
            }
        );
    }


    render() {

        // console.log(this.statepost_detail.image_url);

        if(this.state.loaded_data){
            return (
                <Container>
                    <Row className='justify-content-md-center'><div><img className={this.props.styles.title_image} src={this.state.post_detail.image_url}></img></div></Row>
                    <Row><br/></Row>
                    <Row className='justify-content-md-center'><div><h1>{this.state.post_detail.title}</h1></div></Row>
                    <Row><br/></Row>
                    <Row className='justify-content-md-center'>
                        <div>
                            <span className='mr-3'><a href={'/profile/detail/'+this.state.post_detail.user_id}>Author: {this.state.post_detail.author_name}</a></span>
                            <span className='ml-3'>Date: {this.state.post_detail.created_at}</span>
                            {this.state.auth_user != null && (this.state.auth_user.id == this.state.post_detail.user_id)? 
                                <span className='ml-3'><Link to={"/post/edit/"+this.state.post_detail.id}><i className="fas fa-edit"></i></Link></span> : 
                                <span></span>
                            }
                        </div>
                    </Row>
                    <Row><br/></Row>
                    <Row className='justify-content-md-center'><div>{this.state.post_detail.description}</div></Row>
                    <Row><br/></Row>
                    <Row className='justify-content-md-center'><div>{ ReactHtmlParser (this.state.post_detail.content)}</div></Row>
                    <Row><br/></Row>
                    <Row className='border-bottom'><br/></Row>
                    <Row><Comment postID={this.props.urlInfo.match.params.id} styles={this.props.styles}></Comment></Row>
                </Container>
            );
        }
        else return(<Container>In Loading...</Container>)
    }
}

export default Post;