import React from "react";
import { useQuery } from "react-query";
import { Nav, Glyphicon, NavItem } from "react-bootstrap";
import { NavDropdown } from "react-bootstrap";
import { Navbar } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { Grid } from "@agney/react-loading";
import { loadMenu } from "../apis/Character";
import "./Menu.css";
import { useParams } from "react-router-dom";

const CharMenu = () => {
  let { characterID } = useParams();

  const { isLoading, error, data } = useQuery(["Menu"], () => loadMenu(), {
    refetchOnWindowFocus: false,
  });

  return (
    <Navbar fluid collapseOnSelect>
      <Navbar.Header>
        <Navbar.Toggle />
      </Navbar.Header>
      <Navbar.Collapse>
        <Nav>
          <LinkContainer
            activeClassName={"active"}
            to={`/audit/r/${characterID}/account/status`}
          >
            <NavItem key="Overview" to={`account/status`}>
              Overview
            </NavItem>
          </LinkContainer>
          <LinkContainer
            activeClassName={"active"}
            to={`/audit/r/${characterID}/account/pubdata`}
          >
            <NavItem key="Public Data" to={`account/status`}>
              Public Data
            </NavItem>
          </LinkContainer>

          {!error ? (
            isLoading ? (
              <></>
            ) : (
              <>
                {data.map((cat) => {
                  return (
                    <NavDropdown id={cat.name} title={cat.name} key={cat.name}>
                      {cat.links.map((link) => {
                        return (
                          <LinkContainer
                            activeClassName={"active"}
                            to={`/audit/r/${characterID}/${link.link}`}
                          >
                            <NavItem
                              to={`${link.link}`}
                              id={link.name}
                              key={link.name}
                            >
                              {link.name}
                            </NavItem>
                          </LinkContainer>
                        );
                      })}
                    </NavDropdown>
                  );
                })}
              </>
            )
          ) : (
            <></>
          )}
        </Nav>
        <Nav className="pull-right">
          {!error ? (
            isLoading ? (
              <>
                <Grid className="menu-spinner-size" />
              </>
            ) : (
              <>
                <NavItem key="Legacy UI" href={`/audit/`}>
                  Legacy UI
                </NavItem>
                <LinkContainer to={`account/list`}>
                  <NavItem key="Account List">Account List</NavItem>
                </LinkContainer>
              </>
            )
          ) : (
            <NavItem active={false}>
              <Glyphicon glyph={"ban-circle"} />
            </NavItem>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default CharMenu;
