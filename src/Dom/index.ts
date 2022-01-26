function render(element: any, node: HTMLElement) {

  if (typeof element === "string") {
    node.innerHTML += element;
  }
  else if (typeof element.type === "function") {

    const renderedEles = element.type(element.props);
    render(renderedEles, node);

  }
  else if (typeof element != "string" && !element.type){
    node.innerHTML += element.value;
    element.AddAction(node, [{ type: "textChange" }])
  }
  else {
    const ele = document.createElement(element.type);
    node.appendChild(ele);

    const Attrs = element.props;
    if(Attrs) {
      setAttributes(Attrs, ele);
    }
    let childrens = element.props.children;

    if (childrens && !Array.isArray(childrens)) {
      childrens = [childrens];
    }
    if (childrens && childrens.length > 0) {
        for (let child of childrens) {
          render(child, ele);
        }
    }
  }
}

function setAttributes(Attrs: any, ele: HTMLElement){

  Object.keys(Attrs).forEach(propName => {

    if (propName !== 'children') {

      if (typeof Attrs[propName] === "object") {
        Attrs[propName].AddAction(ele, [{ type: "AttributeChange", name: propName }])
        ele.setAttribute(propName, Attrs[propName].value);
      }
      else {
        propName.startsWith('on') ? ele.addEventListener((propName.slice(2)).toLowerCase(), Attrs[propName]) : ele.setAttribute(propName, Attrs[propName]);
      }
    }

  });
}
export {
  render
}