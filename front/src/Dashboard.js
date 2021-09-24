import React, { useEffect, useState } from "react";
import ChartistGraph from "react-chartist";

import { IconContext } from "react-icons";
import { FaDollarSign, FaTwitter } from "react-icons/fa";
import { BsArrowClockwise } from "react-icons/bs";

// react-bootstrap components
import { Card, Container, Row, Col } from "react-bootstrap";

function Dashboard(props) {
  const capitalize = (s) => {
    return s && s[0].toUpperCase() + s.slice(1);
  };

  return (
    <Container style={{ marginTop: "10px" }} fluid>
      <Row style={{ marginBottom: "20px" }}>
        <Col></Col>
        <Col>
          <h2 style={{ color: "grey" }}>
            {capitalize(props.coin)} ({props.symbol})
          </h2>
        </Col>
        <Col></Col>
      </Row>
      <Row>
        <Col lg="3" sm="6">
          <Card className="card-stats">
            <Card.Body>
              <Row>
                <Col xs="5">
                  <IconContext.Provider
                    value={{ marginBottom: "5px", color: "86CA16" }}
                  >
                    <div className="icon-big text-center icon-warning">
                      <FaDollarSign />
                    </div>
                  </IconContext.Provider>
                </Col>
                <Col xs="7">
                  <div className="numbers">
                    <p className="card-category">Preço</p>
                    <Card.Title as="h4">{props.price}</Card.Title>
                  </div>
                </Col>
              </Row>
            </Card.Body>
            <Card.Footer>
              <hr></hr>
              <div className="stats">Preço do ativo no momento</div>
            </Card.Footer>
          </Card>
        </Col>
        <Col lg="3" sm="6">
          <Card className="card-stats">
            <Card.Body>
              <Row>
                <Col xs="5">
                  <IconContext.Provider value={{ color: "F94854" }}>
                    <div className="icon-big text-center icon-warning">
                      <BsArrowClockwise />
                    </div>
                  </IconContext.Provider>
                </Col>
                <Col xs="7">
                  <div className="numbers">
                    <p className="card-category">Capitalização de Mercado</p>
                    <Card.Title as="h4">{props.marketCap}</Card.Title>
                  </div>
                </Col>
              </Row>
            </Card.Body>
            <Card.Footer>
              <hr></hr>
              <div className="stats">Total de valor em circulação</div>
            </Card.Footer>
          </Card>
        </Col>
        <Col lg="3" sm="6">
          <Card className="card-stats">
            <Card.Body>
              <Row>
                <Col xs="5">
                  <IconContext.Provider value={{ color: "FF973B" }}>
                    <div className="icon-big text-center icon-warning">
                      {props.emoji}
                      {/* {<BiSad /> ? (
                        majorSentiment == "Neutro"
                      ) : <FaSadTear /> ? (
                        majorSentiment == "Pessimista"
                      ) : (
                        <FaSmileBeam />
                      )} */}
                      {/* <BiSad />
                    <FaSadTear /> */}
                      {/* <FaSmileBeam /> */}
                    </div>
                  </IconContext.Provider>
                </Col>
                <Col xs="7">
                  <div className="numbers">
                    <p className="card-category">Sentimento</p>
                    <Card.Title as="h4">{props.majorSentiment}</Card.Title>
                  </div>
                </Col>
              </Row>
            </Card.Body>
            <Card.Footer>
              <hr></hr>
              <div className="stats">Sentimento quanto a moeda</div>
            </Card.Footer>
          </Card>
        </Col>
        <Col lg="3" sm="6">
          <Card className="card-stats">
            <Card.Body>
              <Row>
                <Col xs="5">
                  <IconContext.Provider value={{ color: "2570F1" }}>
                    <div className="icon-big text-center icon-warning">
                      <FaTwitter />
                    </div>
                  </IconContext.Provider>
                </Col>
                <Col xs="7">
                  <div className="numbers">
                    <p className="card-category">Tweets</p>
                    <Card.Title as="h4">{props.tweets}</Card.Title>
                  </div>
                </Col>
              </Row>
            </Card.Body>
            <Card.Footer>
              <hr></hr>
              <div className="stats">Tweets para analisar os sentimentos</div>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col md="8">
          <Card>
            <Card.Header>
              <Card.Title as="h4">Pesquisas no Google</Card.Title>
              <p className="card-category">3 meses</p>
            </Card.Header>
            <Card.Body>
              <div className="ct-chart" id="chartHours">
                <ChartistGraph
                  data={{
                    labels: props.chartDates,
                    series: [props.charValues],
                  }}
                  type="Line"
                  options={{
                    low: 0,
                    high: Math.max.apply(null, props.charValues) + 10,
                    showArea: false,
                    height: "245px",
                    axisX: {
                      showGrid: false,
                    },
                    lineSmooth: true,
                    showLine: true,
                    showPoint: true,
                    fullWidth: true,
                    chartPadding: {
                      right: 50,
                    },
                  }}
                  responsiveOptions={[
                    [
                      "screen and (max-width: 640px)",
                      {
                        axisX: {
                          labelInterpolationFnc: function (value) {
                            return value[0];
                          },
                        },
                      },
                    ],
                  ]}
                />
              </div>
            </Card.Body>
            <Card.Footer>
              <div className="legend">
                <i className="fas fa-circle text-info"></i>
                Pesquisas
              </div>
              <hr></hr>
              <div className="stats">
                O interesse sobre a criptomoeda ao longo do tempo de acordo com
                pesquisas no google
              </div>
            </Card.Footer>
          </Card>
        </Col>
        <Col md="4">
          <Card>
            <Card.Header>
              <Card.Title as="h4">Sentimentos</Card.Title>
              <p className="card-category">Porcentagem para cada sentimento</p>
            </Card.Header>
            <Card.Body>
              <div className="ct-chart ct-perfect-fourth" id="chartPreferences">
                <ChartistGraph
                  data={{
                    labels: [
                      `${props.sentiments[0]}%`,
                      `${props.sentiments[1]}%`,
                      `${props.sentiments[2]}%`,
                    ],
                    series: props.sentiments,
                  }}
                  type="Pie"
                />
              </div>
              <div className="legend">
                <i className="fas fa-circle text-info"></i>
                Negativos <i className="fas fa-circle text-danger"></i>
                Neutros <i className="fas fa-circle text-warning"></i>
                Positivos
              </div>
              <hr></hr>
              <div className="stats">Polaridade</div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Dashboard;
