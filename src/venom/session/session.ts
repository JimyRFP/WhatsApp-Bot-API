export function getVenomSessionName(userId:number,sessionNumber:number){
    return `UserId_${userId}_Bot_${sessionNumber}`;
}