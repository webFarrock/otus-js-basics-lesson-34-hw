import { ChatComponent, IChatComponentState } from "./ChatComponent";
import { sleep } from "../tools/sleep";
import { store } from "../store";
import { logout } from "../store/actions";
import { MessageType, sendMessage } from "../api/messages";

jest.mock("../api/messages");

store.dispatch = jest.fn();
describe("ChatComponent", () => {
  let el: HTMLDivElement;

  beforeEach(() => {
    el = document.createElement("div");
  });

  it("rendering", async () => {
    const state: IChatComponentState = {
      nickname: "",
      messages: [],
    };
    const component = new ChatComponent(el, state);
    await sleep(0);

    expect(el.innerHTML.trim()).toBeFalsy();

    const messages = [
      { nickname: "some_user_1", message: "some_message_1", date: "some_date_1" },
      { nickname: "some_user_2", message: "some_message_2", date: "some_date_2" },
    ];
    component.setState({
      nickname: "John",
      messages,
    });
    await sleep(0);
    expect(el.innerHTML).toContain("John");

    expect(el.querySelector(".js-logout-btn")).toBeTruthy();
    expect(el.querySelector(".js-message-value")).toBeTruthy();
    expect(el.querySelector(".js-send-message")).toBeTruthy();

    const messageList = el.querySelectorAll(".list-group-item");
    expect(messageList.length).toEqual(messageList.length);

    const messagesContainer = el.querySelector(".message-list") as HTMLElement;
    expect(messagesContainer.innerHTML).toContain("some_user_1");
    expect(messagesContainer.innerHTML).toContain("some_user_2");

    expect(messagesContainer.innerHTML).toContain("some_message_1");
    expect(messagesContainer.innerHTML).toContain("some_message_2");

    expect(messagesContainer.innerHTML).toContain("some_date_1");
    expect(messagesContainer.innerHTML).toContain("some_date_2");
  });

  it("logout", async () => {
    const state: IChatComponentState = {
      nickname: "John",
      messages: [],
    };
    new ChatComponent(el, state);
    await sleep(0);

    const logoutBtn = el.querySelector(".js-logout-btn") as HTMLButtonElement;
    logoutBtn.dispatchEvent(new Event("click"));
    expect(store.dispatch).toHaveBeenCalledWith(logout());
  });

  it("send message", async () => {
    const nickname = "John";
    const messageText = "some_message";

    const state: IChatComponentState = {
      nickname,
      messages: [],
    };
    new ChatComponent(el, state);
    await sleep(0);

    const sendBtn = el.querySelector(".js-send-message") as HTMLButtonElement;
    const input = el.querySelector(".js-message-value") as HTMLInputElement;
    input.value = messageText;

    sendBtn.dispatchEvent(new Event("click"));
    const message: MessageType = {
      nickname,
      message: messageText,
    };
    expect(sendMessage).toHaveBeenCalledWith(message);
  });
});
