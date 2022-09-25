import PropTypes from "prop-types";
import React from "react";
import { useEffect } from "react";
import { NavItem } from "react-bootstrap";
import { useLocation } from "react-router-dom";

const NavLink = (props) => {
  const location = useLocation();

  useEffect(() => {}, [location]);

  var isActive = window.location.href.endsWith(props.href);
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
