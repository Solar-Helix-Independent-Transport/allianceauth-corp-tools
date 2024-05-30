import CorpBadge from "./CorpBadge";
import "./Menu.css";
import NavLink from "./NavLinkActive";
import React from "react";
import { Nav, NavDropdown } from "react-bootstrap";
import { Navbar } from "react-bootstrap";

const CorpMenu = () => {
  return (
    <Navbar fluid collapseOnSelect>
      <Navbar.Header>
        <Navbar.Brand>Corporation Audit</Navbar.Brand>
        <Navbar.Toggle />
      </Navbar.Header>
      <Navbar.Collapse>
        <Nav>
          <NavLink key="Structures" href={`#/structures`}>
            Structures
          </NavLink>
          <NavLink key="Wallets" href={`#/wallets`}>
            Wallets
          </NavLink>
          <NavLink key="Assetgroups" href={`#/assetgroup`}>
            Asset Overview
          </NavLink>
          <NavLink key="assetlists" href={`#/assetlist`}>
            Asset List
          </NavLink>
          <NavLink key="Pocos" href={`#/pocos`}>
            Pocos
          </NavLink>
          <NavDropdown title="Dashboards">
            <NavLink key="bridges" href={`#/bridges`}>
              Bridges
            </NavLink>
            <NavLink key="sov" href={`#/sov`}>
              Sov Upgrades
            </NavLink>
          </NavDropdown>
        </Nav>

        <Nav className="pull-right">
          <CorpBadge />
          <NavLink key="Status" href={`#/status`}>
            Corporations
          </NavLink>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default CorpMenu;
