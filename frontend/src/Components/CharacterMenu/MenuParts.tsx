import { Nav, NavDropdown } from "react-bootstrap";
import { Link, useLocation, useParams } from "react-router-dom";

export const MenuDropdown = ({ cat }: { cat: any }) => {
  const path = useLocation();
  const hit = cat.links?.reduce((o: boolean, n: any) => {
    return (o = o || path.pathname.includes(n.link));
  }, false);
  return (
    <NavDropdown as={"li"} active={hit} id={cat.name} title={cat.name} key={cat.name}>
      {cat.links?.map((link: any) => {
        return (
          <Nav.Item as="li">
            <DropdownMenuItem link={link} />
          </Nav.Item>
        );
      })}
    </NavDropdown>
  );
};

export const DropdownMenuItem = ({ link }: any) => {
  const path = useLocation();
  const { characterID } = useParams();
  const hit = path.pathname.endsWith(link.link);
  return (
    <Nav.Item as="li">
      <NavDropdown.Item
        as={Link}
        to={`/audit/r/${characterID}/${link.link}`}
        id={link.name}
        key={link.name}
        active={hit}
      >
        {link.name}
      </NavDropdown.Item>
    </Nav.Item>
  );
};

export const MenuItem = ({ link }: any) => {
  const path = useLocation();
  const { characterID } = useParams();
  const hit = path.pathname.endsWith(link.link);
  return (
    <Nav.Item as="li">
      <Nav.Link
        as={Link}
        to={`/audit/r/${characterID}/${link.link}`}
        id={link.name}
        key={link.name}
        active={hit}
      >
        {link.name}
      </Nav.Link>
    </Nav.Item>
  );
};
