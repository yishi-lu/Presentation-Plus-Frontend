import React, {Component} from 'react';
import { Container, Row, Col, Image, Form, Button } from 'react-bootstrap';

import {
    Link,
} from "react-router-dom";

import axios from 'axios';

import Paging from '../layout/paging.js';

class Comment extends Component{

    constructor(props){
        super(props);

        let current_user = localStorage.getItem("user");
        if(current_user != null && current_user != undefined && current_user != "") current_user = JSON.parse(current_user); 
    
        this.state = {
          comments: {},
          auth_user: current_user,
          loaded_data: false,

          title: "",
          content: "",

          errors: {title:"", content:""},
        }

        this.post_comments_pagination = this.post_comments_pagination.bind(this);
        this.changeInput = this.changeInput.bind(this);
        this.createComment = this.createComment.bind(this);
    }

    createComment(){

        if(this.state.auth_user == null) {
            alert("You must login to post comments!");
        }

        const url = "http://www.presentation-plus.com/api/comment/create";

        const config = {
            headers: {
                'Content-Type': 'application/json',
            }
        }

        const data = {post_id: this.props.postID, 
                      title: this.state.title,
                      content: this.state.content};
        
        console.log(this.state.comments);
        
        axios.post(url, data, config)
             .then(result => {
                console.log(result);

                const post_id = this.props.postID;

                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }

                const url = 'http://www.presentation-plus.com/api/comment/postComments/'+post_id;

                axios.get(url, config)
                    .then(result => {

                        console.log(result.data.success);
                        console.log(url);

                        this.setState({
                            comments: result.data.success,
                            loaded_data: true,
                            title: "",
                            content: "",
                        })
                    })
                    .catch(error => {
                        console.log("ERRRR:: ",error);
                        // window.location.href = '/';
                    });
             })
             .catch(error => {
                console.log("ERRRR:: ",error.response.data.errors);
                this.setState({
                    errors: error.response.data.errors
                })
            }
        );

    }

    changeInput(event){

        let {name, value} = event.target;

        console.log(event.target);

        this.setState({
            [name]: value,
        })
    }

    post_comments_pagination(event){
        var url = event.target.getAttribute('name');

        const config = {
            headers: {
                'Content-Type': 'application/json',
            }
        }

        axios.get(url, config)
             .then(result => {
                console.log(result);

                this.setState({
                    comments: result.data.success,
                    loaded_data: true,
                })
             })
             .catch(error => {
                console.log("ERRRR:: ",error);

            }
        );
    }

    componentDidMount(){
        
        const post_id = this.props.postID;

        const config = {
            headers: {
                'Content-Type': 'application/json',
            }
        }

        const url = 'http://www.presentation-plus.com/api/comment/postComments/'+post_id;

        axios.get(url, config)
             .then(result => {

                console.log(result.data.success);
                console.log(url);

                this.setState({
                    comments: result.data.success,
                    loaded_data: true,
                })
             })
             .catch(error => {
                console.log("ERRRR:: ",error);
                // window.location.href = '/';
            });
    }

    render(){
        var content = [];

        var new_comment_form = <Row className='mb-5'>
                                    <Form className='w-100'>
                                        <Form.Group controlId="formBasicTitle">
                                            <Form.Control name="title" onChange={this.changeInput} value={this.state.title} placeholder="Title" />
                                        </Form.Group>
                                        {this.state.errors.title != "" ? <div className={this.props.styles.error_message + ' mt-2 mb-3'} >{this.state.errors.title}</div> : ""}

                                        <Form.Group controlId="formBasicDescription">
                                            <Form.Control placeholder="comment..." name="content" as="textarea" rows="3" onChange={this.changeInput} value={this.state.content}/>
                                        </Form.Group>
                                        {this.state.errors.content != "" ? <div className={this.props.styles.error_message + ' mt-2 mb-3'} >{this.state.errors.content}</div> : ""}

                                    </Form>
                                    <div>
                                        <Button variant="primary" type="submit" onClick={this.createComment}>
                                            Post Comment
                                        </Button>
                                    </div>
                                </Row>
        
        if(this.state.auth_user == null || this.state.auth_user == undefined || this.state.auth_user == "") new_comment_form = <Row></Row>

        if(this.state.loaded_data){
            if(this.state.comments.data.length > 0){

                this.state.comments.data.forEach((comment, idx) => {

                    let image_path = comment.portrait.includes('profile_portrait/') ? "http://www.presentation-plus.com/storage/"+comment.portrait : comment.portrait;
        
                    content.push(
                        <Row key={idx} className="mt-4">
                            <Col sm md={2}>
                                <Link to={'/profile/detail/'+comment.user_id}>
                                    <Image src={image_path} className={this.props.styles.comment_portrait} />
                                </Link>
                            </Col>
                            <Col sm md={10}>
                                <div>
                                    <Link to={'/profile/detail/'+comment.user_id}>
                                        {comment.name}
                                    </Link>
                                </div>
                                <div className={this.props.styles.text_wrap}>
                                    {comment.title}
                                </div>   
                                <div className={this.props.styles.text_wrap}>
                                    {comment.content}
                                </div>
                                <div>
                                    <span className="mr-5">{comment.created_at}</span>
                                    <span className="mr-5"><i className="fas fa-thumbs-up"></i>  {comment.liked}</span>
                                    <span className="mr-5"><i className="fas fa-thumbs-down"></i></span>
                                    <span className="mr-5"><i className="fas fa-comment-dots"></i></span>
                                </div>     
                            </Col>    
                        </Row>
                    )
        
                });


                return(
                    <Container>
                        {content}
                        <Row className='justify-content-md-center mt-5 mb-3'>
                            <Paging data_info={this.state.comments} pagination={this.post_comments_pagination} styles={this.props.styles}/>
                        </Row>
                        {new_comment_form}
                    </Container>
                )
            }
            else {
                return(
                    <Container>
                        <Row className="mt-5 mb-5">There is no comments</Row>
                        {new_comment_form}
                    </Container>
                    

                )
            }
            
        }
        else {
            return (
                <div>In Loading...</div>
            )
        }

            
    }

}

export default Comment;