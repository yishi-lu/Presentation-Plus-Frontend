import React, {Component} from 'react';
import { Button, Container, Row, Col, Image } from 'react-bootstrap';

import MessagePanel from './messagePanel';
import MessageContact from './messageContact';

class Message extends Component{

    constructor(props){
        super(props);

        this.state = {
            user: this.props.user,

            selectedContact: "",
        };
        
        this.selectContact = this.selectContact.bind(this);
    }

    selectContact(contact){

        // console.log(contact_id);
        this.setState({selectedContact: contact});
    }

    render(){

        return (
            <Container>
                <Row>
                    <Col md={3}>
                        <MessageContact user={this.state.user} styles={this.props.styles} apiUrl={this.props.apiUrl} selectContact={this.selectContact}/>
                    </Col>
                    <Col md={9}>
                        <MessagePanel user={this.state.user} styles={this.props.styles} apiUrl={this.props.apiUrl} selectedContact={this.state.selectedContact}/>  
                    </Col>
                </Row>
            </Container>
        );
    }

}

export default Message;