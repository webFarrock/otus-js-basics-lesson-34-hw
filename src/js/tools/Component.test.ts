import { Component } from "./Component";
import { IEvents } from "../components/IEvents";

const sleep = (x: number) => new Promise((r) => setTimeout(r, x));

describe("Component", () => {
  let el: HTMLDivElement;
  beforeEach(() => {
    el = document.createElement("div");
  });

  it("is a class", () => {
    expect(Component).toBeInstanceOf(Function);
  });

  it("renders on instantiating", async () => {
    const text = `${Math.random()}`;

    class TestComponent extends Component<Record<string, never>> {
      templateOptions = {};
      template = "";

      render() {
        return `<h1>${text}</h1>`;
      }
    }

    new TestComponent(el);
    await sleep(0);

    expect(el.innerHTML).toBe(`<h1>${text}</h1>`);
  });

  it("renders on instantiating with state props", async () => {
    const text = `${Math.random()}`;
    interface iComponentState {
      text: string;
    }

    class TestComponent extends Component<IEvents, iComponentState> {
      templateOptions = {};
      template = "";
      state: iComponentState = {
        text: text,
      };
      render() {
        return `<h1>${this.state.text}</h1>`;
      }
    }

    new TestComponent(el);
    await sleep(0);

    expect(el.innerHTML).toBe(`<h1>${text}</h1>`);
  });

  it("updates component view on setState call", async () => {
    const a = `${Math.random()}`;
    const b1 = `${Math.random()}`;
    interface iComponentState {
      a: string;
      b: string;
    }

    class TestComponent extends Component<IEvents, iComponentState> {
      templateOptions = {};
      template = "";

      state: iComponentState = {
        a: a,
        b: b1,
      };
      render() {
        return `${JSON.stringify(this.state)}`;
      }
    }
    const item = new TestComponent(el);
    await sleep(0);

    expect(el.innerHTML).toBe(`${JSON.stringify({ a, b: b1 })}`);

    const b2 = `${Math.random()}`;
    item.setState({ b: b2 });
    expect(el.innerHTML).toBe(`${JSON.stringify({ a, b: b2 })}`);
  });

  it("calls methods based on events definition", async () => {
    const value = Math.floor(Math.random() * 100);
    interface iComponentState {
      value: number;
    }

    class TestComponent extends Component<IEvents, iComponentState> {
      templateOptions = {};
      template = "";

      state: iComponentState = {
        value: value,
      };

      increase = () => this.setState({ value: this.state.value + 1 });
      decrease = () => this.setState({ value: this.state.value - 1 });

      events = {
        "click@.inc": this.increase,
        "click@input.dec": this.decrease,
      };

      render() {
        return `
          <h1>${this.state.value}</h1>
          <button class="inc">+</button>
          <input type="button" class="dec" value="-" />
        `;
      }
    }
    const item = new TestComponent(el);
    jest.spyOn(item, "increase");
    jest.spyOn(item, "decrease");
    await sleep(0);

    expect(item.state.value).toBe(value);
    expect((el.querySelector("h1") as HTMLDivElement).innerHTML).toBe(`${value}`);

    (el.querySelector(".inc") as HTMLButtonElement).dispatchEvent(new Event("click"));

    // expect(increaseSpy).toHaveBeenCalled(); ???
    expect(item.state.value).toBe(value + 1);
    expect((el.querySelector("h1") as HTMLDivElement).innerHTML).toBe(`${value + 1}`);

    (el.querySelector(".dec") as HTMLButtonElement).dispatchEvent(new Event("click"));
    (el.querySelector(".dec") as HTMLButtonElement).dispatchEvent(new Event("click"));
    expect(item.state.value).toBe(value - 1);
    expect((el.querySelector("h1") as HTMLDivElement).innerHTML).toBe(`${value - 1}`);
  });
});
