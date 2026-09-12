import { useState } from "react";
import {
  REGISTRANTS_STORAGE_KEY,
  type Registrant,
} from "../libs/Registrant";

// ---- แผนการวิ่ง ----
const plans = [
  { id: "funrun", label: "Fun run 5.5 Km", price: 500 },
  { id: "mini", label: "Mini Marathon 10 Km", price: 800 },
  { id: "half", label: "Half Marathon 21 Km", price: 1200 },
  { id: "full", label: "Full Marathon 42.195 Km", price: 1500 },
];

// ---- สินค้าเสริม ----
const extraItems = [
  { id: "bottle", label: "Bottle 🍼", price: 200 },
  { id: "shoes", label: "Shoes 👟", price: 600 },
  { id: "cap", label: "Cap 🧢", price: 400 },
];

type FormErrors = {
  firstName: boolean;
  lastName: boolean;
  plan: boolean;
  gender: boolean;
};

const initialErrors: FormErrors = {
  firstName: false,
  lastName: false,
  plan: false,
  gender: false,
};

export default function ModalRegister() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [plan, setPlan] = useState("");
  const [gender, setGender] = useState("");
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [errors, setErrors] = useState<FormErrors>(initialErrors);

  const selectedPlan = plans.find((item) => item.id === plan);
  const extrasPrice = extraItems
    .filter((item) => selectedExtras.includes(item.id))
    .reduce((sum, item) => sum + item.price, 0);
  const hasDiscount = selectedExtras.length === extraItems.length;
  const subtotal = (selectedPlan?.price ?? 0) + extrasPrice;
  const total = hasDiscount ? subtotal * 0.8 : subtotal;

  const toggleExtra = (itemId: string) => {
    setSelectedExtras((currentExtras) =>
      currentExtras.includes(itemId)
        ? currentExtras.filter((id) => id !== itemId)
        : [...currentExtras, itemId],
    );
  };

  const readRegistrants = (): Registrant[] => {
    try {
      const savedData = localStorage.getItem(REGISTRANTS_STORAGE_KEY);
      return savedData === null ? [] : (JSON.parse(savedData) as Registrant[]);
    } catch {
      // หากข้อมูลเดิมเสียหาย ให้เริ่มรายการใหม่เพื่อไม่ให้หน้าลงทะเบียนพัง
      return [];
    }
  };

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setPlan("");
    setGender("");
    setSelectedExtras([]);
    setAcceptedTerms(false);
    setErrors(initialErrors);
  };

  const handleRegister = () => {
    // ตรวจเฉพาะช่องที่โจทย์กำหนดก่อนบันทึกข้อมูล
    const nextErrors: FormErrors = {
      firstName: firstName.trim() === "",
      lastName: lastName.trim() === "",
      plan: plan === "",
      gender: gender === "",
    };
    setErrors(nextErrors);

    if (Object.values(nextErrors).some(Boolean) || selectedPlan === undefined) {
      return;
    }

    const registrant: Registrant = {
      id: crypto.randomUUID(),
      fullName: `${firstName.trim()} ${lastName.trim()}`,
      gender,
      plan: selectedPlan.label,
      extraItems: extraItems
        .filter((item) => selectedExtras.includes(item.id))
        .map((item) => item.label),
      total,
    };

    const registrants = readRegistrants();
    localStorage.setItem(
      REGISTRANTS_STORAGE_KEY,
      JSON.stringify([...registrants, registrant]),
    );

    alert(
      `Registration complete. Please pay money for ${total.toLocaleString()} THB.`,
    );
    resetForm();
    document.getElementById("closeRegisterModal")?.click();
  };

  return (
    <div
      className="modal fade"
      id="modalregister"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabIndex={-1}
      aria-labelledby="modalregisterLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content shadow">
          <div className="modal-header">
            <h5 className="modal-title" id="modalregisterLabel">
              Register CMU Marathon 🏃‍♂️
            </h5>
            <button
              id="closeRegisterModal"
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>

          <div className="modal-body">
            <div className="row g-2">
              <div className="col-sm-6">
                <label htmlFor="firstName" className="form-label">
                  First name
                </label>
                <input
                  id="firstName"
                  className={`form-control ${errors.firstName ? "is-invalid" : ""}`}
                  value={firstName}
                  onChange={(event) => {
                    setFirstName(event.target.value);
                    setErrors((current) => ({ ...current, firstName: false }));
                  }}
                />
                {errors.firstName && (
                  <div className="invalid-feedback">Invalid first name</div>
                )}
              </div>
              <div className="col-sm-6">
                <label htmlFor="lastName" className="form-label">
                  Last name
                </label>
                <input
                  id="lastName"
                  className={`form-control ${errors.lastName ? "is-invalid" : ""}`}
                  value={lastName}
                  onChange={(event) => {
                    setLastName(event.target.value);
                    setErrors((current) => ({ ...current, lastName: false }));
                  }}
                />
                {errors.lastName && (
                  <div className="invalid-feedback">Invalid last name</div>
                )}
              </div>
            </div>

            <div className="mt-2">
              <label htmlFor="plan" className="form-label">
                Plan
              </label>
              <select
                id="plan"
                className={`form-select ${errors.plan ? "is-invalid" : ""}`}
                value={plan}
                onChange={(event) => {
                  setPlan(event.target.value);
                  setErrors((current) => ({ ...current, plan: false }));
                }}
              >
                <option value="">Please select..</option>
                {plans.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label} ({item.price.toLocaleString()} THB)
                  </option>
                ))}
              </select>
              {errors.plan && (
                <div className="invalid-feedback">Please select a Plan</div>
              )}
            </div>

            <fieldset className="mt-2">
              <legend className="fs-6 mb-1">Gender</legend>
              <div className={errors.gender ? "text-danger" : ""}>
                <input
                  id="male"
                  className="me-2 form-check-input"
                  type="radio"
                  name="gender"
                  value="male"
                  checked={gender === "male"}
                  onChange={(event) => {
                    setGender(event.target.value);
                    setErrors((current) => ({ ...current, gender: false }));
                  }}
                />
                <label htmlFor="male" className="me-3">
                  Male 👨
                </label>
                <input
                  id="female"
                  className="me-2 form-check-input"
                  type="radio"
                  name="gender"
                  value="female"
                  checked={gender === "female"}
                  onChange={(event) => {
                    setGender(event.target.value);
                    setErrors((current) => ({ ...current, gender: false }));
                  }}
                />
                <label htmlFor="female">Female 👩</label>
              </div>
              {errors.gender && (
                <div className="text-danger small">Please select gender</div>
              )}
            </fieldset>

            <fieldset className="mt-2">
              <legend className="fs-6 mb-1">Extra Item(s)</legend>
              {extraItems.map((item) => (
                <div className="form-check" key={item.id}>
                  <input
                    id={item.id}
                    className="form-check-input"
                    type="checkbox"
                    checked={selectedExtras.includes(item.id)}
                    onChange={() => toggleExtra(item.id)}
                  />
                  <label htmlFor={item.id} className="form-check-label">
                    {item.label} ({item.price.toLocaleString()} THB)
                  </label>
                </div>
              ))}
              {hasDiscount && (
                <span className="text-success d-block">(20% Discounted)</span>
              )}
            </fieldset>

            <div className="alert alert-primary mt-3" role="alert">
              Promotion📢 Buy all items to get 20% Discount
            </div>

            <div className="fw-semibold">
              Total Payment : {total.toLocaleString()} THB
            </div>
          </div>

          <div className="modal-footer">
            <div className="form-check me-auto">
              <input
                id="acceptedTerms"
                className="form-check-input"
                type="checkbox"
                checked={acceptedTerms}
                onChange={(event) => setAcceptedTerms(event.target.checked)}
              />
              <label htmlFor="acceptedTerms" className="form-check-label">
                I agree to the terms and conditions
              </label>
            </div>
            <button
              type="button"
              className="btn btn-success my-2"
              disabled={!acceptedTerms}
              onClick={handleRegister}
            >
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
