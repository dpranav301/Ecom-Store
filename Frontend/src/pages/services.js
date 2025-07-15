import Base from "../Components/Base";

function services() {
  let style = {
    backgroundColor: "orange",
    display: "flex",
    justifyContent: "center",
  };
  return (
    <Base
      title={"This Is Service"}
      buttonEnabled={true}
      buttonColour={"btn-danger"}
    >
      <h1>This is Services Component</h1>
    </Base>
  );
}
export default services;
