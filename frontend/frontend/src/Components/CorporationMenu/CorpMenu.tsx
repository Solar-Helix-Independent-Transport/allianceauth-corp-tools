import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export interface MenuItemProps {
  name: string;
  link: string;
}

export interface CategoryProps {
  name: string;
  links: Array<MenuItemProps>;
}

export interface CorpMenuProps extends Partial<HTMLElement> {
  isLoading?: boolean;
  data?: Array<CategoryProps> | null;
  error?: boolean;
}

const CorpMenu = (props: CorpMenuProps) => {
  const { t } = useTranslation();

  console.log(props);
  return (
    <>
      <Nav.Item as={"li"}>
        <Nav.Link as={Link} to={`/audit/r_beta/corp/glance`} key="Glance">
          {t("Overview")}
        </Nav.Link>
      </Nav.Item>
      <NavDropdown as={"li"} title="Structures">
        <Nav.Item as={"li"}>
          <NavDropdown.Item as={Link} to={`/audit/r_beta/corp/structures`} key="Structures">
            {t("Structures")}
          </NavDropdown.Item>
        </Nav.Item>
        <Nav.Item as={"li"}>
          <NavDropdown.Item as={Link} to={`/audit/r_beta/corp/bridges`} key="bridges">
            {t("Bridges")}
          </NavDropdown.Item>
        </Nav.Item>
        <Nav.Item as={"li"}>
          <NavDropdown.Item as={Link} to={`/audit/corp/dashboard/fuel`} key="fuel">
            {t("Fuel")}
          </NavDropdown.Item>
        </Nav.Item>
        <Nav.Item as={"li"}>
          <NavDropdown.Item as={Link} to={`/audit/corp/dashboard/metenox`} key="metenox">
            {t("Metenox")}
          </NavDropdown.Item>
        </Nav.Item>
        <Nav.Item as={"li"}>
          <NavDropdown.Item as={Link} to={`/audit/r_beta/corp/pocos`} key="pocos">
            {t("Pocos")}
          </NavDropdown.Item>
        </Nav.Item>
        {/* <Nav.Item as={"li"}>
          <NavDropdown.Item as={Link} to={`/audit/r_beta/corp/pos`} key="pocos">
            {t("POSs")}
          </NavDropdown.Item>
        </Nav.Item> */}
      </NavDropdown>
      <Nav.Item as={"li"}>
        <Nav.Link as={Link} to={`/audit/r_beta/corp/wallets`} key="Wallets">
          {t("Wallets")}
        </Nav.Link>
      </Nav.Item>
      <NavDropdown as={"li"} title="Assets">
        <Nav.Item as={"li"}>
          <NavDropdown.Item as={Link} to={`/audit/r_beta/corp/assetgroup`} key="assetgroup">
            {t("Asset Overview")}
          </NavDropdown.Item>
        </Nav.Item>
        <Nav.Item as={"li"}>
          <NavDropdown.Item as={Link} to={`/audit/r_beta/corp/assetlist`} key="assetlist">
            {t("Asset List")}
          </NavDropdown.Item>
        </Nav.Item>
      </NavDropdown>
      {/* SOV is dead in ESI ATM... */}
      {/* <Nav.Item as={"li"}>
        <Nav.Link as={Link} to={`/audit/r_beta/corp/sov`} key="bridges">
          {t("Sov")}
        </Nav.Link>
      </Nav.Item> */}
    </>
  );
};

export default CorpMenu;
