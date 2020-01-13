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

    render(){

        return(
            <Dropdown>
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                    Collection
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                    <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                    <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        );
    }

}

export default CollectedPosts;