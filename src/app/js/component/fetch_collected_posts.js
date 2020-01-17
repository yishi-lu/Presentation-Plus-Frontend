import React, {Component} from 'react';
import {
    Link,
} from "react-router-dom";
import { Dropdown, Container, Row, Col, Image } from 'react-bootstrap';

import axios from 'axios';

class CollectedPosts extends Component{

    constructor(props){
        super(props);
    
        this.state = {
          posts: [],
          loaded_data: false,
        }

        this.reloadPage = this.reloadPage.bind(this);


    }

    componentDidUpdate(prevProps){

        if(this.props.update_nav != prevProps.update_nav){
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                }
            }
    
            axios.get('http://www.presentation-plus.com/api/post/collectList', config)
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

    }

    componentDidMount(){

        const config = {
            headers: {
                'Content-Type': 'application/json',
            }
        }

        axios.get('http://www.presentation-plus.com/api/post/collectList', config)
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

    reloadPage(event){
        console.log(event.target.value)
        // this.props.urlInfo.history.push(event.target.to);
    }

    render(){

        let content = [];

        if(this.state.loaded_data){

            this.state.posts.forEach((post, id) => {
                let image_path = post.image_url.includes('post_cover/') ? "http://www.presentation-plus.com/storage/"+post.image_url : post.image_url;

                content.push(
                    <Link style={{marginLeft: "-5px"}} to={'/post/detail/'+post.post_id} key={id} target="_blank">
                        <Row value={'/post/detail/'+post.post_id} onClick={this.reloadPage}>
                            <Col>
                                <Image src={image_path} className={this.props.styles.collected_post_img} ></Image>
                            </Col>
                            <Col>
                                <Container>
                                    <Row>
                                        {post.title}
                                    </Row>
                                    <Row>
                                        {post.description}
                                    </Row>
                                    <Row>
                                        {post.name}
                                    </Row>
                                </Container>
                            </Col>
                        </Row>
                    </Link>

                )
            })
        }


        if(this.state.loaded_data){
            return(
                <div className={this.props.styles.dropdown}>
                    <div className={this.props.styles.dropbtn}>Collection</div>
                    <Container className={this.props.styles.dropdown_content}>
                        {content}
                    </Container>
                    
                    <div className={this.props.styles.dropdown_content + " " + this.props.styles.dropdown_content_btn}>Check All</div>
                </div>
            );
        }
        else return(
            <div className={this.props.styles.dropdown}>
                <div className={this.props.styles.dropbtn}>Collection</div>
                <div className={this.props.styles.dropdown_content}>
                    <div>loading...</div>
                </div>
            </div>
        )

        
    }

}

export default CollectedPosts;