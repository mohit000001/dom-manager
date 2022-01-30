import { stackChange, change } from "../Types";
import { render } from "..";
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

    ExecuteUpdates = (Id: number | string, value: any, mapFuns: any[]) => {

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
                        this.ListChange(node, value, mapFuns[change.mapFunId]);
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
    ListChange = (node: HTMLElement, value: any[], mapFun: any) => {
      node.innerHTML = "";
      const elements = value.map(mapFun);
      render(elements, node);
    }
}
const AppStateInstance = new AppStateModal();

class state {
    value:any;
    ChangeId: number | string;
    $$$state: string;
    mapFun: any[];
    LMe:any;
    mapFunCount: number;
    constructor(value:any){
        this.value = value;
        this.$$$state = "dom-manager-state-object";
        this.ChangeId = AppStateInstance.AddChangesStack();
        this.mapFun = []
        this.LMe = this;
        this.mapFunCount = 0;
    }
    AddAction = (node: HTMLElement, actions: change[]) => {
        AppStateInstance.AddAction( node, this.ChangeId, actions);
    }
    setState = (newValue: any) => {
        if(this.value == newValue) {
            return;
        }
        if(Array.isArray(this.value) && [...this.value] === newValue){
            return;
        } // Not working Have to find solution.
        this.value = newValue;
        AppStateInstance.ExecuteUpdates(this.ChangeId, this.value, this.mapFun);
     }
     Map = (fun : any) => {
         this.mapFun[this.mapFunCount] = fun;
         this.mapFunCount++;
         const items = this.value.map(fun);
         return {
             $$$MAPEles: true,
             stateInstance: this.LMe,
             items,
             mapFunId: this.mapFunCount - 1,
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