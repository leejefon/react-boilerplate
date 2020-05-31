import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Container } from 'reactstrap';
import Footer from '../components/Footer';

class VerifyEmail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      message: ''
    };
  }

  componentDidMount() {
    const queryParams = new URLSearchParams(this.props.location.search);
    const token = queryParams.get('token');

    fetch(`/api/user/verifyEmail/${token}`, {
      method: 'POST'
    })
      .then((res) => res.json())
      .then((res) => {
        this.setState(res);
      });
  }

  render() {
    return (
      <>
        <Container className="w-25 pt-5 text-center">
          <h5>{this.state.message}</h5>
          <br />
          <Link to="/">Back to Home</Link>
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

export default connect(mapStateToProps)(VerifyEmail);
