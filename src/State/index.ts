import { stackChange, change } from "../Types";

class AppStateModal {

    changesStack : stackChange [];
    Ids: (number | string) [];

    constructor() {
        this.changesStack = [];
        this.Ids = [];
    }

    AddChangesStack = () : number | string => {
      const ID = this.generateUniqueId();
      this.changesStack.push({
          id: ID,
          actions: []
      })
      return ID;
    }
    
    AddAction = (Node: HTMLElement, Id: number | string , actions : change[]) => {

        const Index = this.changesStack.findIndex( change => change.id === Id);
        this.changesStack[Index].actions.push({
          node: Node,
          changes: actions
        })

    } 
    generateUniqueId = () : number | string => {
        this.Ids.push(this.Ids.length)
        return this.Ids.length;
    }

    ExecuteUpdates = (Id: number | string, value: any) => {

        const Index = this.changesStack.findIndex( change => change.id === Id);
        const actions = this.changesStack[Index].actions;

        for(let action of actions) {
            const node = action.node;
            const changes = action.changes;

            for(let change of changes) {
               switch(change.type) {

                  case "textChange" : this.TextChange(node, value, change.nodeIndex)
                  break;

                  case "htmlChange" : this.innerHtmlChange(node, value)
                  break;

                  case "AttributeChange" : {
                      if(change.name) {
                        this.AttributeChange(node, value, change.name)
                      }
                  }
                  break;
                  
                  case "ListChange": {
                        this.ListChange(node, value);
                  }

                  default : 
                  break;
               }
            }
        }
    } 

    TextChange = (node: HTMLElement, value: string, nodeIndex: number) => {
        const textNode = document.createTextNode(value)
        if(node.childNodes.length > 0) {
            node.replaceChild(textNode, node.childNodes[nodeIndex]);
            return;
        }   
        node.appendChild(textNode);
    }
    
    innerHtmlChange = (node: HTMLElement, value: string) => {
        node.innerHTML = value;
    }

    AttributeChange = (node: HTMLElement, value: string, name: string) => {
        node.setAttribute(name, value);
    }
    ListChange = (node: HTMLElement, value: any[]) => {
    
      node.innerHTML = "";
      for(let i=0; i < value.length; i++){
        const textNode = document.createTextNode(value[i]);
        node.appendChild(textNode);
      }
    }
}
const AppStateInstance = new AppStateModal();

class state {
    value:any;
    ChangeId: number | string;
    $$$state: string;
    mapFun: any[];
    LMe:any;
    constructor(value:any){
        this.value = value;
        this.$$$state = "dom-manager-state-object";
        this.ChangeId = AppStateInstance.AddChangesStack();
        this.mapFun = []
        this.LMe = this;
    }
    AddAction = (node: HTMLElement, actions: change[]) => {

        AppStateInstance.AddAction( node, this.ChangeId, actions);
    }

    setState = (newValue: any) => {
        if(this.value == newValue) {
            return;
        }
        this.value = newValue;
        AppStateInstance.ExecuteUpdates(this.ChangeId, this.value);
     }
     Map = (fun : any) => {
         const items = this.value.map(fun);
         return {
             $$$MAPEles: true,
             stateInstance: this.LMe,
             items
         }
     }

}
function createState(intailValue: any) {
    
    const newState = new state(intailValue)
    return newState;
}

export {
    createState,
}