import { Nav, NavDropdown } from "react-bootstrap";
import { Link, useLocation } from "react-router";

export interface MenuLinkItem {
  name: string;
  link?: string;
}

export interface MenuCategory {
  name: string;
  link?: string;
  links?: MenuLinkItem[];
}

export interface MenuProps {
  isLoading: boolean;
  data: Array<MenuCategory | MenuLinkItem>;
  error: boolean;
}

// Char-scoped menus route via `/audit/r/:characterID/...`, corp-scoped menus
// via the fixed `/audit/r/corp/...`; toPath is how each caller supplies that
// difference without MenuParts needing to know which scope it's in.
export interface ToPath {
  toPath: (link: string) => string;
}

export const MenuDropdown = ({ cat, toPath }: { cat: MenuCategory } & ToPath) => {
  const path = useLocation();
  const hit = cat.links?.reduce((o: boolean, n) => {
    return o || path.pathname.includes(n.link ?? "");
  }, false);
  return (
    <NavDropdown as={"li"} active={hit} id={cat.name} title={cat.name} key={cat.name}>
      {cat.links?.map((link) => (
        <Nav.Item as="li" key={link.name}>
          {link.link?.startsWith("/") ? (
            <NavDropdown.Item id={link.name} href={link.link}>
              <>{link.name}</>
            </NavDropdown.Item>
          ) : (
            <DropdownMenuItem {...{ link, toPath }} />
          )}
        </Nav.Item>
      ))}
    </NavDropdown>
  );
};

export const DropdownMenuItem = ({ link, toPath }: { link: MenuLinkItem } & ToPath) => {
  const path = useLocation();
  const hit = path.pathname.endsWith(link.link ?? "");
  return (
    <Nav.Item as="li">
      <NavDropdown.Item
        as={Link}
        to={{ pathname: toPath(link.link ?? ""), search: path.search }}
        id={link.name}
        key={link.name}
        active={hit}
      >
        {link.name}
      </NavDropdown.Item>
    </Nav.Item>
  );
};

export const MenuItem = ({ link, toPath }: { link: MenuLinkItem } & ToPath) => {
  const path = useLocation();
  const hit = path.pathname.endsWith(link.link ?? "");
  return (
    <Nav.Item as="li">
      <Nav.Link
        as={Link}
        to={{ pathname: toPath(link.link ?? ""), search: path.search }}
        id={link.name}
        key={link.name}
        active={hit}
      >
        {link.name}
      </Nav.Link>
    </Nav.Item>
  );
};
