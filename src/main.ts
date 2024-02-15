import { Stage } from "./stage";
import "./style.css";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <canvas></canvas>
`;

const canvas = document.querySelector("canvas");
if (canvas) {
  canvas.width = (canvas.parentNode as HTMLDivElement)?.clientWidth;
  canvas.height = (canvas.parentNode as HTMLDivElement)?.clientHeight;
  const stage = new Stage(canvas);
  const container = stage.createElement("div");
  const div = stage.createElement("div");
  stage.body.appendChild(container);
  stage.body.style = {
    backgroundColor: "#e4e4e4",
    borderWidth: 0,
    borderColor: "rgba(255,255,255,0)",
  };
  container.appendChild(div);
  container.draggable = true;
  div.style = {
    top: 20,
    left: 20,
    borderColor: "green",
    ":hover": {
      borderColor: "blue",
    },
    ":active": {
      borderColor: "grey",
    },
  };
  div.textContent = "hello";
  setTimeout(() => {
    container.style = {
      top: 50,
      borderColor: "red",
      ":hover": {
        borderColor: "pink",
      },
      ":active": {
        borderColor: "yellow",
        backgroundColor: "red",
      },
    };
  }, 50);
}
