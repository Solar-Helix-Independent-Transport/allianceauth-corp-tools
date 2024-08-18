import { TypeIcon } from "../../Components/EveImages/EveImages";
import TableWrapper from "../../Components/Tables/BaseTable/TableWrapper";
import { components } from "../../api/CtApi";
import { getCharacterClones } from "../../api/character";
import { createColumnHelper } from "@tanstack/react-table";
import { Table } from "react-bootstrap";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";

const CharacterClones = () => {
  const { characterID } = useParams();

  const { data, isFetching } = useQuery({
    queryKey: ["clones", characterID],
    queryFn: () => getCharacterClones(Number(characterID)),
    refetchOnWindowFocus: false,
  });
  const columnHelper = createColumnHelper<components["schemas"]["CharacterClones"]>();

  const columns = [
    columnHelper.accessor("character.character_name", {
      header: "Character",
    }),
    columnHelper.accessor("home.name", {
      header: "Home",
    }),
    columnHelper.accessor("last_clone_jump", {
      header: "Last Jump",
    }),
    columnHelper.accessor("last_station_change", {
      header: "Last Station Change",
    }),
    columnHelper.accessor("clones", {
      header: "Clones",
      cell: (props) => {
        return (
          <Table>
            <thead>
              <th>Location</th>
              <th className="text-end">Implants</th>
            </thead>
            <tbody>
              {props.getValue()?.map((d: components["schemas"]["CharacterClone"]) => {
                return (
                  <tr>
                    <td>
                      {d.name} {d.location?.name}
                    </td>
                    <td className="">
                      <div className="d-flex justify-content-end align-items-center">
                        {d.implants?.length ? (
                          d.implants.map((imp) => {
                            return <TypeIcon textContent={imp.name} type_id={imp.id} size={32} />;
                          })
                        ) : (
                          <i className="fa-regular fa-circle-xmark"></i>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        );
      },
    }),
  ];

  return (
    <>
      <TableWrapper {...{ data, isFetching, columns }} />
    </>
  );
};

export default CharacterClones;
