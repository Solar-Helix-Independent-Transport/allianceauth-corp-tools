import CorpAddToken from "./CorpAddToken";
import styles from "./CorpMenu.module.css";
import { Nav } from "react-bootstrap";
import ReactDOM from "react-dom";
import { useTranslation } from "react-i18next";
import { useIsFetching } from "@tanstack/react-query";
import { MenuItem } from "../Menu/MenuParts";

const BASEURL = "/audit/r/corp/";
const toPath = (link: string) => `${BASEURL}${link}`;

const menuRoot = document.getElementById("nav-right");
// Clear the server-rendered placeholder content once, before React ever
// portals into it - this only needs to happen once per page load, not on
// every render, so it lives at module scope rather than in an effect.
menuRoot?.replaceChildren();

const CorpMenuRight = () => {
  const { t } = useTranslation();

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
      <CorpAddToken />
      <MenuItem
        link={{
          link: `corporations`,
          name: t("Corporations"),
        }}
        {...{ toPath }}
      />
      {/* <Nav.Link as={Link} to={`audit/r/0`} key="corporation_list">
        <i className="fa-solid fa-users"></i>
      </Nav.Link> */}
    </>,
    menuRoot,
  );
};

export { CorpMenuRight };
