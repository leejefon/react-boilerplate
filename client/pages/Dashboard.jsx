import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Container, Button, Badge } from 'reactstrap';
import Footer from '../components/Footer';

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      email: '',
      emailVerified: false
    };
  }

  componentDidMount() {
    fetch('/api/user/me')
      .then((res) => res.json())
      .then((data) => {
        this.setState({
          name: data.name,
          email: data.email,
          emailVerified: data.emailVerified
        });
      });
  }

  logout() {
    fetch('/api/auth/logout')
      .then(() => {
        window.location.reload();
      });
  }

  reVerifyEmail() {
    fetch('/api/user/verifyEmail', {
      method: 'POST'
    })
      .then((res) => {
        if (res.status === 200) {
          window.alert('Email sent');
        } else {
          window.alert('Something wrong');
        }
      });
  }

  render() {
    const emailVerifiedBadge = this.state.emailVerified ? (
      <Badge color="success">Verified</Badge>
    ) : (
      <>
        <Badge color="danger">Not Verified</Badge>
        <Button color="link" onClick={() => this.reVerifyEmail()}>Verify Again</Button>
      </>
    );

    return (
      <>
        <Container>
          <h1 className="py-5">Hi, {this.state.name}</h1>
          <h4 className="py-5">Email: {this.state.email} {emailVerifiedBadge}</h4>
          <Button color="danger" size="lg" onClick={() => this.logout()}>Logout</Button>
        </Container>

        <Footer />
      </>
    );
  }
}

function mapStateToProps() {
  return {
  };
}

export default withRouter(connect(mapStateToProps)(Dashboard));
