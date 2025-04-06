import Nav from "react-bootstrap/Nav";
import { useTranslation } from "react-i18next";
import { MenuDropdown, MenuItem } from "./MenuParts";

export interface MenuItemProps {
  name: string;
  link?: string;
}

export interface CategoryProps {
  name: string;
  links?: Array<MenuItemProps>;
  link?: string;
}

const CorpMenu = () => {
  const { t } = useTranslation();

  const menuLinks: Array<CategoryProps> = [
    {
      name: t("Overview"),
      link: `glance`,
    },
    {
      name: t("Structures"),
      links: [
        {
          name: t("Structures"),
          link: `structures`,
        },
        {
          name: t("Pocos"),
          link: `pocos`,
        },
        {
          name: t("Starbases"),
          link: `starbases`,
        },
      ],
    },
    {
      name: t("Wallets"),
      link: `wallets`,
    },
    {
      name: t("Assets"),
      links: [
        {
          name: t("Asset Overview"),
          link: `assetgroup`,
        },
        {
          name: t("Asset List"),
          link: `assetlist`,
        },
      ],
    },
    {
      name: t("Dashboards"),
      links: [
        {
          name: t("Fuel"),
          link: `/audit/corp/dashboard/fuel`,
        },
        {
          name: t("Metenox"),
          link: `/audit/corp/dashboard/metenox`,
        },
        {
          name: t("Bridges"),
          link: `bridges`,
        },
        {
          name: t("Character Mining Ledger"),
          link: `mining`,
        },
      ],
    },
  ];

  return (
    <>
      {menuLinks.map((cat) => {
        return cat.links ? (
          <MenuDropdown {...{ cat }} />
        ) : (
          <>
            {cat?.link?.startsWith("/") ? (
              <Nav.Item as="li">
                <Nav.Link id={cat.name} key={cat.name} href={cat.link}>
                  <>{cat.name}</>
                </Nav.Link>
              </Nav.Item>
            ) : (
              <MenuItem link={cat} />
            )}
          </>
        );
      })}
    </>
  );
};

export default CorpMenu;
