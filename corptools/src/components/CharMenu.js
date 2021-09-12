import React, { useState, useEffect } from "react";
import { Nav, NavItem } from "react-bootstrap";
import { NavDropdown } from "react-bootstrap";
import { Navbar } from "react-bootstrap";
import axios from "axios";
import { Link } from "react-router-dom";

const CharMenu = () => {
  const [menus, setState] = useState({
    cats: [],
  });

  useEffect(() => {
    axios.get(`/audit/api/characters/menu`).then((res) => {
      const cats = res.data;
      setState({ cats });
    });
  }, []);

  return (
    <Navbar fluid collapseOnSelect>
      <Nav>
        <NavItem href={`#/character/status`}>Overview</NavItem>
        <NavItem href={`#/character/pubdata`}>Public Data</NavItem>
        {menus.cats.map((cat) => {
          return (
            <NavDropdown title={cat.name} key={cat.name}>
              {cat.links.map((link) => {
                return <NavItem href={`#${link.link}`}>{link.name}</NavItem>;
              })}
            </NavDropdown>
          );
        })}
      </Nav>
    </Navbar>
  );
};

export default CharMenu;
