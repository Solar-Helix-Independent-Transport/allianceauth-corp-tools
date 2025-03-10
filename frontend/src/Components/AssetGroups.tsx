import { Card, Table } from "react-bootstrap";
import { useTranslation } from "react-i18next";

export const AssetGroups = ({ data }: any) => {
  const { t } = useTranslation();

  return (
    <div className="d-flex flex-wrap justify-content-evenly">
      {data?.map((group: any) => {
        return (
          <Card key={group.name} className="m-3">
            <Card.Header>
              <Card.Title>{group.name}</Card.Title>
            </Card.Header>
            <Card.Body style={{ height: "500px", overflowY: "scroll" }}>
              <Table striped style={{ marginBottom: 0, minWidth: "400px" }}>
                <thead>
                  <tr key={"head " + group.name}>
                    <th>{t("Group")}</th>
                    <th className="text-end">{t("Count")}</th>
                  </tr>
                </thead>
              </Table>
              <div className={"table-div"}>
                <Table striped>
                  <tbody>
                    {group?.items?.map((h: any) => {
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
  );
};
