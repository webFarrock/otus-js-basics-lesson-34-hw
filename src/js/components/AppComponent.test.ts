import { AppComponent } from "./AppComponent";
import { store } from "../store";
import { sleep } from "../tools/sleep";

describe("AppComponent", () => {
  let el: HTMLDivElement;

  beforeEach(() => {
    el = document.createElement("div");
  });

  it("rendering", async () => {
    new AppComponent(el);
    await sleep(0);

    expect(el.querySelector(".app-container")).toBeTruthy();
    expect(el.querySelector("#component-welcome")).toBeTruthy();
    expect(el.querySelector("#component-chat")).toBeTruthy();
  });
});
