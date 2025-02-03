export type AuthData = {
	apiUrl: string;
	idInstance: string;
	apiTokenInstance: string;
	seconds: number;
};

export interface Chat {
	id?: number;
	name: string;
	phone: string;
	lastMessage: string;
	messages: { sender: string; text: string }[];
}
