import styles from "./CharMenu.module.css";
import { Nav } from "react-bootstrap";
import ReactDOM from "react-dom";
import { useTranslation } from "react-i18next";
import { useIsFetching } from "@tanstack/react-query";
import { useParams } from "react-router";
import { MenuItem } from "../Menu/MenuParts";

const menuRoot = document.getElementById("nav-right");
// Clear the server-rendered placeholder content once, before React ever
// portals into it - this only needs to happen once per page load, not on
// every render, so it lives at module scope rather than in an effect.
menuRoot?.replaceChildren();

const CharMenuRight = () => {
  const { t } = useTranslation();
  const { characterID } = useParams();
  const toPath = (link: string) => `/audit/r/${characterID}/${link}`;

  const isLoading = useIsFetching();

  const menuListLink = {
    link: "account/list",
    name: t("Account List"),
  };

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
      <MenuItem link={menuListLink} {...{ toPath }} />
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
