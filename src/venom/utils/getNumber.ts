import meta_sanitizer from "meta-sanitizer";
export function getNumber(number:string){
    if(typeof(number)!=="string")
       return "";
    let prefix="55";
    let server="@c.us";
    let useNumber=meta_sanitizer.justNumbers(number,false);
    if(useNumber.length>10 || number.indexOf("+")>-1){
        prefix="";
    }
    return `${prefix}${useNumber}${server}`;
}