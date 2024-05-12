import { postCorporationRefresh } from "../apis/Corporation";
import React from "react";
import { Checkbox, FormControl, Glyphicon, NavDropdown, NavItem } from "react-bootstrap";
import { Form } from "react-bootstrap/lib/Navbar";
import { useMutation } from "react-query";

function CorpBadge() {
  const { mutate } = useMutation(postCorporationRefresh);

  return (
    <>
      <NavDropdown title="Add Corporate Token">
        <form action="/audit/corp/add_options" method="get" style={{ width: "350px" }}>
          <Form>
            <Checkbox style={{ width: "100%" }} defaultChecked={true} inline={true} id="s" name="s">
              Structures
            </Checkbox>
            <br />
            <Checkbox
              style={{ width: "100%" }}
              defaultChecked={false}
              inline={true}
              id="a"
              name="a"
            >
              Assets
            </Checkbox>
            <h6>Assets Enables LO Levels in Bridges</h6>

            <Checkbox
              style={{ width: "100%" }}
              defaultChecked={false}
              inline={true}
              id="m"
              name="m"
            >
              Moons
            </Checkbox>
            <h6>Moons enable Active Observation Tracking</h6>

            <Checkbox
              style={{ width: "100%" }}
              defaultChecked={false}
              inline={true}
              id="w"
              name="w"
            >
              Wallets
            </Checkbox>
            <h6>Required for invoice module on holding corps</h6>

            <Checkbox
              style={{ width: "100%" }}
              defaultChecked={false}
              inline={true}
              id="t"
              name="t"
            >
              Member Tracking
            </Checkbox>
            <h6>Member Tracking enables the Last Login Tracking of characters for smart filters</h6>

            <Checkbox
              style={{ width: "100%" }}
              defaultChecked={false}
              inline={true}
              id="c"
              name="c"
            >
              Contracts
            </Checkbox>

            <br />
            <br />
            <FormControl style={{ width: "100%" }} bsSize="small" type="submit" value="Add Token" />
          </Form>
        </form>
      </NavDropdown>
      <NavItem onClick={() => mutate()}>
        <Glyphicon glyph="refresh" />
      </NavItem>
    </>
  );
}

export default CorpBadge;
