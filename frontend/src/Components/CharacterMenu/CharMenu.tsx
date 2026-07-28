import { Nav } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import { MenuDropdown, MenuItem } from "../Menu/MenuParts";

export interface CharMenuItemProps {
  name: string;
  link?: string;
}

export interface CharCategoryProps {
  name: string;
  link?: string;
  links?: Array<CharMenuItemProps>;
}

export interface CharMenuProps extends Partial<HTMLElement> {
  isLoading: boolean;
  data: Array<CharCategoryProps | CharMenuItemProps>;
  error: boolean;
}

const CharMenu = ({ data }: CharMenuProps) => {
  const { t } = useTranslation();
  const { characterID } = useParams();
  const toPath = (link: string) => `/audit/r/${characterID}/${link}`;
  const menuOverview = {
    name: t("Overview"),
    link: `account/overview`,
  };

  return (
    <>
      <MenuItem link={menuOverview} {...{ toPath }} />
      {data &&
        data.map((cat) => {
          return "links" in cat && cat.links ? (
            <MenuDropdown {...{ cat, toPath }} />
          ) : (
            <>
              {cat.link?.startsWith("/") ? (
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

export default CharMenu;
