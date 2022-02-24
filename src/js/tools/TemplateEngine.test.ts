import { TemplateEngine } from "./TemplateEngine";

describe("TemplateEngine", () => {
  it("render template with options", () => {
    const options = {
      titleListOne: "Here is some listOne: ",
      listOne: ["item 1", "item 2", "item 3"],
      showListOne: true,
      titleListTwo: "Here is some listTwo: ",
      listTwo: ["ItemOne", "ItemTwo", "ItemThree"],
      showListTwo: false,
    };

    const template = `
  <?if(showListOne) {?>
    <h1><?titleListOne?></h1>
    <ul>
      <?for(let index in listOne) {?>
        <li><?listOne[index]?></li>
      <?}?>
    </ul>
  <?} else {?>
    <div>list one is hidden</div>
  <?}?>
  
  <?if(showListTwo) {?>
    <h1><?titleListTwo?></h1>
    <ul>
      <?for(let index in listTwo) {?>
        <li><?listTwo[index]?></li>
      <?}?>
    </ul>
  <?} else {?>
    <div>list two is hidden</div>
  <?}?>`;

    const rendered = new TemplateEngine(template, options).render();

    expect(rendered).toEqual(expect.stringContaining("Here is some listOne:"));
    expect(rendered).toEqual(expect.stringContaining("item 1"));
    expect(rendered).toEqual(expect.stringContaining("item 2"));
    expect(rendered).toEqual(expect.stringContaining("item 3"));
    expect(rendered).toEqual(expect.stringContaining("list two is hidden"));

    expect(rendered).toEqual(expect.not.stringContaining("Here is some listTwo:"));
    expect(rendered).toEqual(expect.not.stringContaining("ItemOne"));
    expect(rendered).toEqual(expect.not.stringContaining("ItemTwo"));
    expect(rendered).toEqual(expect.not.stringContaining("ItemThree"));
    expect(rendered).toEqual(expect.not.stringContaining("list one is hidden"));
  });

  it("render template without vars and options", () => {
    const template = `Hello, world`;
    expect(new TemplateEngine(template).render()).toEqual(template);
  });

  it("render template without correct options", () => {
    const template = `Hello, <? someVar ?>`;
    expect(() => new TemplateEngine(template).render()).toThrowError();
  });
});
