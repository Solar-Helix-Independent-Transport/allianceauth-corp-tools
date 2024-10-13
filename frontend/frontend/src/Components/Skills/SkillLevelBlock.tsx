export const SkillLevelBlock = ({
  level,
  active = 0,
  trained = 0,
}: {
  level: number;
  active?: number;
  trained?: number;
}) => {
  const trained_inactive = trained - active;
  const inactive = level - active - trained_inactive;
  const remain = 5 - Math.max(level, active, trained);
  return (
    <div className=" text-no-wrap">
      {Array.from(Array(active)).map((_) => {
        return <i className="fas fa-circle"></i>;
      })}

      {trained_inactive > 0 ? (
        Array.from(Array(trained_inactive)).map((_) => {
          return <i className="fas fa-circle" style={{ color: "grey" }}></i>;
        })
      ) : (
        <></>
      )}

      {inactive > 0 ? (
        Array.from(Array(inactive)).map((_) => {
          return <i className="fas fa-circle" style={{ color: "orange" }}></i>;
        })
      ) : (
        <></>
      )}

      {Array.from(Array(remain)).map((_) => {
        return <i className="far fa-circle" style={{ color: "grey" }}></i>;
      })}
    </div>
  );
};
