import React, { useState, useEffect } from "react";
import { Label, Table } from "react-bootstrap";
import { Panel } from "react-bootstrap";
import CharacterPortrait from "../components/CharacterPortrait";
import { useQuery } from "react-query";
import { loadClones } from "../apis/Character";
import { Bars } from "@agney/react-loading";
import { Image } from "react-bootstrap";
import { TypeIcon } from "../components/EveImages";

const Clones = ({ character_id }) => {
  const { isLoading, error, data } = useQuery(["clones", character_id], () =>
    loadClones(character_id)
  );

  if (isLoading)
    return (
      <Panel>
        <Panel.Body className="flex-container">
          <Bars className="spinner-size" />
        </Panel.Body>
      </Panel>
    );

  if (error) return <div></div>;

  return (
    <Panel>
      <Panel.Body className="flex-container-vert-fill">
        {data.map((char) => {
          return (
            <Panel className="flex-child">
              <Panel.Body className="">
                <div className="float-left">
                  <CharacterPortrait character={char.character} />
                </div>
                <div className="fill-width">
                  <h4>{char.character.character_name}</h4>
                  <p>{`Home: ${
                    char.home != null ? char.home.name : "No Data"
                  }`}</p>
                  <p>
                    <Label>{`Last Clone Jump: ${char.last_clone_jump}`}</Label>
                    <Label>{`Last Station Change: ${char.last_station_change}`}</Label>
                  </p>
                  <h5>Clones</h5>
                  <Table striped>
                    <tbody>
                      {char.clones != null ? (
                        char.clones.map((c) => {
                          console.log(c);
                          return (
                            <tr>
                              <td>
                                {c.name != null && <>{`${c.name}`}</>}
                                {c.location != null && (
                                  <>{`Location: ${c.location.name}`}</>
                                )}
                              </td>
                              <td class="text-right no-wrap">
                                {c.implants.map((i) => {
                                  return <TypeIcon type_id={i.id} />;
                                })}
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={2}>No Data</td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </div>
              </Panel.Body>
            </Panel>
          );
        })}
      </Panel.Body>
    </Panel>
  );
};

export default Clones;
