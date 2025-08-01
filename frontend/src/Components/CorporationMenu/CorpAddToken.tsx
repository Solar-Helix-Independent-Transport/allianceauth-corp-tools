// import { postCorporationRefresh } from "../../api/corporation";
import Button from "react-bootstrap/Button";
// import { Checkbox, FormControl, Glyphicon, NavDropdown, NavItem } from "react-bootstrap";
import Form from "react-bootstrap/Form";
// import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import { useTranslation } from "react-i18next";
// import { useMutation } from "react-query";

function CorpAddToken() {
  const { t } = useTranslation();

  // const { mutate } = useMutation(postCorporationRefresh);

  return (
    <>
      <NavDropdown title="Add Token" id="add-token">
        {/* <NavDropdown.Item> */}
        <div className="m-4" style={{ width: "400px" }}>
          <Form action="/audit/corp/add_options" method="get">
            <Form.Check
              label={t("Structures")}
              type="checkbox"
              defaultChecked={true}
              inline={true}
              id="s"
              name="s"
            />
            <br />
            <Form.Check
              label={t("Starbases")}
              type="checkbox"
              defaultChecked={true}
              inline={true}
              id="sb"
              name="sb"
            />
            <br />
            <Form.Check
              type="checkbox"
              defaultChecked={false}
              //   inline={true}
              id="a"
              name="a"
              label={t("Assets")}
            />
            <p>
              {t(
                "Assets also Enables: LO levels in Bridges, fittings on Structures, in space fittings adjacent to Starbases",
              )}
            </p>

            <Form.Check
              type="checkbox"
              defaultChecked={false}
              //   inline={true}
              id="m"
              name="m"
              label={t("Moons")}
            />
            <p>{t("Moons enable Active Observation Tracking")}</p>

            <Form.Check
              type="checkbox"
              defaultChecked={false}
              //   inline={true}
              id="w"
              name="w"
              label={t("Wallets")}
            />
            <p>{t("Required for invoice module on holding corps")}</p>

            <Form.Check
              type="checkbox"
              defaultChecked={false}
              //   inline={true}
              id="t"
              name="t"
              label={t("Member Tracking")}
            />
            <p>
              {t("Member Tracking enables the Last Login Tracking of characters for smart filters")}
            </p>

            <Form.Check
              type="checkbox"
              defaultChecked={false}
              //   inline={true}
              id="c"
              name="c"
              label={t("Contracts")}
            />

            <Form.Check
              type="checkbox"
              defaultChecked={false}
              //   inline={true}
              id="i"
              name="i"
              label={t("Industry Jobs")}
            />

            <br />
            <br />
            <Button variant="primary" type="submit">
              {t("Add Token")}
            </Button>
          </Form>
        </div>
        {/* </NavDropdown.Item> */}
      </NavDropdown>
      {/* <Nav.Link onClick={() => mutate()}>
        <i className="fa fa-refresh" aria-hidden="true"></i>
      </Nav.Link> */}
    </>
  );
}

export default CorpAddToken;
