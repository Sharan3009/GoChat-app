// definition of the interface 

export interface Room {
    roomId?: string,
    roomName: string,
    capacity: number,
    ownerId: string,
    ownerName:string,
    joinees?: [{userId,userName}],
}