import { postCorporationRefresh } from "../../api/corporation";
import Button from "react-bootstrap/Button";
// import { Checkbox, FormControl, Glyphicon, NavDropdown, NavItem } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import { useMutation } from "react-query";

function CorpAddToken() {
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
              label="Structures"
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
              label="Assets"
            />
            <h6>Assets Enables LO Levels in Bridges</h6>

            <Form.Check
              type="checkbox"
              defaultChecked={false}
              //   inline={true}
              id="m"
              name="m"
              label="Moons"
            />
            <h6>Moons enable Active Observation Tracking</h6>

            <Form.Check
              type="checkbox"
              defaultChecked={false}
              //   inline={true}
              id="w"
              name="w"
              label="Wallets"
            />
            <h6>Required for invoice module on holding corps</h6>

            <Form.Check
              type="checkbox"
              defaultChecked={false}
              //   inline={true}
              id="t"
              name="t"
              label="Member Tracking"
            />
            <h6>Member Tracking enables the Last Login Tracking of characters for smart filters</h6>

            <Form.Check
              type="checkbox"
              defaultChecked={false}
              //   inline={true}
              id="c"
              name="c"
              label="Contracts"
            />

            <br />
            <br />
            <Button variant="primary" type="submit">
              Add Token
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
