import React from "react";
import { useQuery } from "react-query";
import { Nav, Glyphicon } from "react-bootstrap";
import { NavDropdown } from "react-bootstrap";
import { Navbar } from "react-bootstrap";
import { NavItem } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import NavLink from "./NavLinkActive";
import { Grid } from "@agney/react-loading";
import { loadMenu } from "../apis/Character";
import "./Menu.css";

const CharMenu = () => {
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
          <LinkContainer to={`account/status`}>
            <NavLink key="Overview">Overview</NavLink>
          </LinkContainer>
          <LinkContainer to={`account/pubdata`}>
            <NavLink key="Public Data">Public Data</NavLink>
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
                          <LinkContainer to={`${link.link}`}>
                            <NavLink id={link.name} key={link.name}>
                              {link.name}
                            </NavLink>
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
                <NavLink key="Legacy UI" href={`/audit/`}>
                  Legacy UI
                </NavLink>
                <LinkContainer to={`account/list`}>
                  <NavLink key="Account List">Account List</NavLink>
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
