// definition of the interface 

export interface ChatMessage {
    chatId?: string,
    message: string,
    createdOn: Date,
    senderId: string,
    senderName: string,
    chatRoom: string
    
}