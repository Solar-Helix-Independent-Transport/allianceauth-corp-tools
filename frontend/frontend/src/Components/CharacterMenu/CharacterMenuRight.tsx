import styles from "./CharMenu.module.css";
import React from "react";
import { Nav } from "react-bootstrap";
import ReactDOM from "react-dom";
import { useIsFetching } from "react-query";
import { LinkContainer } from "react-router-bootstrap";

const menuRoot = document.getElementById("nav-right");

const CharMenuRight = () => {
  const isLoading = useIsFetching();
  const [innerHtmlEmptied, setInnerHtmlEmptied] = React.useState(false);

  React.useEffect(() => {
    if (!innerHtmlEmptied) {
      if (menuRoot) {
        menuRoot.innerHTML = "";
        setInnerHtmlEmptied(true);
      }
    }
  }, [innerHtmlEmptied]);

  if (!innerHtmlEmptied) return null;
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
      {/* TODO Check perms for this */}
      <LinkContainer to={`/audit/r_beta/corp`}>
        <Nav.Link key="corp-swap">
          <i className="fa-regular fa-building"></i>
        </Nav.Link>
      </LinkContainer>
    </>,
    menuRoot
  );
};

export { CharMenuRight };
