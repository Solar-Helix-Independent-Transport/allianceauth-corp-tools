import Nav from "react-bootstrap/Nav";
import { useTranslation } from "react-i18next";
import { MenuDropdown, MenuItem } from "./MenuParts";

export interface MenuItemProps {
  name: string;
  link: string;
}

export interface CategoryProps {
  name: string;
  links: Array<MenuItemProps>;
}

export interface CorpMenuProps extends Partial<HTMLElement> {
  isLoading?: boolean;
  data?: Array<CategoryProps> | null;
  error?: boolean;
}

const CorpMenu = (props: CorpMenuProps) => {
  const { t } = useTranslation();

  const menuLinks = [
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
          name: t("Bridges"),
          link: `bridges`,
        },
        {
          name: t("Pocos"),
          link: `pocos`,
        },
        // {
        //   name: t("POSs"),
        //   link: `pos`,
        // },
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
      ],
    },
  ];

  console.log(props);
  return (
    <>
      {menuLinks.map((cat) => {
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
              <MenuItem link={cat} />
            )}
          </>
        );
      })}
    </>
  );
};

export default CorpMenu;
