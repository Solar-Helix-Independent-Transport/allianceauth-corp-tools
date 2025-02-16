import { postCorporationRefresh } from "../../api/corporation";
import Button from "react-bootstrap/Button";
// import { Checkbox, FormControl, Glyphicon, NavDropdown, NavItem } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import { useTranslation } from "react-i18next";
import { useMutation } from "react-query";

function CorpAddToken() {
  const { t } = useTranslation();

  const { mutate } = useMutation(postCorporationRefresh);

  return (
    <>
      <NavDropdown title="Add Token" id="add-token">
        {/* <NavDropdown.Item> */}
        <form
          action="/audit/corp/add_options"
          method="get"
          className="m-4"
          style={{ width: "350px" }}
        >
          <Form>
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
              type="checkbox"
              defaultChecked={false}
              //   inline={true}
              id="a"
              name="a"
              label={t("Assets")}
            />
            <h6>{t("Assets Enables LO Levels in Bridges")}</h6>

            <Form.Check
              type="checkbox"
              defaultChecked={false}
              //   inline={true}
              id="m"
              name="m"
              label={t("Moons")}
            />
            <h6>{t("Moons enable Active Observation Tracking")}</h6>

            <Form.Check
              type="checkbox"
              defaultChecked={false}
              //   inline={true}
              id="w"
              name="w"
              label={t("Wallets")}
            />
            <h6>{t("Required for invoice module on holding corps")}</h6>

            <Form.Check
              type="checkbox"
              defaultChecked={false}
              //   inline={true}
              id="t"
              name="t"
              label={t("Member Tracking")}
            />
            <h6>
              {t("Member Tracking enables the Last Login Tracking of characters for smart filters")}
            </h6>

            <Form.Check
              type="checkbox"
              defaultChecked={false}
              //   inline={true}
              id="c"
              name="c"
              label={t("Contracts")}
            />

            <br />
            <br />
            <Button variant="primary" type="submit">
              {t("Add Token")}
            </Button>
          </Form>
        </form>
        {/* </NavDropdown.Item> */}
      </NavDropdown>
      <Nav.Link onClick={() => mutate()}>
        <i className="fa fa-refresh" aria-hidden="true"></i>
      </Nav.Link>
    </>
  );
}

export default CorpAddToken;
