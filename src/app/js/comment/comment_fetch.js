import React, {Component} from 'react';
import { Container, Row, Col, Image, Form, Button } from 'react-bootstrap';

import {
    Link,
} from "react-router-dom";

import axios from 'axios';

import Paging from '../layout/paging.js';
import SubComment from './sub_comment.js';

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

            sub_title: "",
            sub_content: "",   

            errors: {title:"", content:""},
            suberrors: {sub_title:"", sub_content:""},

            create_sub: false,
        }

        this.post_comments_pagination = this.post_comments_pagination.bind(this);
        this.changeInput = this.changeInput.bind(this);
        this.createComment = this.createComment.bind(this);
        this.show_subcomment_form = this.show_subcomment_form.bind(this);
        this.create_subcomment = this.create_subcomment.bind(this);
    }

    create_subcomment(event){
        this.createComment(this.state.sub_title, this.state.sub_content, event.target.id);

        this.setState({
            sub_title: "",
            sub_content: "",
            suberrors: {sub_title:"", sub_content:""},
        })
    }

    createComment(new_title = "", new_content = "", threadID = ""){

        if(this.state.auth_user == null) {
            alert("You must login to post comments!");
            return;
        }

        const url = "http://www.presentation-plus.com/api/comment/create";

        const config = {
            headers: {
                'Content-Type': 'application/json',
            }
        }

        var data;
        if(new_title == "" && new_content == "" && threadID == ""){
            data = {post_id: this.props.postID, 
                        title: this.state.title,
                        content: this.state.content};
        }
        else {
            data = {
                post_id: this.props.postID, 
                        title: new_title,
                        content: new_content,
                        comment_id: threadID,
            }
        }
        
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

                        result.data.success.data.map(item=> item.addSub = false)

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

    show_subcomment_form(event){

        let id = event.target.id;

        this.setState(preState => {
            let comments = {...preState.comments};

            let data = comments.data;

            data = data.map(item => {
                if(item.id == id) item.addSub = !item.addSub;

                return item;
            })

            comments.data = data;

            return {comments: comments}

        })

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
                console.log(result.data.success.data);

                if(!Array.isArray(result.data.success.data)){
                    // let temp = result.data.success.data;
                    // let arr = Object.keys(temp).map((k) => temp[k]);
                    // result.data.success.data = arr;
                    result.data.success.data = Object.keys(result.data.success.data).map((k) => result.data.success.data[k]);
                }

                result.data.success.data.map(item=> item.addSub = false)

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

                result.data.success.data.map(item=> item.addSub = false)

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
                                    <span className="mr-5"><i className="fas fa-comment-dots" id={comment.id} onClick={this.show_subcomment_form}></i></span>
                                </div> 
                                {comment.addSub ? 

                                    <Row className='mb-5 mt-5'>
                                        <Form className='w-100'>
                                            <Form.Group controlId="formBasicTitle">
                                                <Form.Control name="sub_title" onChange={this.changeInput} value={this.state.sub_title} placeholder="Title" />
                                            </Form.Group>
                                            {this.state.errors.sub_title != "" ? <div className={this.props.styles.error_message + ' mt-2 mb-3'} >{this.state.errors.sub_title}</div> : ""}

                                            <Form.Group controlId="formBasicDescription">
                                                <Form.Control placeholder="comment..." name="sub_content" as="textarea" rows="3" onChange={this.changeInput} value={this.state.sub_content}/>
                                            </Form.Group>
                                            {this.state.errors.sub_content != "" ? <div className={this.props.styles.error_message + ' mt-2 mb-3'} >{this.state.errors.sub_content}</div> : ""}

                                        </Form>
                                        <div>
                                            <Button variant="primary" type="submit" id={comment.id} onClick={this.create_subcomment}>
                                                Post Comment
                                            </Button>
                                        </div>
                                    </Row>
                                
                                : <span></span>}
                                {comment.sub_comments.data.length > 0 
                                    ? 
                                    <SubComment subcomments={comment.sub_comments} styles={this.props.styles} threadID={comment.id} createComment={this.createComment}/>  
                                    : 
                                    <span></span>}
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