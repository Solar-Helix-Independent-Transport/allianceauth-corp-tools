import styles from "./CharMenu.module.css";
import React from "react";
import { Glyphicon, Nav, NavItem } from "react-bootstrap";
import { NavDropdown } from "react-bootstrap";
import { Navbar } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

export interface CharMenuItemProps {
  name: string;
  link: string;
}

export interface CharCategoryProps {
  name: string;
  links: Array<CharMenuItemProps>;
}

export interface CharMenuProps extends Partial<HTMLElement> {
  isLoading: boolean;
  data: Array<CharCategoryProps>;
  error: boolean;
  characterID: string;
}

const CharMenu = ({ isLoading = false, error = false, data, characterID }: CharMenuProps) => {
  return (
    <Navbar fluid collapseOnSelect>
      <Navbar.Header>
        <Navbar.Toggle />
      </Navbar.Header>
      <Navbar.Collapse>
        <Nav>
          <LinkContainer to={`/audit/r/${characterID}/account/status`}>
            <NavItem key="Overview">Overview</NavItem>
          </LinkContainer>
          <LinkContainer to={`/audit/r/${characterID}/account/pubdata`}>
            <NavItem key="Public Data">Public Data</NavItem>
          </LinkContainer>

          {data &&
            data.map((cat: any) => {
              return (
                <NavDropdown id={cat.name} title={cat.name} key={cat.name}>
                  {cat.links.map((link: any) => {
                    return (
                      <LinkContainer to={`/audit/r/${characterID}/${link.link}`}>
                        <NavItem id={link.name} key={link.name}>
                          {link.name}
                        </NavItem>
                      </LinkContainer>
                    );
                  })}
                </NavDropdown>
              );
            })}
        </Nav>
        <Nav className="pull-right">
          <NavItem key="Legacy UI" href={`/audit/`}>
            Legacy UI
          </NavItem>
          <LinkContainer to={`account/list`}>
            <NavItem key="Account List">Account List</NavItem>
          </LinkContainer>

          {isLoading ? (
            <NavItem active={false}>
              <Glyphicon glyph={"refresh"} className={styles.menuRefreshSpin} />
            </NavItem>
          ) : error ? (
            <NavItem active={false}>
              <Glyphicon glyph={"ban-circle"} />
            </NavItem>
          ) : (
            <></>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default CharMenu;
