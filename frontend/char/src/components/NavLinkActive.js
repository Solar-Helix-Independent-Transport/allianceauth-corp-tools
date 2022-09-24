import React from "react";
import { useEffect } from "react";
import { NavItem } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";

const NavLink = (props) => {
  const location = useLocation();

  useEffect(() => {}, [location]);
  let url = props.href ? props.href : "";
  var isActive = window.location.href.endsWith(url);
  var className = isActive ? "active" : "";

  return (
    <NavItem className={className} {...props}>
      {props.children}
    </NavItem>
  );
};

NavLink.contextTypes = {
  router: PropTypes.object,
};

export default NavLink;
