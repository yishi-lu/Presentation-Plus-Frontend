import React, {Component} from 'react';
import { Form, Dropdown, Button, Container, Row, Col, Image, md } from 'react-bootstrap';


import axios from 'axios';

import Editable_Area from '../component/text_content_area.js';
import DataURLtoFile from '../component/image_conversion.js';

class Post_Creation extends Component{

    constructor(props){
        super(props);
    
        this.state = {
          post_type: {normal:1, slides:2, video:3, comic:4},
          title: "",
          description: "",
          cover: "",
          content: "TEXT...",
          contentImage: [],
          type: 1,
          visibility: 1,

          cover_preview:"",

          error_msg: "",
        }

        this.changeInput = this.changeInput.bind(this);
        this.create_post = this.create_post.bind(this);
        this.cancel_creation = this.cancel_creation.bind(this);
        this.uploadFile = this.uploadFile.bind(this);
        this.handleContentChange = this.handleContentChange.bind(this);
    }

    changeInput(event){
        let {name, value} = event.target;

        console.log(event.target.value);

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

            this.setState({
                cover: file,
                cover_preview: reader.result,
            })
            console.log(this.state);
        }

        reader.readAsDataURL(file)
    }

    handleContentChange(value) {

        this.setState({ content: value })

        console.log(this.state)
    }


    create_post(event){
        event.preventDefault(); 

        const config = {
            headers: {
                'Content-Type': 'application/json',
            }
        }

        this.setState(preState => {

                // var getAllImages = document.getElementsByClassName('ql-editor')[0].getElementsByTagName('img');

                var wrapper= document.createElement('div');

                var content = preState.content;

                wrapper.innerHTML= content;

                var getAllImages = wrapper.getElementsByTagName('img');

                var contentImage = preState.contentImage;

                for (var i = 0; i < getAllImages.length; i++) {

                    var image_file =  DataURLtoFile(getAllImages[i].src, "content_image"+i);
        
                    contentImage.push(image_file);
        
                    getAllImages[i].src = "image"+i+"";
        
                }

                console.log(wrapper);

                return {contentImage: contentImage,
                        content: new XMLSerializer().serializeToString(wrapper)};
            },
            
            function(){
                console.log(this.state.content);

                var formData = new FormData();

                formData.append('title', this.state.title);
                formData.append('description', this.state.description);
                formData.append('image_url', this.state.cover);
                formData.append('content', this.state.content);
                //send array data
                this.state.contentImage.forEach((item) => {
                    formData.append('contentImage[]', item);
                });
                formData.append('type', this.state.type);
                formData.append('visibility', this.state.visibility);

                axios.post(this.props.apiUrl+'/api/post/create', formData, config)
                    .then(result => {
                        console.log(result);
                        alert('Post is successfully created!');
                        window.location.href = '/#post/detail/'+result.data.success.id;

                    })
                    .catch(error => {
                        console.log("ERRRR:: ",error);
                        this.setState({
                            error_msg: error.response.data.errors,
                        })
                    }
                );
            }
        )
        

        
    }

    cancel_creation(){
        this.setState({
            title: "",
            description: "",
            cover: "",
            content: "",
            type: 1,
            visibility: 1,

            cover_preview:"",

            error_msg: "",
        });
    }

    render(){

        return(

            <Container>
                <Row className="justify-content-md-center">
                    <Col sm md={10}>
                        <Form>
                            <div>
                            <h2>Create New Post</h2>
                            </div>
                            <br></br>

                            <Form.Group controlId="formBasicTitle">
                                <Form.Label>Title</Form.Label>
                                <Form.Control name="title" rows="3" onChange={this.changeInput} value={this.state.title}/>
                            </Form.Group>
                            {this.state.error_msg.title != "" ? <div className={this.props.styles.error_message + ' mt-2 mb-3'} >{this.state.error_msg.title}</div> : ""}

                            <Form.Group controlId="formBasicDescription">
                                <Form.Label>Description (200 character)</Form.Label>
                                <Form.Control name="description" as="textarea" rows="3" onChange={this.changeInput} value={this.state.description}/>
                            </Form.Group>

                            <Form.Group controlId="formBasicCover">
                                <Form.Label>Post Cover (.gif, .jpg, .jpeg, .png)</Form.Label>
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
                                            name="cover"
                                            onChange={this.uploadFile}
                                        />
                                        <label className="custom-file-label" htmlFor="inputGroupFile01">
                                        {this.state.cover.name}
                                        </label>
                                    </div>
                                </div>
                                <br></br>
                                {this.state.cover_preview != "" ? 
                                    <Row className="justify-content-md-center"><Col style={{textAlign:"center"}}><Image src={this.state.cover_preview} thumbnail width='300' height='300'></Image></Col></Row>
                                    :
                                    <span></span>
                                }
                            </Form.Group>
                            <br></br>
                            {/* {this.state.registerError.email != "" ? <div className={this.props.styles.error_message + ' mt-2 mb-3'} >{this.state.registerError.email}</div> : ""} */}

                            <Form.Group controlId="basicFormVisibility">
                                <Form.Label>Post Visibility</Form.Label>
                                {/* make default value works, just make defaultValue to match to the option's value */}
                                <Form.Control name="visibility" as="select" onChange={this.changeInput} value={this.state.visibility}>
                                    <option value='0'>Private</option>
                                    <option value='1'>Public</option>
                                    <option value='2'>Following</option>
                                </Form.Control>
                            </Form.Group>

                            <Form.Group controlId="basicFormType">
                                <Form.Label>Post Type</Form.Label>
                                {/* make default value works, just make defaultValue to match to the option's value */}
                                <Form.Control name="type" as="select" onChange={this.changeInput} value={this.state.type}>
                                    <option value='1'>Normal</option>
                                    <option value='2'>Slides</option>
                                    <option value='3'>Video</option>
                                    <option value='4'>Comic</option>
                                </Form.Control>
                            </Form.Group>

                            <Form.Group controlId="basicFormContent">
                                {this.state.type == 1 ? <Editable_Area name='content' value={this.state.content} changeContent={this.handleContentChange} /> : <span></span>}
                            </Form.Group>
                            {this.state.error_msg.content != "" ? <div className={this.props.styles.error_message + ' mt-2 mb-3'} >{this.state.error_msg.content}</div> : ""}


                            <br></br>
                            <br></br>
                            <br></br>
                            <br></br>
                            <Row>
                                <Col sm md={2}>
                                <Button variant="primary" type="submit" onClick={this.create_post}>
                                    Create
                                </Button>
                                </Col>

                                <Col sm md={3}>
                                <Button variant="danger" type="submit" onClick={this.cancel_creation}>
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
        )
    }

}

export default Post_Creation;