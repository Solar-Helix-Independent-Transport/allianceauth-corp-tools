import Nav from "react-bootstrap/Nav";
import { MenuDropdown, MenuItem, MenuProps } from "../Menu/MenuParts";

const BASEURL = "/audit/r/corp/";
const toPath = (link: string) => `${BASEURL}${link}`;

const CorpMenu = ({ data }: MenuProps) => {
  return (
    <>
      {data &&
        data.map((cat) => {
          return "links" in cat && cat.links ? (
            <MenuDropdown {...{ cat, toPath }} />
          ) : (
            <>
              {cat?.link?.startsWith("/") ? (
                <Nav.Item as="li">
                  <Nav.Link id={cat.name} key={cat.name} href={cat.link}>
                    <>{cat.name}</>
                  </Nav.Link>
                </Nav.Item>
              ) : (
                <MenuItem link={cat} {...{ toPath }} />
              )}
            </>
          );
        })}
    </>
  );
};

export default CorpMenu;
