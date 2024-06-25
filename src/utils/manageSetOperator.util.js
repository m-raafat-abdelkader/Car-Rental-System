import { ObjectId } from "bson";



export default function $Set(object){
    const fields = {};
    for (const key in object) {
    if(object[key] !== undefined && object[key] !== "" ){
            Object.assign(fields, { [key]: object[key] });
        }
    };  
    return fields;
}