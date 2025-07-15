import Base from "../../Components/Base";

function about() {
  let style = {
    backgroundColor: "purple",
    display: "flex",
    justifyContent: "center",
  };
  return (
    <Base title="/about" buttonEnabled={true} buttonColour={"btn-success"}>
      <div className="container" style={style}>
        <h1>This is About Component</h1>
      </div>
    </Base>
  );
}
export default about;
