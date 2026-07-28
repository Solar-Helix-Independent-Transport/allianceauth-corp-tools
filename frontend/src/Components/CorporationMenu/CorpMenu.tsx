import Nav from "react-bootstrap/Nav";
import { MenuDropdown, MenuItem } from "../Menu/MenuParts";

export interface MenuItemProps {
  name: string;
  link?: string;
}

export interface CategoryProps {
  name: string;
  links?: Array<MenuItemProps>;
  link?: string;
}

export interface CorpMenuProps extends Partial<HTMLElement> {
  isLoading: boolean;
  data: Array<CategoryProps | MenuItemProps>;
  error: boolean;
}

const BASEURL = "/audit/r/corp/";
const toPath = (link: string) => `${BASEURL}${link}`;

const CorpMenu = ({ data }: CorpMenuProps) => {
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
