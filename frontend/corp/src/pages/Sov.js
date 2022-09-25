import { loadSov } from "../apis/Corporation";
import { ErrorLoader } from "../components/ErrorLoader";
import { DataMessage } from "../components/NoData";
import { PanelLoader } from "../components/PanelLoader";
import React, { useState } from "react";
import { Glyphicon, Label, Panel, Table } from "react-bootstrap";
import { useQuery } from "react-query";
import Select from "react-select";

const colourStyles = {
  option: (styles) => {
    return {
      ...styles,
      color: "black",
    };
  },
};

export const Sov = () => {
  const { isLoading, isFetching, error, data } = useQuery(
    ["sov"],
    () => loadSov() //,
    //{ initialData: [] }
  );
  const [regionFilter, setRegion] = useState("");
  const [constellationFilter, setConstellation] = useState("");

  const [upgradesFilter, setUpgrades] = useState([]);
  const [stateFilter, setState] = useState([]);

  const stateToState = (entry) => {
    let values = entry.map((o) => {
      return o.value;
    });
    setState(values);
  };

  const upgradesToState = (entry) => {
    let values = entry.map((o) => {
      return o.value;
    });
    setUpgrades(values);
  };

  const regionToState = (entry) => {
    let values = entry.map((o) => {
      return o.value;
    });
    setRegion(values);
  };

  const constellationToState = (entry) => {
    let values = entry.map((o) => {
      return o.value;
    });
    setConstellation(values);
  };

  if (isLoading) return <PanelLoader />;

  if (error) return <ErrorLoader />;

  let _upgrades = new Set();
  let _state = new Set();

  let _region = new Set();
  let _constellation = new Set();
  let _system = new Set();

  data.map((system) => {
    system.upgrades.map((upgrade) => {
      _upgrades.add(upgrade.name);
      _state.add(upgrade.active);
      return false;
    });
    _region.add(system.system.rgn);
    _constellation.add(system.system.const);
    _system.add(system.system.system);
    return false;
  });

  let viewData = data.filter((system) => {
    if (regionFilter.length) {
      if (!regionFilter.includes(system.system.rgn)) {
        return false;
      }
    }
    if (constellationFilter.length) {
      if (!constellationFilter.includes(system.system.const)) {
        return false;
      }
    }
    if (upgradesFilter.length) {
      let upgrades = system.upgrades.reduce((last, next) => {
        last.push(next.name);
        return last;
      }, []);
      return upgradesFilter.every((i) => upgrades.includes(i));
    }
    return true;
  });
  viewData = viewData.filter((system) => {
    if (stateFilter.length) {
      let states = system.upgrades.reduce((last, next) => {
        if (upgradesFilter.length) {
          if (upgradesFilter.includes(next.name)) {
            last.push(next.active);
          }
        } else {
          last.push(next.active);
        }
        return last;
      }, []);
      return stateFilter.reduce((i, n) => i || states.includes(n), false);
    }
    return true;
  });
  return data.length > 0 ? (
    <>
      <Panel.Heading>Sov Upgrades</Panel.Heading>
      <Panel.Body className="flex-container">
        <div className="flex-label-container col-lg-6 col-md-12 col-sm-12 col-xs-12">
          <div className="flex-label">
            <h5>Region Filter</h5>
          </div>
          <Select
            className="flex-select"
            styles={colourStyles}
            options={Array.from(_region, (u) => {
              return {
                value: u,
                label: u,
              };
            }).sort((a, b) => (a.value > b.value ? 1 : b.value > a.value ? -1 : 0))}
            isLoading={isFetching}
            isMulti={true}
            onChange={regionToState}
          />
        </div>
        <div className="flex-label-container col-lg-6 col-md-12 col-sm-12 col-xs-12">
          <div className="flex-label">
            <h5>Constellation Filter</h5>
          </div>
          <Select
            className="flex-select"
            styles={colourStyles}
            style={{ width: "300px" }}
            options={Array.from(_constellation, (u) => {
              return {
                value: u,
                label: u,
              };
            }).sort((a, b) => (a.value > b.value ? 1 : b.value > a.value ? -1 : 0))}
            isLoading={isFetching}
            isMulti={true}
            onChange={constellationToState}
          />
        </div>
        <div className="flex-label-container col-lg-6 col-md-12 col-sm-12 col-xs-12">
          <div className="flex-label">
            <h5>Upgrade Name Filter</h5>
          </div>
          <Select
            className="flex-select"
            styles={colourStyles}
            style={{ width: "300px" }}
            options={Array.from(_upgrades, (u) => {
              return {
                value: u,
                label: u,
              };
            }).sort((a, b) => (a.value > b.value ? 1 : b.value > a.value ? -1 : 0))}
            isLoading={isFetching}
            isMulti={true}
            onChange={upgradesToState}
          />
        </div>
        <div className="flex-label-container col-lg-6 col-md-12 col-sm-12 col-xs-12">
          <div className="flex-label">
            <h5>Upgrade State Filter</h5>
          </div>
          <Select
            className="flex-select"
            styles={colourStyles}
            style={{ width: "300px" }}
            options={Array.from(_state, (u) => {
              return {
                value: u,
                label: u,
              };
            }).sort((a, b) => (a.value > b.value ? 1 : b.value > a.value ? -1 : 0))}
            isLoading={isFetching}
            isMulti={true}
            onChange={stateToState}
          />
        </div>
        <hr className="col-xs-12" />
        {viewData
          .sort((a, b) =>
            a.system.name > b.system.name ? 1 : b.system.name > a.system.name ? -1 : 0
          )
          .map((system) => {
            return (
              <Panel key={`panel ${system.system.name}`} className="flex-child">
                <Panel.Heading>
                  <h4 className={"text-center"}>
                    {system.system.name}
                    {isFetching && (
                      <Glyphicon className="glyphicon-refresh-animate pull-right" glyph="refresh" />
                    )}
                  </h4>
                </Panel.Heading>
                <Panel.Body className="flex-body">
                  <p className="text-center">
                    <Label>Constellation: {system.system.const}</Label>{" "}
                    <Label>Region: {system.system.rgn}</Label>
                  </p>
                  <Table striped style={{ marginBottom: 0 }}>
                    <thead>
                      <tr key="head">
                        <th>Upgrade</th>
                        <th className="text-right">Active</th>
                      </tr>
                    </thead>
                  </Table>
                  <div
                    className={`table-div ${
                      (stateFilter.length || upgradesFilter.length) && "table-div-no-hight"
                    }`}
                  >
                    <Table striped>
                      <tbody>
                        {system.upgrades
                          .sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0))
                          .map((u) => {
                            if (upgradesFilter.length) {
                              if (!upgradesFilter.includes(u.name)) {
                                return <></>;
                              }
                            }
                            if (stateFilter.length) {
                              if (!stateFilter.includes(u.active)) {
                                return <></>;
                              }
                            }
                            let status = "info";
                            if (u.active === "StructureInactive") {
                              status = "warning";
                            } else if (u.active === "StructureOffline") {
                              status = "danger";
                            }
                            return (
                              <tr className={status} key={u.name}>
                                <td>{u.name}</td>
                                <td className="text-right">{u.active}</td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </Table>
                  </div>
                </Panel.Body>
              </Panel>
            );
          })}
      </Panel.Body>
    </>
  ) : isFetching ? (
    <PanelLoader />
  ) : (
    <DataMessage text="No IHubs Found" />
  );
};
