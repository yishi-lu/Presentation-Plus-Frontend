import React, {Component} from 'react';
import socketIOClient from "socket.io-client";
import { Button, Container, Row, Col, Image } from 'react-bootstrap';
import axios from 'axios';

let socket;
class MessagePanel extends Component{

    constructor(props){
        super(props);

        this.state = {
            user: this.props.user,
            endpoint: "http://127.0.0.1:3001",
            selectedContact: this.props.selectedContact,
            message: "",

            allMessage: [],

            loaded_data: true,
        }

        this.changeMessage = this.changeMessage.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
    }

    componentDidUpdate(prevProps){

        if(this.props.selectedContact != prevProps.selectedContact){
            console.log(this.props.selectedContact);
            this.setState({
                selectedContact: this.props.selectedContact,
                allMessage: [],
            },

            ()=>{
                    const config = {
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    }
            
                    const data = {contact_id: this.state.selectedContact.contact_id}
            
                    
                    axios.post(this.props.apiUrl + '/api/message/fetchMessage', data, config)
                        .then(result => {
                            console.log(result.data.success);
            
                            this.setState({
                                allMessage: result.data.success,
                                loaded_data: true,
                            })
                        })
                        .catch(error => {
                            console.log("ERRRR:: ",error);
                            // window.location.href = '/';
                        }
                    );
                }
            )
        }

    }

    componentDidMount() {

        console.log(this.state.user);

        const { endpoint } = this.state;
        socket = socketIOClient(endpoint);

        let sessionId;
    
        // New socket connected
        socket.on('user connected', (data)=>{
            this.setState(preState=>{
                let user = preState.user;
                user.sessionId = data;
                return {user: user};
            })

            console.log(this.state.user);
            socket.emit('initialize user info', this.state.user);
        })

        //initialize user information
        socket.on('user initialized', (data)=>{
            console.log(data);
        })

        socket.on('receive message', (data)=>{
            console.log(data);

            if(data.sender_id == this.state.selectedContact.contact_id)
                this.setState(preState=>{

                    let allMessage = [...preState.allMessage];
        
                    allMessage.push(data);
        
                    return {allMessage: allMessage}
        
            })
        })
        
        socket.on('users disconnected', (data)=>{
            console.log('user disconnected: ' + sessionId);
            alert('user disconnected: ' + data)
        })
    }

    changeMessage(event){

        let value = event.target.value;

        this.setState({message: value});
    }

    sendMessage(event){

        event.preventDefault();

        let data = {};

        data.sender_id = this.state.user.id;
        data.receiver_id = this.state.selectedContact.contact_id;
        data.sender_name = this.state.user.name;
        data.content = this.state.message;
        data.type = 1;
        data.status = 0;
        data.updated_at = new Date().toISOString().slice(0, 19).replace('T', ' ');

        socket.emit('send message', data);

        socket.once('send message result', message=>{
            if(message == 'success'){
                data.status = 1;
            }

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                }
            }
    
            let content = {contact_id: data.receiver_id, message:data.content}
            
            axios.post(this.props.apiUrl + '/api/message/postMessage', content, config)
                .then(result => {
                    console.log(result.data.success);
                })
                .catch(error => {
                    console.log("ERRRR:: ",error);
                    // window.location.href = '/';
                }
            );
        })

        this.setState(preState=>{

            let allMessage = [...preState.allMessage];

            allMessage.push(data);
            console.log(data);

            return {allMessage: allMessage}

        })

        
    }

    render(){
        if(this.state.loaded_data){

            let messageContent = []
            
            if(this.state.allMessage.length > 0){

                this.state.allMessage.forEach((item, idx)=>{

                    messageContent.push(
                        <Row key={idx}>
                            {item.sender_id == this.state.user.id ? 
                                <div>{this.state.user.name}({item.updated_at}):</div> 
                                :
                                <div>{this.state.selectedContact.contact_name}({item.updated_at}):</div>}
                            <p className={this.props.styles.newline}></p>
                            <div>{item.content}</div>
                        </Row>
                    )

                })

            }

            return(
                <Container>
                    <Row>
                        <Container className={this.props.styles.messageBody}>
                            {messageContent}
                        </Container>
                    </Row>
                    <Row></Row>
                    <Row>
                        <Col sm md={10}>
                            <textarea  className={this.props.styles.messageInput} name="inputMessage" value={this.state.message} onChange={this.changeMessage}/>
                        </Col>
                        <Col sm md={2}>
                            {this.state.selectedContact === "" ? 
                                <Button variant="primary" type="submit" onClick={this.sendMessage} disabled>
                                    <i className="fas fa-paper-plane"></i>
                                </Button>
                                :
                                <Button variant="primary" type="submit" onClick={this.sendMessage}>
                                    <i className="fas fa-paper-plane"></i>
                                </Button>
                            }
                        </Col>
                    </Row>
                </Container>
    
            )
        }
        else {
            return(<div>In loading...</div>)
        }

        
    }
}

export default MessagePanel;