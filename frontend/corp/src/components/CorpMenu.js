import React from "react";
import { Nav } from "react-bootstrap";
import { Navbar } from "react-bootstrap";

import NavLink from "./NavLinkActive";
import "./Menu.css";
import CorpBadge from "./CorpBadge";

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
