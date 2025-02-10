import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import { LinkContainer } from "react-router-bootstrap";
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
  console.log(props);
  return (
    <>
      <Nav.Item as={"li"}>
        <Nav.Link as={Link} to={`/audit/r_beta/corp/glance`} key="Glance">
          Overview
        </Nav.Link>
      </Nav.Item>
      <NavDropdown as={"li"} title="Structures">
        <Nav.Item as={"li"}>
          <Nav.Link as={Link} to={`/audit/r_beta/corp/structures`} key="Structures">
            Structures
          </Nav.Link>
        </Nav.Item>
        <Nav.Item as={"li"}>
          <Nav.Link as={Link} to={`/audit/r_beta/corp/bridges`} key="bridges">
            Bridges
          </Nav.Link>
        </Nav.Item>
        <Nav.Item as={"li"}>
          <Nav.Link as={Link} to={`/audit/r_beta/corp/fuel`} key="bridges">
            Fuel
          </Nav.Link>
        </Nav.Item>
        <Nav.Item as={"li"}>
          <Nav.Link as={Link} to={`/audit/r_beta/corp/metenox`} key="bridges">
            Metenox
          </Nav.Link>
        </Nav.Item>
        <Nav.Item as={"li"}>
          <Nav.Link as={Link} to={`/audit/r_beta/corp/pocos`} key="pocos">
            Pocos
          </Nav.Link>
        </Nav.Item>
      </NavDropdown>
      <Nav.Item as={"li"}>
        <Nav.Link as={Link} to={`/audit/r_beta/corp/wallets`} key="Wallets">
          Wallets
        </Nav.Link>
      </Nav.Item>
      <NavDropdown as={"li"} title="Assets">
        <Nav.Item as={"li"}>
          <Nav.Link as={Link} to={`/audit/r_beta/corp/assetgroup`} key="assetgroup">
            Asset Overview
          </Nav.Link>
        </Nav.Item>
        <Nav.Item as={"li"}>
          <Nav.Link as={Link} to={`/audit/r_beta/corp/assetlist`} key="assetlist">
            Asset List
          </Nav.Link>
        </Nav.Item>
      </NavDropdown>
      <Nav.Item as={"li"}>
        <Nav.Link as={Link} to={`/audit/r_beta/corp/sov`} key="bridges">
          Sov
        </Nav.Link>
      </Nav.Item>
      {/* {data &&
        data.map((cat: CategoryProps) => {
          return (
            <NavDropdown id={cat.name} title={cat.name} key={cat.name}>
              {cat.links.map((link: MenuItemProps) => {
                return (
                  <LinkContainer to={`/audit/r/${characterID}/${link.link}`}>
                    <NavDropdown.Item id={link.name} key={link.name}>
                      {link.name}
                    </NavDropdown.Item>
                  </LinkContainer>
                );
              })}
            </NavDropdown>
          );
        })} */}
    </>
  );
};

export default CorpMenu;
