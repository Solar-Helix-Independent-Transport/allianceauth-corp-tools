import { Nav } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import { MenuDropdown, MenuItem, MenuProps } from "../Menu/MenuParts";

const CharMenu = ({ data }: MenuProps) => {
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
