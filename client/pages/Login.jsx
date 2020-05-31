import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import { Container, Form, FormGroup, Label, Input, Button, Spinner } from 'reactstrap';
import Footer from '../components/Footer';

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      redirect: null
    };
  }

  componentDidMount() {
    fetch('/api/user/me')
      .then((res) => {
        if (res.status === 200) {
          this.props.dispatch({
            type: 'SET_LOGGED_IN',
            data: true
          });
          this.setState({ redirect: true });
        } else {
          this.setState({ redirect: false });
        }
      });
  }

  handleChange(name, value) {
    this.setState({ [name]: value });
  }

  login() {
    fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(this.state), // Don't really need redirect for this, but don't care for now
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((res) => {
        if (res.status === 200) {
          this.props.dispatch({
            type: 'SET_LOGGED_IN',
            data: true
          });
          this.setState({ redirect: true });
        } else {
          window.alert('Invalid email/password');
        }
      });
  }

  loginWithLinkedIn() {
    window.location.href = '/auth/linkedin';
  }

  render() {
    const form = (
      <>
        <Container className="w-25 pt-5 text-center">
          <h2>Login</h2>

          <Form>
            <FormGroup>
              <Label for="email" hidden>Email</Label>
              <Input
                autoFocus
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
              onClick={() => this.login()}
            >
              Login
            </Button>
            &nbsp;&nbsp;
            <Button
              color="info"
              size="lg"
              onClick={() => this.loginWithLinkedIn()}
            >
              <i className="fab fa-linkedin" /> Login with LinkedIn
            </Button>

            <br />

            <div className="mt-3">
              <Link to="/resetPassword">Reset Password</Link>
              &nbsp; or &nbsp;
              <Link to="/register">Register</Link>
            </div>
          </Form>
        </Container>

        <Footer />
      </>
    );

    const loading = (
      <>
        <Container className="w-25 pt-5 text-center">
          <Spinner />
        </Container>
      </>
    );

    const redirect = (<Redirect to={this.props.urlBeforeLogin} />);

    if (this.state.redirect) return redirect;
    if (this.state.redirect === false) return form;
    return loading;
  }
}

function mapStateToProps(props) {
  return {
    urlBeforeLogin: props.get('ui').get('urlBeforeLogin')
  };
}

export default connect(mapStateToProps)(Login);
