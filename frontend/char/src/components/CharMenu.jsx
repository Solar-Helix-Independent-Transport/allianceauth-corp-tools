import { loadMenu } from "../apis/Character";
import "./Menu.css";
import { Grid } from "@agney/react-loading";
import React from "react";
import { Glyphicon, Nav, NavItem } from "react-bootstrap";
import { NavDropdown } from "react-bootstrap";
import { Navbar } from "react-bootstrap";
import { useQuery } from "react-query";
import { LinkContainer } from "react-router-bootstrap";
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
            to={`/audit/r_legacy/${characterID}/account/status`}
          >
            <NavItem key="Overview" to={`account/status`}>
              Overview
            </NavItem>
          </LinkContainer>
          <LinkContainer
            activeClassName={"active"}
            to={`/audit/r_legacy/${characterID}/account/pubdata`}
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
                  return cat.links ? (
                    <NavDropdown id={cat.name} title={cat.name} key={cat.name}>
                      {cat.links?.map((link) => {
                        return (
                          <LinkContainer
                            activeClassName={"active"}
                            to={`/audit/r_legacy/${characterID}/${link.link}`}
                          >
                            <NavItem to={`${link.link}`} id={link.name} key={link.name}>
                              {link.name}
                            </NavItem>
                          </LinkContainer>
                        );
                      })}
                    </NavDropdown>
                  ) : (
                    <>
                      {cat.link.startsWith("/") ? (
                        <NavItem id={cat.name} key={cat.name} href={cat.link}>
                          <>{cat.name}</>
                        </NavItem>
                      ) : (
                        <NavItem id={cat.name} key={cat.name}>
                          <LinkContainer to={`/audit/r_legacy/${characterID}/${cat.link}`}>
                            <>{cat.name}</>
                          </LinkContainer>
                        </NavItem>
                      )}
                    </>
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
                <NavItem key="Beta UI" href={`/audit/r`}>
                  Beta UI
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
