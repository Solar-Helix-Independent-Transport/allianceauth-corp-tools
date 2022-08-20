import React from "react";
import { useQuery } from "react-query";
import { Nav, Glyphicon } from "react-bootstrap";
import { NavDropdown } from "react-bootstrap";
import { Navbar } from "react-bootstrap";
import { NavItem } from "react-bootstrap";

import NavLink from "./NavLinkActive";
import { Grid } from "@agney/react-loading";
import { loadMenu } from "../apis/Character";
import "./Menu.css";

const CharMenu = () => {
  const { isLoading, error, data } = useQuery(["Menu"], () => loadMenu());

  return (
    <Navbar fluid collapseOnSelect>
      <Navbar.Header>
        <Navbar.Toggle />
      </Navbar.Header>
      <Navbar.Collapse>
        <Nav>
          <NavLink key="Overview" href={`#/account/status`}>
            Overview
          </NavLink>
          <NavLink key="Public Data" href={`#/account/pubdata`}>
            Public Data
          </NavLink>

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
                          <NavLink
                            id={link.name}
                            key={link.name}
                            href={`#${link.link}`}
                          >
                            {link.name}
                          </NavLink>
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
                <NavLink key="Account List" href={`#/account/list`}>
                  Account List
                </NavLink>
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
