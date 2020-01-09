import React, {Component} from 'react';
import { Button, Form, Container, Row, Col } from 'react-bootstrap';

import axios from 'axios';

class Register extends Component{

    constructor(props){
        super(props);

        this.state = {
            email: "",
            username: "",
            password: "",
            confirm_password: "",
            registerError:{
                email: "",
                name: "",
                password: "",
                comfirmed_password: "",
            },
        }

        this.registerUser = this.registerUser.bind(this)
        this.changeInput = this.changeInput.bind(this)
    }

    registerUser(event){
        event.preventDefault();
  
        const credentials = {email: this.state.email, name: this.state.username, password: this.state.password, comfirmed_password: this.state.confirm_password};
        const config = {
            headers: {
                'Content-Type': 'application/json',
            }
        }
    
        console.log(credentials);

        axios.post('http://www.presentation-plus.com/api/auth/register', credentials, config)
           .then(result => {
             console.log(result);
  
             this.setState({
                registerError:{
                    email: "",
                    name: "",
                    password: "",
                    comfirmed_password: "",
                },
            });

            localStorage.setItem("user", JSON.stringify(result.data.user));

            console.log(this.state);

            window.location.assign("/");
  
           })
           .catch(error => {
            console.log("ERRRR:: ",error.response.data.errors);
            this.setState({
                registerError: error.response.data.errors,
            })

            console.log(this.state);
          }
      );
    }

    changeInput(event){
        const {name, value} = event.target;
  
        this.setState({[name]: value});
  
    }

    render() {
        return (
          <Container>
            <Row className="justify-content-md-center">
              <Col sm md={6}>
                <Form>
                  <div>
                    <h2>Register New Account</h2>
                  </div>
                  <br></br>
                  <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" name="email" onChange={this.changeInput}/>
                  </Form.Group>
                  {this.state.registerError.email != "" ? <div className={this.props.styles.error_message + ' mt-2 mb-3'} >{this.state.registerError.email}</div> : ""}

                  <Form.Group controlId="formUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control placeholder="Enter username" name="username" onChange={this.changeInput}/>
                  </Form.Group>
                  {this.state.registerError.name != "" ? <div className={this.props.styles.error_message + ' mt-2 mb-3'} >{this.state.registerError.name}</div> : ""}

                  <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" name="password" onChange={this.changeInput}/>
                  </Form.Group>
                  {this.state.registerError.password != "" ? <div className={this.props.styles.error_message + ' mt-2 mb-3'} >{this.state.registerError.password}</div> : ""}

                  <Form.Group controlId="formBasicPasswordConfirm">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control type="password" placeholder="Confirm Password" name="confirm_password" onChange={this.changeInput}/>
                  </Form.Group>
                  {this.state.registerError.comfirmed_password != "" ? <div className={this.props.styles.error_message + ' mt-2 mb-3'} >{this.state.registerError.comfirmed_password}</div> : ""}

                  <Button variant="primary" type="submit" onClick={this.registerUser}>
                    Register
                  </Button>

                  <div>
                    <label>Has account? </label>
                    <a href='login' >Login</a>
                  </div>
                </Form>
              </Col>
            </Row>
          </Container>
        );
      }
}

export default Register;