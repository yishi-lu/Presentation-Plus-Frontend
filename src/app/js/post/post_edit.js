import React, {Component} from 'react';
import { Form, Dropdown, Button, Container, Row, Col, Image, md } from 'react-bootstrap';


import axios from 'axios';

import Editable_Area from '../component/text_content_area.js';
import DataURLtoFile from '../component/image_conversion.js';

class Post_Edit extends Component{

    constructor(props){
        super(props);
    
        this.state = {
          post_type: {normal:1, slides:2, video:3, comic:4},
          post_detail: {},

          post_old_data: {},

          cover_preview:"",
          cover:"",
          contentImage: [],
          originalImage: [],

          error_msg: "",
        }

        this.changeInput = this.changeInput.bind(this);
        this.update_post = this.update_post.bind(this);
        this.cancel_edit = this.cancel_edit.bind(this);
        this.uploadFile = this.uploadFile.bind(this);
        this.handleContentChange = this.handleContentChange.bind(this);
    }

    componentDidMount(){

        const post_id = this.props.urlInfo.match.params.id;

        const config = {
            headers: {
                'Content-Type': 'application/json',
            }
        }

        axios.get(this.props.apiUrl+'/api/post/detail/'+post_id, config)
             .then(result => {
                console.log(result);

                this.setState({
                        post_detail: result.data.success,
                        loaded_data: true,
                    },
                    function(){

                        let image_path = this.state.post_detail.image_url.includes('post_cover/') ? 
                            this.props.apiUrl+"/storage/"+this.state.post_detail.image_url
                            : 
                            this.state.post_detail.image_url

                        this.setState(prevState => {

                            var wrapper= document.createElement('div');

                            var post_detail = {...prevState.post_detail};

                            var content = post_detail.content;

                            console.log(content);

                            wrapper.innerHTML= content;

                            var getAllImages = wrapper.getElementsByTagName('img');

                            console.log(getAllImages);

                            var post_content_image = post_detail.post_content_image;

                            for (var i = 0; i < getAllImages.length && i < post_content_image.length; i++) {
                    
                                getAllImages[i].src = this.props.apiUrl+"/storage/"+post_content_image[i].content_image;
                    
                            }

                            post_detail.content = wrapper.innerHTML;

                            post_detail.image_url = image_path;

                            return {post_detail: post_detail,
                                    post_old_data: post_detail,
                                    cover_preview: image_path};
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

    changeInput(event){
        let {name, value} = event.target;

        console.log(event.target.value);

        this.setState(preState=>{
            
            let post_detail = {...preState.post_detail};

            post_detail[name] = value;

            return {post_detail: post_detail}

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

        this.setState(preState=>{ 

            let post_detail = {...preState.post_detail};

            post_detail.content = value;

            return {post_detail: post_detail};

         })

        console.log(this.state)
    }


    update_post(event){
        event.preventDefault(); 

        const config = {
            headers: {
                'Content-Type': 'application/json',
            }
        }

        this.setState(preState => {

                var wrapper= document.createElement('div');

                var post_detail = {...preState.post_detail};

                var contentImage = preState.contentImage;
                var originalImage = preState.originalImage;

                var content = post_detail.content;

                wrapper.innerHTML= content;

                var getAllImages = wrapper.getElementsByTagName('img');

                for (var i = 0; i < getAllImages.length; i++) {

                    if(getAllImages[i].src.includes('post_content_image/')) {
                        originalImage.push(getAllImages[i].src.split('storage/')[1]+'###'+i);
                    }
                    else{

                        var image_file =  DataURLtoFile(getAllImages[i].src, "content_image"+i+"###"+i);
                        contentImage.push(image_file);
                    }

        
                    getAllImages[i].src = "image"+i+"";
        
                }

                post_detail.content = new XMLSerializer().serializeToString(wrapper);

                console.log(wrapper);

                return {contentImage: contentImage,
                        post_detail: post_detail};
            },
            
            function(){
                console.log(this.state);

                var formData = new FormData();

                formData.append('post_id', this.state.post_detail.id);
                formData.append('title', this.state.post_detail.title);
                formData.append('description', this.state.post_detail.description);
                formData.append('image_url', this.state.cover);
                formData.append('content', this.state.post_detail.content);
                //send array data
                this.state.contentImage.forEach((item) => {
                    formData.append('contentImage[]', item);
                });
                this.state.originalImage.forEach((item) => {
                    formData.append('originalImage[]', item);
                });

                formData.append('type', this.state.post_detail.type);
                formData.append('visibility', this.state.post_detail.visibility);

                axios.post(this.props.apiUrl+'/api/post/edit', formData, config)
                    .then(result => {
                        console.log(result);
                        alert('Post is successfully updated!');
                        window.location.href = '/#post/detail/'+this.state.post_detail.id;

                    })
                    .catch(error => {
                        console.log("ERRRR:: ",error);
                        // alert('Unable to update the post, please try again later or contact admin');
                        // // window.location.href = '/';
                        this.setState({
                            error_msg: error.response.data.errors,
                        })
                    }
                );
            }
        )
    }

    cancel_edit(event){
        event.preventDefault(); 
        this.setState({
            post_detail: this.state.post_old_data,
            cover_preview: this.state.post_old_data.image_url,
            cover: ""
        })
    }

    render(){

        // console.log(this.state.post_detail);
        console.log(this.state.error_msg);
        return(

            <Container>
                <Row className="justify-content-md-center">
                    <Col sm md={10}>
                        <Form>
                            <div>
                            <h2>Edit Post</h2>
                            </div>
                            <br></br>

                            <Form.Group controlId="formBasicTitle">
                                <Form.Label>Title</Form.Label>
                                <Form.Control name="title" onChange={this.changeInput} value={this.state.post_detail.title}/>
                            </Form.Group>
                            {this.state.error_msg.title != "" ? <div className={this.props.styles.error_message + ' mt-2 mb-3'} >{this.state.error_msg.title}</div> : ""}

                            <Form.Group controlId="formBasicDescription">
                                <Form.Label>Description (200 character)</Form.Label>
                                <Form.Control name="description" as="textarea" rows="3" onChange={this.changeInput} value={this.state.post_detail.description == null?"":this.state.post_detail.description}/>
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

                            <Form.Group controlId="basicFormVisibility">
                                <Form.Label>Post Visibility</Form.Label>
                                {/* make default value works, just make defaultValue to match to the option's value */}
                                <Form.Control name="visibility" as="select" onChange={this.changeInput} value={this.state.post_detail.visibility}>
                                    <option value='0'>Private</option>
                                    <option value='1'>Public</option>
                                    <option value='2'>Following</option>
                                </Form.Control>
                            </Form.Group>

                            <Form.Group controlId="basicFormType">
                                <Form.Label>Post Type</Form.Label>
                                {/* make default value works, just make defaultValue to match to the option's value */}
                                <Form.Control name="type" as="select" onChange={this.changeInput} value={this.state.post_detail.type}>
                                    <option value='1'>Normal</option>
                                    <option value='2'>Slides</option>
                                    <option value='3'>Video</option>
                                    <option value='4'>Comic</option>
                                </Form.Control>
                            </Form.Group>

                            <Form.Group controlId="basicFormContent">
                                {this.state.post_detail.type == 1 ? <Editable_Area name='content' value={this.state.post_detail.content} changeContent={this.handleContentChange} /> : <span></span>}
                            </Form.Group>
                            {this.state.error_msg.content != "" ? <div className={this.props.styles.error_message + ' mt-2 mb-3'} >{this.state.error_msg.content}</div> : ""}


                            <br></br>
                            <br></br>
                            <br></br>
                            <br></br>
                            <Row>
                                <Col sm md={2}>
                                <Button variant="primary" type="submit" onClick={this.update_post}>
                                    Update
                                </Button>
                                </Col>

                                <Col sm md={3}>
                                <Button variant="danger" type="submit" onClick={this.cancel_edit}>
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

export default Post_Edit;