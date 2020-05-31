import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import { Container, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import Footer from '../components/Footer';

class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      email: '',
      password: '',
      redirect: false
    };
  }

  handleChange(name, value) {
    this.setState({ [name]: value });
  }

  register() {
    fetch('/api/user/register', {
      method: 'POST',
      body: JSON.stringify(this.state), // Don't really need redirect for this, but don't care for now
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((res) => res.json())
      .then(() => {
        this.setState({ redirect: true });
      });
  }

  render() {
    const form = (
      <>
        <Container className="w-25 pt-5 text-center">
          <h2>Register</h2>

          <Form>
            <FormGroup>
              <Label for="name" hidden>Name</Label>
              <Input
                autoFocus
                id="name"
                bsSize="lg"
                value={this.state.name}
                placeholder="Name"
                onChange={(e) => this.handleChange('name', e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <Label for="email" hidden>Email</Label>
              <Input
                id="email"
                bsSize="lg"
                value={this.state.email}
                placeholder="Email"
                onChange={(e) => this.handleChange('email', e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <Label for="password" hidden>Password</Label>
              <Input
                type="password"
                id="password"
                bsSize="lg"
                value={this.state.password}
                placeholder="Password"
                onChange={(e) => this.handleChange('password', e.target.value)}
                onKeyPress={(e) => (e.key === 'Enter' ? this.login() : null)}
              />
            </FormGroup>

            <Button
              color="success"
              size="lg"
              onClick={() => this.register()}
            >
              Register
            </Button>

            <br />

            <div className="mt-3">
              <Link to="/login">Back to Login</Link>
            </div>
          </Form>
        </Container>

        <Footer />
      </>
    );

    const redirect = (<Redirect to="/" />);

    if (this.state.redirect) return redirect;
    return form;
  }
}

function mapStateToProps() {
  return {
  };
}

export default connect(mapStateToProps)(Register);
