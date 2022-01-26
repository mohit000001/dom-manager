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

                  case "textChange" : this.TextChange(node, value)
                  break;

                  case "htmlChange" : this.innerHtmlChange(node, value)
                  break;

                  case "AttributeChange" : {
                      if(change.name) {
                        this.AttributeChange(node, value, change.name)
                      }
                  }
                  break;

                  default : 
                  break;
               }
            }
        }
    } 

    TextChange = (node: HTMLElement, value: string) => {
        node.innerHTML = value;
    }
    
    innerHtmlChange = (node: HTMLElement, value: string) => {
        node.innerHTML = value;
    }

    AttributeChange = (node: HTMLElement, value: string, name: string) => {
        node.setAttribute(name, value);
    }

}
const AppStateInstance = new AppStateModal();

class state {
    value:any;
    ChangeId: number | string;
    $$$state: string;
    constructor(value:any){
        this.value = value;
        this.$$$state = "dom-manager-state-object";
        this.ChangeId = AppStateInstance.AddChangesStack();
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

}
function createState(intailValue: any) {
    
    const newState = new state(intailValue)
    return newState;
}

export {
    createState,
}