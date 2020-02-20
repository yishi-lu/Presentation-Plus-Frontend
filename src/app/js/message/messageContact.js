import React, {Component} from 'react';
import socketIOClient from "socket.io-client";
import { Button, Container, Row, Col, Image } from 'react-bootstrap';
import {
    Link,
} from "react-router-dom";

import axios from 'axios';

class MessageContact extends Component{

    constructor(props){
        super(props);

        this.state = {
            inputContact: "",
            contactList: this.props.contactList,

            selectedContact: "",
            loaded_data: false,
        }

        this.inputContactName = this.inputContactName.bind(this);
        this.addNewContact = this.addNewContact.bind(this);
        this.removeContact = this.removeContact.bind(this);
        this.selectContact = this.selectContact.bind(this);
    }

    selectContact(contact){
        this.setState({selectedContact: contact});
        this.props.selectContact(contact);
    }

    removeContact(contact_id){

        const config = {
            headers: {
                'Content-Type': 'application/json',
            }
        }
        
        const data = {contact_id: contact_id}

        axios.post(this.props.apiUrl + '/api/message/removeContact', data, config)
             .then(result => {
                console.log(result.data.success);

                this.setState({
                    contactList: result.data.success,
                    loaded_data: true,
                })
             })
             .catch(error => {
                console.log("ERRRR:: ",error);
                alert('invalid user name!')
            }
        );
    }

    addNewContact(event){

        event.preventDefault();

        const config = {
            headers: {
                'Content-Type': 'application/json',
            }
        }
        
        const data = {contact_name: this.state.inputContact}

        axios.post(this.props.apiUrl + '/api/message/addContact', data, config)
             .then(result => {
                console.log(result.data.success);

                this.setState({
                    contactList: result.data.success,
                    loaded_data: true,
                })
             })
             .catch(error => {
                console.log("ERRRR:: ",error);
                alert('invalid user name!')
            }
        );


    }

    inputContactName(event){

        let contactName = event.target.value;

        this.setState({inputContact: contactName});
    }

    componentDidMount() {

        const config = {
            headers: {
                'Content-Type': 'application/json',
            }
        }

        const data = {user_id:this.props.id}

        axios.post(this.props.apiUrl + '/api/message/fetchContact', data, config)
             .then(result => {
                console.log(result.data.success);

                this.setState({
                    contactList: result.data.success,
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

        let content = [];

        if(this.state.loaded_data){

            if(this.state.contactList.length>0){
                this.state.contactList.forEach((contact, idx)=>{
                    let image_path = contact.portrait.includes('profile_portrait/') ? this.props.apiUrl+"/storage/"+contact.portrait : contact.portrait;
        
                    content.push(
                        <Row key={idx} className={((this.state.selectedContact.contact_id == contact.contact_id) ? ' contact_selected ': ' contact_default ') + this.props.styles.contact_item} onClick={()=>this.selectContact(contact)}>
                            <Col sm md={6}>
                                {/* <Link to={'/profile/detail/'+contact.contact_id}> */}
                                    <Image src={image_path} className={this.props.styles.contact_portrait}/>
                                {/* </Link> */}
                            </Col>
                            <Col sm md={6}>
                                <div>{contact.contact_name}</div>
                                <i className={this.props.styles.contact_remove_color + " far fa-trash-alt fa-sm"} onClick={()=>this.removeContact(contact.contact_id)}></i>
                            </Col>    
                        </Row>
                    )
                })
            }

        }

        
        if(this.state.loaded_data){
            return(
                <Container className={this.props.styles.contactBody}>
                    <Row className="mb-4">
                        <input name="inputContact" value={this.state.inputContact} onChange={this.inputContactName}/>
                        <i className={this.props.styles.contact_add_color + " fas fa-user-plus fa-lg mt-2 ml-1"} onClick={this.addNewContact}></i>
                    </Row>
                    {content}
                </Container>
            )
        }
        else{
            return(
                <Container>
                    In loading...
                </Container>
            )
        }
    }

}

export default MessageContact;