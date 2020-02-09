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
import { Form, Dropdown, Button, Container, Row, Col, Image, md } from 'react-bootstrap';

import Paging from '../layout/paging.js';

// import styles from '../css/main.css';

class Edit_Profile extends Component{

    constructor(props){
        super(props);
    
        this.state = {
            user_info: "",
            portrait_preview: "",
            loaded_data: false,

            signature: "",
            portrait: "",
            visibility: "",

            error_msg: "",
        }

        this.uploadFile = this.uploadFile.bind(this);
        this.changeInput = this.changeInput.bind(this);
        this.update_profile = this.update_profile.bind(this);
        this.cancel_update = this.cancel_update.bind(this);
    }

    componentDidMount(){

        let id = this.props.user.id;

        console.log(id);

        let data = {profile_id: id, need_post: 0};

        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
            
        }

        axios.post(this.props.apiUrl+'/api/profile/detail',  data, config)
             .then(result => {
                console.log(result);

                this.setState({
                    portrait_preview: result.data.user.portrait,
                    user_info: result.data.user,
                    loaded_data: true,

                    signature: result.data.user.signature,
                    portrait: "",
                    visibility: result.data.user.visibility,
                })

                console.log(this.state);
             })
             .catch(error => {
                console.log("ERRRR:: ",error);
                alert("Unable to visit the page");
                window.location.href = '/';
            }
        );
    }

    update_profile(event){
        event.preventDefault();
        
        let url = this.props.apiUrl+"/api/profile/edit";

        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true
        }

        var formData = new FormData();

        formData.append('signature', this.state.signature);
        formData.append('portrait', this.state.portrait);
        formData.append('visibility', this.state.visibility);
    

        // console.log(this.state.portrait)

        axios.post(url, formData, config)
             .then(result => {
                console.log(result);

                alert('Updated Successfully!');
                window.location.href = '/profile/detail/'+this.state.user_info.id;


             })
             .catch(error => {
                console.log("ERRRR:: ",error.response.data);
                // alert("Unable To visit the page111");
                // window.location.href = '/';

                this.setState({
                    error_msg: error.response.data.errors,
                })
            });

    }

    cancel_update(event){
        event.preventDefault(); 

        this.setState(preState=>{

            let user_info = {...preState.user_info};

            let signature = user_info.signature;
            let portrait_preview = user_info.portrait;
            let visibility = user_info.visibility;

            return{signature:signature,
                   portrait_preview:portrait_preview,
                   portrait:"",
                   visibility:visibility};

        })
    }

    changeInput(event){

        let {name, value} = event.target;

        console.log(event.target.value);

        // this.setState(preState=>{

        //     let user_info = {...preState.user_info};

        //     user_info[name] = value;

        //     return {user_info: user_info};
        // });

        this.setState({
            [name]: value,
        });

        console.log(this.state);

    }

    uploadFile(event){
        event.preventDefault(); 

        let reader = new FileReader();
        let file = event.target.files[0];
        console.log(file);

        reader.onloadend = () => {
            // this.setState(preState=>{
               
            //     let user_info = {...preState.user_info};
    
            //     user_info.portrait = file;
    
            //     return {user_info: user_info, portrait_preview: reader.result};
    
            // });

            this.setState({
                portrait: file,
                portrait_preview: reader.result,
            })
            console.log(this.state);
        }

        reader.readAsDataURL(file)
    }

    
    
    render() {
        if(this.state.loaded_data){

            let new_portrait = "";
            if(this.state.portrait_preview.includes('profile_portrait/')) new_portrait = this.props.apiUrl+"/storage/" + this.state.portrait_preview;
            else new_portrait = this.state.portrait_preview;

            return (
                <Container>
                    <Row className="justify-content-md-center">
                        <Col sm md={6}>
                            <Form>
                                <div>
                                <h2>Edit User Profile</h2>
                                </div>
                                <br></br>
                                <Form.Group controlId="formBasicPortrait">
                                    <Form.Label>Portrait (.gif, .jpg, .jpeg, .png)</Form.Label>
                                    <div className="input-group">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text" id="inputGroupFileAddon01">
                                            Upload
                                            </span>
                                        </div>
                                        <div className="custom-file">
                                            <input
                                                type="file"
                                                className="custom-file-input"
                                                id="inputGroupFile01"
                                                aria-describedby="inputGroupFileAddon01"
                                                accept=".gif,.jpg,.jpeg,.png"
                                                name="portrait"
                                                onChange={this.uploadFile}
                                            />
                                            <label className="custom-file-label" htmlFor="inputGroupFile01">
                                            {this.state.portrait.name}
                                            </label>
                                        </div>
                                    </div>
                                    <br></br>
                                    <Row className="justify-content-md-center"><Image src={new_portrait} thumbnail width='300' height='300'></Image></Row>
                                </Form.Group>
                                <br></br>
                                {/* {this.state.registerError.email != "" ? <div className={this.props.styles.error_message + ' mt-2 mb-3'} >{this.state.registerError.email}</div> : ""} */}

                                <Form.Group controlId="exampleForm.ControlTextarea">
                                    <Form.Label>Signature (100 characters)</Form.Label>
                                    <Form.Control name="signature" as="textarea" rows="3" onChange={this.changeInput} value={this.state.signature}/>
                                </Form.Group>
                                {this.state.error_msg.signature != "" ? <div className={this.props.styles.error_message + ' mt-2 mb-3'} >{this.state.error_msg.signature}</div> : ""}

                                {/* <Dropdown>
                                    <label className='d-block'>Profile Visibility</label>
                                    <Dropdown.Toggle variant="success" id="dropdown-basic" className='w-100'>
                                        Profile Visibility
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu className='w-100'>
                                        <Dropdown.Item value='0'>Private</Dropdown.Item>
                                        <Dropdown.Item value='1'>Public</Dropdown.Item>
                                        <Dropdown.Item value='2'>Following</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown> */}
                                <Form.Group controlId="exampleForm.ControlSelect">
                                    <Form.Label>Profile Visibility</Form.Label>
                                    {/* make default value works, just make defaultValue to match to the option's value */}
                                    <Form.Control name="visibility" as="select" onChange={this.changeInput} value={this.state.visibility}>
                                        <option value='0'>Private</option>
                                        <option value='1'>Public</option>
                                        <option value='2'>Following</option>
                                    </Form.Control>
                                </Form.Group>

                                <br></br>
                                <br></br>
                                <Row>
                                    <Col sm md={2}>
                                    <Button variant="primary" type="submit" onClick={this.update_profile}>
                                        Update
                                    </Button>
                                    </Col>

                                    <Col sm md={3}>
                                    <Button variant="danger" type="submit" onClick={this.cancel_update}>
                                        Cancel
                                    </Button>
                                    </Col>
                                </Row>
                            </Form>
                        </Col>
                    </Row>
                    <br></br>
                    <br></br>
                </Container>
            );
        }
        else return (<Container>In Loading...</Container>)

    }

}

export default Edit_Profile;