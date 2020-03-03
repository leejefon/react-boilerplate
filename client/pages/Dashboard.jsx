import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Container } from 'reactstrap';
import Footer from '../components/Footer';

class Dashboard extends Component {
  render() {
    return (
      <>
        <Container>
          <h1 className="pt-5">Hi, Jeff</h1>
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
