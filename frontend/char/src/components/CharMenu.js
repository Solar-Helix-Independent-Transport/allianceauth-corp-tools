import React, { useState, useEffect } from "react";
import { Nav } from "react-bootstrap";
import { NavDropdown } from "react-bootstrap";
import { Navbar } from "react-bootstrap";
import NavLink from "./NavLinkActive";
import axios from "axios";

const CharMenu = ({ character_id }) => {
  const [menus, setState] = useState({
    cats: [],
  });

  useEffect(() => {
    axios.get(`/audit/api/account/menu`).then((res) => {
      const cats = res.data;
      setState({ cats });
    });
  }, []);

  return (
    <Navbar fluid collapseOnSelect>
      <Nav>
        <NavLink key="Overview" href={`#/account/status`}>
          Overview
        </NavLink>
        <NavLink key="Public Data" href={`#/account/pubdata`}>
          Public Data
        </NavLink>
        {menus.cats.map((cat) => {
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
      </Nav>
      <Nav className="pull-right">
        <NavLink key="Public Data" href={`#/account/list`}>
          Account List
        </NavLink>
      </Nav>
    </Navbar>
  );
};

export default CharMenu;
