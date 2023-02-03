import styles from "./CharMenu.module.css";
import React from "react";
import { Nav } from "react-bootstrap";
import ReactDOM from "react-dom";
import { useIsFetching } from "react-query";
import { LinkContainer } from "react-router-bootstrap";

const menuRoot = document.getElementById("nav-right");

const CharMenuRight = () => {
  const isLoading = useIsFetching();
  if (!menuRoot) {
    return <></>;
  }

  return ReactDOM.createPortal(
    <>
      {isLoading ? (
        <>
          <Nav.Link>
            <i className={`fas fa-sync-alt fa-fw ${styles.menuRefreshSpin}`} />
          </Nav.Link>
        </>
      ) : (
        <></>
      )}
      <Nav.Link href="/audit/char/add/" key="Add Character">
        Add Character
      </Nav.Link>
      <LinkContainer to={`account/list`}>
        <Nav.Link key="Account List">Account List</Nav.Link>
      </LinkContainer>
    </>,
    menuRoot
  );
};

export { CharMenuRight };
