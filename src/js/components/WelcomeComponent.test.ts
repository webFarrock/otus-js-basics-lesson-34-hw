import { IWelcomeComponentState, WelcomeComponent } from "./WelcomeComponent";
import { store } from "../store";
import { login } from "../store/actions";
import { sleep } from "../tools/sleep";

store.dispatch = jest.fn();
window.alert = jest.fn();

describe("WelcomeComponent", () => {
  let el: HTMLDivElement;

  beforeEach(() => {
    el = document.createElement("div");
  });

  it("render with initial state - component visible", async () => {
    const welcomeState: IWelcomeComponentState = {
      nickname: "",
    };
    new WelcomeComponent(el, welcomeState);
    await sleep(0);

    expect(el.querySelector(".app-container")).toBeTruthy();
  });

  it("render with initial state - component not visible", async () => {
    const welcomeState: IWelcomeComponentState = {
      nickname: "some_user",
    };
    new WelcomeComponent(el, welcomeState);
    await sleep(0);

    expect(el.querySelector(".app-container")).toBeFalsy();
  });

  it("precess enter nickname", async () => {
    const welcomeState: IWelcomeComponentState = {
      nickname: "",
    };
    new WelcomeComponent(el, welcomeState);
    await sleep(0);

    const input = el.querySelector("#js-nickname-input") as HTMLInputElement;
    const btn = el.querySelector(".js-submit-btn") as HTMLButtonElement;

    btn.dispatchEvent(new Event("click"));
    expect(window.alert).toHaveBeenCalledWith(WelcomeComponent.MSG_EMPTY_NICKNAME);

    const nicknameOne = "some_user_one";
    input.value = nicknameOne;
    btn.dispatchEvent(new Event("click"));
    expect(store.dispatch).toHaveBeenCalledWith(login(nicknameOne));

    const nicknameTwo = "some_user_two";
    input.value = nicknameTwo;
    input.dispatchEvent(new KeyboardEvent("keyup", { code: "Enter" }));
    expect(store.dispatch).toHaveBeenCalledWith(login(nicknameTwo));
  });
});
