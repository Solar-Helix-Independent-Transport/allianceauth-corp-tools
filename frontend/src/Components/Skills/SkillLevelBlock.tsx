export const SkillLevelBlock = ({
  level,
  active = 0,
  trained = 0,
  queued = 0,
}: {
  level: number;
  active?: number;
  trained?: number;
  queued?: number;
}) => {
  const trained_inactive = trained - active;
  const baseline = Math.max(active, trained);
  const missing = Math.max(0, level - baseline);
  // How much of the missing gap is already covered by the skill queue -
  // callers that have nothing better than "level" to offer (e.g. the skill
  // queue page itself, where level IS the queued target) pass queued=level
  // so the whole gap reads as queued rather than missing.
  const queuedCount = Math.max(0, Math.min(queued, level) - baseline);
  const stillMissing = missing - queuedCount;
  const remain = 5 - Math.max(level, active, trained);
  return (
    <div className=" text-no-wrap">
      {Array.from(Array(active)).map((_) => {
        return <i className="fas fa-circle"></i>;
      })}

      {trained_inactive > 0 ? (
        Array.from(Array(trained_inactive)).map((_) => {
          return <i className="fas fa-circle text-success"></i>;
        })
      ) : (
        <></>
      )}

      {queuedCount > 0 ? (
        Array.from(Array(queuedCount)).map((_) => {
          return <i className="fas fa-circle text-warning"></i>;
        })
      ) : (
        <></>
      )}

      {stillMissing > 0 ? (
        Array.from(Array(stillMissing)).map((_) => {
          return <i className="fas fa-circle text-danger"></i>;
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
