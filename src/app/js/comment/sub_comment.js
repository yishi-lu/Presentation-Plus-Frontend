import React, {Component} from 'react';
import { Container, Row, Col, Image, Form, Button } from 'react-bootstrap';

import {
    Link,
} from "react-router-dom";

import axios from 'axios';

import Paging from '../layout/paging.js';

class SubComment extends Component{

    constructor(props){
        super(props);

        this.state = {
            create_comment: false,

            title: "",
            content: "",
            errors: {title:"", content:""},
        }

        this.show_comment_frame = this.show_comment_frame.bind(this);
        this.changeInput = this.changeInput.bind(this);
        this.create_subcomment = this.create_subcomment.bind(this);
        this.post_subcomments_pagination = this.post_subcomments_pagination.bind(this);
        this.like_comment_initial = this.like_comment_initial.bind(this);
    }

    like_comment_initial(event){

        this.props.like_comment(event.target.id);
    }

    post_subcomments_pagination(event){

        var url = event.target.getAttribute('name');

        this.props.sub_comment_paging(url);
    }

    create_subcomment(){

        this.props.createComment(this.state.title, this.state.content, this.props.threadID);

        this.setState({
            create_comment: false,

            title: "",
            content: "",
        })
    }

    show_comment_frame(){

        this.setState(preState => {
            return {create_comment: !preState.create_comment}
        })

    }

    changeInput(event){

        let {name, value} = event.target;

        console.log(event.target);

        this.setState({
            [name]: value,
        })
    }

    render(){

        let content = [];

        var new_comment_form = <Row className='mb-5 mt-5'>
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
                                        <Button variant="primary" type="submit" onClick={this.create_subcomment}>
                                            Post Comment
                                        </Button>
                                    </div>
                                </Row>

        this.props.subcomments.data.forEach((comment, idx) => {

            let image_path = comment.portrait.includes('profile_portrait/') ? "http://www.presentation-plus.com/storage/"+comment.portrait : comment.portrait;

            content.push(
                <Row key={idx} className="mt-4">
                    <Col sm md={2}>
                        <Link to={'/profile/detail/'+comment.user_id}>
                            <Image src={image_path} className={this.props.styles.subcomment_portrait} />
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
                            <span className="mr-5">
                                <i className={comment.is_liked ? this.props.styles.liked_style + " " + this.props.styles.hover_pointer + " fas fa-thumbs-up" :this.props.styles.hover_pointer + " fas fa-thumbs-up"} 
                                    id={comment.id} onClick={this.like_comment_initial}>
                                </i>   
                                {comment.liked}
                            </span>
                            {/* <span className="mr-5"><i className="fas fa-thumbs-down"></i></span> */}
                            <span className="mr-5"><i className={this.props.styles.comment_post + " fas fa-comment-dots text-primary"} onClick={this.show_comment_frame}></i></span>
                        </div> 
                    </Col>    
                </Row>
            )

        });


        return(
            <Container>
                {content}
                <Row className='justify-content-md-center mt-5 mb-3'><Paging data_info={this.props.subcomments} pagination={this.post_subcomments_pagination} styles={this.props.styles}/></Row>
                {this.state.create_comment ? new_comment_form : <span></span>}
            </Container>
        )
    }

}

export default SubComment;