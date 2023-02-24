import { loadCharacterStatus } from "../../api/character";
import { RefreshCharButton } from "../../components/RefreshAccountButton";
import {
  AllianceLogo,
  CharacterPortrait,
  CorporationLogo,
} from "../../components/eveImages/eveImages";
import React from "react";
import { Badge, Card } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";

function MyTooltip({ message }: { message: String }) {
  return <Tooltip id="character_tooltip">{message}</Tooltip>;
}

const CharHeader = () => {
  let { characterID } = useParams();
  let style = {
    borderRadius: `25%`,
  };

  const { data } = useQuery(["status", characterID], () => loadCharacterStatus(characterID), {
    refetchOnWindowFocus: false,
  });

  const isk = data?.characters.reduce((p: number, c: any) => {
    try {
      return p + c.isk;
    } catch (err) {
      return p;
    }
  }, 0);
  const sp = data?.characters.reduce((p: number, c: any) => {
    try {
      return p + c.sp;
    } catch (err) {
      return p;
    }
  }, 0);
  const bad_chars = data?.characters
    .filter((char: any) => !char.active)
    .map((char: any) => char.character.character_name);

  return (
    <Card>
      <div className="d-flex justify-content-start align-items-center flex-no-wrap">
        <CharacterPortrait
          style={{ borderRadius: "0.375rem 0 0 0.375rem" }}
          className="m-0"
          character_id={data?.main.character_id}
          size={64}
        />
        <h4 className="m-1 ms-3">{data?.main.character_name}</h4>
        <CorporationLogo
          style={style}
          className="m-1 ms-3"
          corporation_id={data?.main.corporation_id}
          size={32}
        />
        <h5 className="m-1 ms-3">{data?.main.corporation_name}</h5>
        {data?.main.alliance_id && (
          <>
            <AllianceLogo
              style={style}
              className="m-1 ms-3"
              alliance_id={data?.main.alliance_id}
              size={32}
            />
            <h5 className="m-1 ms-3">{data?.main.alliance_name}</h5>
          </>
        )}
        <p className="m-1 ms-4 me-auto">
          {sp ? (
            <>
              <Badge>Total SP: {sp.toLocaleString()}</Badge> <br />
            </>
          ) : (
            <></>
          )}
          {isk ? (
            <>
              <Badge>Total Isk: {isk.toLocaleString()}</Badge>
            </>
          ) : (
            <></>
          )}
        </p>
        <ButtonGroup className="me-3">
          <RefreshCharButton />
          {data ? (
            bad_chars.length === 0 ? (
              <OverlayTrigger placement="left" overlay={MyTooltip({ message: "No Account Flags" })}>
                <Button className="btn-success">
                  <i className="fa-solid fa-check"></i>
                </Button>
              </OverlayTrigger>
            ) : (
              <OverlayTrigger
                placement="left"
                overlay={MyTooltip({
                  message: `Character Flags: ${bad_chars.join(", ")}`,
                })}
              >
                <Button className="btn-danger">{bad_chars.length}</Button>
              </OverlayTrigger>
            )
          ) : (
            <></>
          )}
        </ButtonGroup>
      </div>
    </Card>
  );
};

export { CharHeader };
