import ModalRegister from "../components/ModalRegister";

export default function HomePage() {
  return (
    <div className="col-12 mt-4 p-0">
      <div className="container text-center">
        <h2>Welcome To CMU Marathon</h2>
        <div>
          <img src="/marathonrun.png" alt="Logo CMU Marathon" />
        </div>
        <button
          type="button"
          className="m-4 btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#modalregister"
        >
          Register
        </button>
        <ModalRegister />
      </div>
    </div>
  );
}
