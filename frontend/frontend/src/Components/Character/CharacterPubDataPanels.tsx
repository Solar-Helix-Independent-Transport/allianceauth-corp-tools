import { PortraitCard } from "../Cards/PortraitCard";
import { Table } from "react-bootstrap";

const CharacterPubDataPanels = ({ data }: { data: any }) => {
  if (!data) return <p>Loading</p>;

  return (
    <div className="d-flex justify-content-center align-items-center flex-row flex-wrap">
      {data?.characters.map((char: any) => {
        const char_status = char.active ? "success" : "warning";
        return (
          <PortraitCard
            border={char_status}
            //isFetching={isFetching}
            character={char.character}
            heading={char.character.character_name}
            roundedImages={"10"}
          >
            <div style={{ width: "350px" }}>
              <div>
                <Table striped style={{ marginBottom: 0 }}>
                  <thead>
                    <tr key={`head-${char.character}`}>
                      <th>Update</th>
                      <th className="text-end">Last Run</th>
                    </tr>
                  </thead>
                </Table>
                <div style={{ width: "350px" }}>
                  <Table striped>
                    <tbody>
                      {data?.headers.map((h: any) => {
                        return (
                          <tr key={h}>
                            <td>{h}</td>
                            <td className="text-end">
                              {char.last_updates
                                ? char.last_updates[h]
                                  ? `${Date.parse(char.last_updates[h])}`
                                  : "Never"
                                : "Never"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </div>
              </div>
            </div>
          </PortraitCard>
        );
      })}
    </div>
  );
};

export default CharacterPubDataPanels;
