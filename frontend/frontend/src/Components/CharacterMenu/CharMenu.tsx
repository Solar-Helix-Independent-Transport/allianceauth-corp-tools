import { Nav } from "react-bootstrap";
import NavDropdown from "react-bootstrap/NavDropdown";
import { Link } from "react-router-dom";

export interface CharMenuItemProps {
  name: string;
  link: string;
}

export interface CharCategoryProps {
  name: string;
  links: Array<CharMenuItemProps>;
}

export interface CharMenuProps extends Partial<HTMLElement> {
  isLoading: boolean;
  data: Array<CharCategoryProps>;
  error: boolean;
  characterID: string;
}

// function urlify(path: string, characterID: string) {
//   console.log(path);
//   if (path.startsWith("/")) {
//     console.log("simple");

//     return path;
//   } else {
//     console.log("rewrite");

//     return `/audit/r_beta/${characterID}/${path}`;
//   }
// }

const CharMenu = ({ data, characterID }: CharMenuProps) => {
  return (
    <>
      <Nav.Item as="li">
        <Nav.Link as={Link} to={`/audit/r_beta/${characterID}/account/overview`} key="Overview">
          Overview
        </Nav.Link>
      </Nav.Item>
      {data &&
        data.map((cat: any) => {
          console.log(cat.name);
          return cat.links ? (
            <NavDropdown as={"li"} id={cat.name} title={cat.name} key={cat.name}>
              {cat.links?.map((link: any) => {
                return (
                  <Nav.Item as="li">
                    <NavDropdown.Item
                      as={Link}
                      to={`/audit/r_beta/${characterID}/${link.link}`}
                      id={link.name}
                      key={link.name}
                    >
                      {link.name}
                    </NavDropdown.Item>
                  </Nav.Item>
                );
              })}
            </NavDropdown>
          ) : (
            <>
              {cat.link.startsWith("/") ? (
                <Nav.Item as="li">
                  <Nav.Link id={cat.name} key={cat.name} href={cat.link}>
                    <>{cat.name}</>
                  </Nav.Link>
                </Nav.Item>
              ) : (
                <Nav.Item as="li">
                  <Nav.Link
                    as={Link}
                    to={`/audit/r_beta/${characterID}/${cat.link}`}
                    id={cat.name}
                    key={cat.name}
                  >
                    <>{cat.name}</>
                  </Nav.Link>
                </Nav.Item>
              )}
            </>
          );
        })}
    </>
  );
};

export default CharMenu;
