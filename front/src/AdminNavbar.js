/*!

=========================================================
* Light Bootstrap Dashboard React - v2.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/light-bootstrap-dashboard-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/light-bootstrap-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, { useState } from "react";
import {
  Navbar,
  Container,
  Button,
  InputGroup,
  FormControl,
  Col,
} from "react-bootstrap";

function Header(props) {
  const [input, setInput] = useState("");

  const handleClick = (e) => {
    props.onChange(input);
  };

  const handleChange = (e) => {
    setInput(e.target.value);
  };

  return (
    <Navbar bg="light" expand="lg">
      <Container fluid>
        <Col lg="3"></Col>
        <Col>
          <InputGroup>
            <FormControl
              style={{ marginTop: "16px" }}
              placeholder="Search"
              onChange={handleChange}
            />
            <Button
              style={{ marginLeft: "10px" }}
              variant="primary"
              onClick={handleClick}
            >
              Search
            </Button>
          </InputGroup>
        </Col>
        <Col lg="3"></Col>
      </Container>
    </Navbar>
  );
}

export default Header;
