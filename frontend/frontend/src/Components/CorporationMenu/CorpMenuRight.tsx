import CorpAddToken from "./CorpAddToken";
import styles from "./CorpMenu.module.css";
import React from "react";
import { Nav } from "react-bootstrap";
import ReactDOM from "react-dom";
import { useTranslation } from "react-i18next";
import { useIsFetching } from "react-query";
import { Link } from "react-router-dom";

const menuRoot = document.getElementById("nav-right");

const CorpMenuRight = () => {
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
      <CorpAddToken />
      <Nav.Link as={Link} to={`corporations`} key="corporation_list">
        {t("Corporations")}
      </Nav.Link>
      <Nav.Link as={Link} to={`audit/r/0`} key="corporation_list">
        <i className="fa-solid fa-users"></i>
      </Nav.Link>
    </>,
    menuRoot,
  );
};

export { CorpMenuRight };
