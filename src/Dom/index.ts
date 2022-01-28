function render(element: any, node: HTMLElement) {

  if (typeof element === "string") {
    const textNode = document.createTextNode(element)
    node.appendChild(textNode);
  }
  else if (typeof element.type === "function") {

    if(Boolean(element.type.prototype) && Boolean(element.type.prototype.isReactComponent)){
        const newClsInstance = new element.type(element.props);
        const renderedEles = newClsInstance.render();
        render(renderedEles, node);
    } // Class component
    else {
      const renderedEles = new element.type(element.props);
      render(renderedEles, node);
    } // functional component
  }
  else if (typeof element != "string" && "$$$state" in element ){

    const childNodeIndex = node.childNodes.length;
    element.AddAction(node, [{ type: "textChange", nodeIndex: childNodeIndex}])

    const textNode = document.createTextNode(element.value);
    node.appendChild(textNode);
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

      if (Attrs[propName] && typeof Attrs[propName] === "object" && "$$$state" in Attrs[propName]) {
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