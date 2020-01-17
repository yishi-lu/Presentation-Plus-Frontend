import React, {Component} from 'react';
import {
    Link,
} from "react-router-dom";
import { Button, Container, Row, Col, Image } from 'react-bootstrap';

import axios from 'axios';

// import styles from '../css/main.css';
import Paging from './paging.js';

class Home extends Component{

    constructor(props){
        super(props);
    
        this.state = {
          posts: [],
          loaded_data: false,
        }

        this.all_post_pagination = this.all_post_pagination.bind(this);
    }
    
    componentDidMount(){

        const config = {
            headers: {
                'Content-Type': 'application/json',
            }
        }

        axios.get('http://www.presentation-plus.com/api/post/all', config)
             .then(result => {
                console.log(result);

                this.setState({
                    posts: result.data.success,
                    loaded_data: true,
                })
             })
             .catch(error => {
                console.log("ERRRR:: ",error);
                // window.location.href = '/';
            }
        );
    }

    all_post_pagination(event) {

        console.log(event.target);

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
                    posts: result.data.success,
                    loaded_data: true,
                })
             })
             .catch(error => {
                console.log("ERRRR:: ",error);

            }
        );

    }

    render() {

        console.log(this.props.urlInfo);

        // let { path, url } = useRouteMatch();
        let path = this.props.urlInfo.match.path;
        let url = this.props.urlInfo.match.url;
        let post_types = {1:'Normal', 2:'Slides', 3:'Video', 4:'Comic'};

        console.log(this.state);

        let content = [], count = 0;

        if(!this.state.loaded_data) content = [];
        else {
            this.state.posts.data.forEach((post, idx) => {

                let image_path = post.image_url.includes('post_cover/') ? "http://www.presentation-plus.com/storage/"+post.image_url : post.image_url;
    
                content.push(
                    <Col sm md="3" className="pb-2" key={idx}>
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
                                        <div><Link to={'/post/detail/'+post.id}>{post.title}</Link></div>
                                    </Row>
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

        return (
            <Container>
                <Row className='justify-content-md-center'>
                    {content}
                </Row>
                <br></br>
                <br></br>
                <br></br>
                <Row className='justify-content-md-center'>
                    <Paging data_info = {this.state.posts} pagination={this.all_post_pagination} styles={this.props.styles}/>
                </Row>
                <br></br>
                <br></br>
            </Container>
        );
    }
}

export default Home;