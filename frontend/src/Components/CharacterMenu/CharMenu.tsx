import { Nav } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { MenuDropdown, MenuItem } from "./MenuParts";

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
}

const CharMenu = ({ data }: CharMenuProps) => {
  const { t } = useTranslation();
  const menuOverview = {
    name: t("Overview"),
    link: `account/overview`,
  };

  return (
    <>
      <MenuItem link={menuOverview} />
      {data &&
        data.map((cat: any) => {
          return cat.links ? (
            <MenuDropdown {...{ cat }} />
          ) : (
            <>
              {cat.link.startsWith("/") ? (
                <Nav.Item as="li">
                  <Nav.Link id={cat.name} key={cat.name} href={cat.link}>
                    <>{cat.name}</>
                  </Nav.Link>
                </Nav.Item>
              ) : (
                <MenuItem link={cat.link} />
              )}
            </>
          );
        })}
    </>
  );
};

export default CharMenu;
