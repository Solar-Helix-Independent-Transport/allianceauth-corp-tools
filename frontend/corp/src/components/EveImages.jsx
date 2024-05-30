import React from "react";
import { Image } from "react-bootstrap";

export const CharacterPortrait = ({ character_id, size = 256 }) => {
  return (
    <Image src={`https://images.evetech.net/characters/${character_id}/portrait?size=${size}`} />
  );
};

export const CorporationLogo = ({ corporation_id, size = 256 }) => {
  return (
    <Image src={`https://images.evetech.net/corporations/${corporation_id}/logo?size=${size}`} />
  );
};

export const AllianceLogo = ({ alliance_id, size = 256 }) => {
  return <Image src={`https://images.evetech.net/alliances/${alliance_id}/logo?size=${size}`} />;
};

export const TypeIcon = ({ type_id, size = 64 }) => {
  return (
    <Image
      className="img-circle"
      src={`https://images.evetech.net/types/${type_id}/icon?size=${size}`}
    />
  );
};
