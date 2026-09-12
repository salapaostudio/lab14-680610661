import type { Registrant } from "../libs/Registrant";

type UserRegisterCardProps = {
  registrant: Registrant;
};

export default function UserRegisterCard({
  registrant,
}: UserRegisterCardProps) {
  const genderLabel =
    registrant.gender === "male" ? "👨 Male" : "👩 Female";
  const registeredExtras = registrant.extraItems ?? [];

  return (
    <article className="card mb-2 shadow-sm">
      <div className="card-body py-3">
        <div className="d-flex justify-content-between gap-3">
          <div>
            <h5 className="card-title mb-1">{registrant.fullName}</h5>
            <p className="card-text text-secondary small mb-2">
              {registrant.plan} · {genderLabel}
            </p>
            <div className="d-flex flex-wrap gap-1">
              {registeredExtras.length > 0 ? (
                registeredExtras.map((item) => (
                  <span className="badge text-bg-light border" key={item}>
                    {item}
                  </span>
                ))
              ) : (
                <span className="text-secondary small">No extra items</span>
              )}
            </div>
          </div>
          <strong className="text-nowrap">
            {registrant.total.toLocaleString()} THB
          </strong>
        </div>
      </div>
    </article>
  );
}
