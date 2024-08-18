import CharacterAssetLocationSelect from "../../Components/Character/CharacterAssetLocationSelect";
import { PanelLoader } from "../../Components/Loaders/loaders";
import { getAssetGroups } from "../../api/character";
import { useState } from "react";
import { Card, Table } from "react-bootstrap";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";

const CharacterAssetGroups = () => {
  const { characterID } = useParams();

  const [LocationID, setLocation] = useState<number>(0);

  const { data, isFetching } = useQuery({
    queryKey: ["assetGroups", characterID, LocationID],
    queryFn: () => getAssetGroups(Number(characterID), Number(LocationID)),
    refetchOnWindowFocus: false,
  });

  console.log(isFetching);

  return (
    <>
      <div className="m-3 d-flex align-items-center">
        <h5 className="me-1">Location Filter</h5>
        <div className="flex-grow-1">
          <CharacterAssetLocationSelect
            characterID={characterID ? Number(characterID) : 0}
            {...{ setLocation }}
          />
        </div>
      </div>
      {isFetching ? (
        <PanelLoader title="Loading" message="Please Wait!" />
      ) : (
        <div className="d-flex flex-wrap justify-content-evenly">
          {data?.map((group) => {
            return (
              <Card key={group.name} className="m-3">
                <Card.Header>
                  <h4 className={"text-center"}>{group.name}</h4>
                </Card.Header>
                <Card.Body style={{ height: "500px", overflowY: "scroll" }}>
                  <Table striped style={{ marginBottom: 0, minWidth: "400px" }}>
                    <thead>
                      <tr key={"head " + group.name}>
                        <th>Group</th>
                        <th className="text-end">Count</th>
                      </tr>
                    </thead>
                  </Table>
                  <div className={"table-div"}>
                    <Table striped>
                      <tbody>
                        {group?.items?.map((h) => {
                          return (
                            <tr key={group.name + " " + h.label + " " + h.value}>
                              <td>{h.label}</td>
                              <td className="text-end no-wrap">{h.value.toLocaleString()}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </Table>
                  </div>
                </Card.Body>
              </Card>
            );
          })}
        </div>
      )}
    </>
  );
};

export default CharacterAssetGroups;
