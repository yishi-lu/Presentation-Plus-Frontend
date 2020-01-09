import React, {Component} from 'react';
import { Button, Form, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';

class Login extends Component{

    constructor(props){
        super(props);

        this.state = {
          email: "",
          password: "",
          loginError: "",
        }
        
        this.loginUser = this.loginUser.bind(this);
        this.changeInput = this.changeInput.bind(this)

        console.log(this.props);
    }

    loginUser(event) {
      event.preventDefault();
  
      const credentials = {email: this.state.email, password: this.state.password};
      const config = {
        headers: {
            'Content-Type': 'application/json',
        }
      }
  
      console.log(credentials);
  
      axios.post('http://www.presentation-plus.com/api/auth/login', credentials, config)
           .then(result => {
             console.log(result);
  
             this.setState({
              loginError: "",
            });

            localStorage.setItem("user", JSON.stringify(result.data.user));

            console.log(this.state);

            window.location.assign("/");
  
           })
           .catch(error => {
            console.log("ERRRR:: ",error.response.data);
            this.setState({
              loginError: error.response.data.message,
            })
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
                    <h2>Sing In</h2>
                  </div>
                  <br></br>
                  <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" name="email" onChange={this.changeInput}/>
                    <Form.Text className="text-muted">
                      We'll never share your email with anyone else.
                    </Form.Text>
                  </Form.Group>

                  <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" name="password" onChange={this.changeInput}/>
                  </Form.Group>

                {this.state.loginError != "" ? <div className={this.props.styles.error_message + ' mt-2 mb-3'} >{this.state.loginError}</div> : ""}

                  {/* <Form.Group controlId="formBasicCheckbox">
                    <Form.Check type="checkbox" label="Check me out" />
                  </Form.Group> */}

                  <Button variant="primary" type="submit" onClick={this.loginUser}>
                    Submit
                  </Button>
                  <div>
                    <label>No account? </label>
                    <a href='register' >Signup</a>
                  </div>
                </Form>
              </Col>
            </Row>
          </Container>
        );
      }
}

export default Login;