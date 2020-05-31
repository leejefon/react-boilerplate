import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect, Link, withRouter } from 'react-router-dom';
import { Container, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import Footer from '../components/Footer';

class ResetPassword extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      passwordAgain: '',
      redirect: false
    };
  }

  componentDidMount() {

  }

  handleChange(name, value) {
    this.setState({ [name]: value });
  }

  resetPasswordRequest() {
    fetch('/api/user/resetPassword', {
      method: 'POST',
      body: JSON.stringify({
        email: this.state.email
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((res) => res.json())
      .then(() => {
        this.setState({ redirect: true });
      });
  }

  resetPassword() {
    if (this.state.password !== this.state.passwordAgain) {
      window.alert('Password does not match');
      return;
    }

    const queryParams = new URLSearchParams(this.props.location.search);
    const token = queryParams.get('token');

    fetch(`/api/user/resetPassword/${token}`, {
      method: 'POST',
      body: JSON.stringify({
        password: this.state.password
      }),
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
    const requestForm = (
      <>
        <Container className="w-25 pt-5 text-center">
          <h2>Reset Password</h2>

          <Form>
            <FormGroup>
              <Label for="email" hidden>Email</Label>
              <Input
                id="email"
                bsSize="lg"
                value={this.state.email}
                placeholder="Email"
                onChange={(e) => this.handleChange('email', e.target.value)}
                onKeyPress={(e) => (e.key === 'Enter' ? this.resetPasswordRequest() : null)}
              />
            </FormGroup>

            <Button
              color="success"
              size="lg"
              onClick={() => this.resetPasswordRequest()}
            >
              Send Email
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

    const resetForm = (
      <>
        <Container className="w-25 pt-5 text-center">
          <h2>Reset Password</h2>

          <Form>
            <FormGroup>
              <Label for="password" hidden>New Password</Label>
              <Input
                type="password"
                id="password"
                bsSize="lg"
                value={this.state.password}
                placeholder="New Password"
                onChange={(e) => this.handleChange('password', e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <Label for="passwordAgain" hidden>Password Again</Label>
              <Input
                type="password"
                id="passwordAgain"
                bsSize="lg"
                value={this.state.passwordAgain}
                placeholder="Enter New Password Again"
                onChange={(e) => this.handleChange('passwordAgain', e.target.value)}
                onKeyPress={(e) => (e.key === 'Enter' ? this.resetPassword() : null)}
              />
            </FormGroup>

            <Button
              color="success"
              size="lg"
              onClick={() => this.resetPassword()}
            >
              Reset Password
            </Button>
          </Form>
        </Container>

        <Footer />
      </>
    );

    const redirect = (<Redirect to="/" />);
    if (this.state.redirect) return redirect;

    const queryParams = new URLSearchParams(this.props.location.search);
    const token = queryParams.get('token');
    if (token) return resetForm;
    return requestForm;
  }
}

function mapStateToProps() {
  return {
  };
}

export default withRouter(connect(mapStateToProps)(ResetPassword));
