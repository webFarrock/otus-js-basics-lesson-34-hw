import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/common.css";
import { AppComponent } from "./components/AppComponent";
import { addMessage, addMessages } from "./store/actions";
import { store } from "./store";
import { MessageType, observeWithEventSource } from "./api/messages";

const appComponent = new AppComponent(document.getElementById("app") as HTMLElement);

store.subscribe(async () => {
  await appComponent.update();
});

observeWithEventSource((data: any) => {
  // eslint-disable-next-line no-prototype-builtins
  if (data.hasOwnProperty("message")) {
    const message = { ...data, date: new Date(data.date as number).toLocaleString("ru") };
    store.dispatch(addMessage(message));
  } else {
    let messages = Object.values(data) as MessageType[];

    messages = messages
      .filter((el) => !!el.nickname && !!el.message && !!el.date)
      .map((el) => ({
        ...el,
        date: new Date(el.date as number).toLocaleString("ru"),
      }))
      .reverse();

    store.dispatch(addMessages(messages));
  }
});
