import { Nav, NavDropdown } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";

const BASEURL = "/audit/r/corp/";

export const MenuDropdown = ({ cat }: any) => {
  const path = useLocation();
  const hit = cat.links?.reduce((o: boolean, n: any) => {
    return (o = o || path.pathname.includes(n.link));
  }, false);
  return (
    <NavDropdown as={"li"} active={hit} id={cat.name} title={cat.name} key={cat.name}>
      {cat.links?.map((link: any) => {
        return (
          <Nav.Item as="li">
            {link.link.startsWith("/") ? (
              <NavDropdown.Item id={link.name} key={link.name} href={link.link}>
                <>{link.name}</>
              </NavDropdown.Item>
            ) : (
              <DropdownMenuItem link={link} />
            )}
          </Nav.Item>
        );
      })}
    </NavDropdown>
  );
};

export const DropdownMenuItem = ({ link }: any) => {
  const path = useLocation();
  const hit = path.pathname.endsWith(link.link);
  return (
    <Nav.Item as="li">
      <NavDropdown.Item
        as={Link}
        to={`${BASEURL}${link.link}`}
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
  const hit = path.pathname.endsWith(link.link);
  return (
    <Nav.Item as="li">
      <Nav.Link as={Link} to={`${BASEURL}${link.link}`} id={link.name} key={link.name} active={hit}>
        {link.name}
      </Nav.Link>
    </Nav.Item>
  );
};
