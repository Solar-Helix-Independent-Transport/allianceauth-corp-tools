import styles from "./CharMenu.module.css";
import React from "react";
import { Nav } from "react-bootstrap";
import ReactDOM from "react-dom";
import { useTranslation } from "react-i18next";
import { useIsFetching } from "react-query";
import { Link } from "react-router-dom";

const menuRoot = document.getElementById("nav-right");

const CharMenuRight = () => {
  const { t } = useTranslation();

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
      <Nav.Item as="li">
        <Nav.Link href="/audit/char/add/" key="Add Character">
          {t("Add Character")}
        </Nav.Link>
      </Nav.Item>
      <Nav.Item as="li">
        <Nav.Link as={Link} to={`account/list`} key="Account List">
          {t("Account List")}
        </Nav.Link>
      </Nav.Item>
      {/* TODO Check perms for this */}
      {/* <Nav.Item as="li">
        <Nav.Link as={Link} to={`/audit/r_beta/corp`} key="corp-swap">
          <i className="fa-regular fa-building"></i>
        </Nav.Link>
      </Nav.Item> */}
    </>,
    menuRoot,
  );
};

export { CharMenuRight };
