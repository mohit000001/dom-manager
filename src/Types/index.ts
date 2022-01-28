interface change {
    type: string,
    name ? : string,
    value: string,
    nodeIndex: number
 }
 interface Action {
     node: HTMLElement,
     changes : change [] 
 }
 
 interface stackChange {
     id: number | string,
     actions: Action[]
 }

 export type {
     change,
     Action,
     stackChange
 }