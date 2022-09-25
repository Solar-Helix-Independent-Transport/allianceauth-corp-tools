import "./CharacterPortrait.css";
import React from "react";
import { Image } from "react-bootstrap";

const CharacterPortrait = ({ character, className = "" }) => {
  return (
    <div className={"char-portrait " + className}>
      <Image
        className="img-circle"
        height={400}
        width={400}
        alt={character.character_name}
        src={`https://images.evetech.net/characters/${character.character_id}/portrait?size=512`}
      />
      <Image
        className="corp-logo img-circle"
        alt={character.corporation_name}
        src={`https://images.evetech.net/corporations/${character.corporation_id}/logo?size=128`}
      />
      <Image
        className="alli-logo img-circle"
        alt={character.alliance_name}
        src={`https://images.evetech.net/alliances/${character.alliance_id}/logo?size=128`}
      />
    </div>
  );
};

export default CharacterPortrait;
