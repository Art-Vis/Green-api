import { useState, useEffect, useRef, FC } from 'react';
import axios from 'axios';
import './MessageReceiver.css';
import { AuthData } from '../type/interface';

interface MessageReceiverProps {
	authData: AuthData;
}

const MessageReceiver: FC<MessageReceiverProps> = ({ authData }) => {
	const [receivedMessages, setReceivedMessages] = useState<
		{ text: string; isMyMessage: boolean }[]
	>([]);
	const receivedMessagesRef = useRef<string[]>([]);
	const { apiUrl, idInstance, apiTokenInstance, seconds } = authData;

	useEffect(() => {
		const fetchMessages = async () => {
			try {
				const response = await axios.get(
					`${apiUrl}/waInstance${idInstance}/receiveNotification/${apiTokenInstance}?receiveTimeout=${seconds}`
				);
				const message = response.data;

				if (!message) return;

				const receiptId = message.receiptId;
				const incomingMessage =
					message?.body?.messageData?.textMessageData?.textMessage;
				const chatName = message?.body?.senderData?.chatName;
				const senderId = message?.body?.senderData?.sender;
				const idInstanceWid = message?.body?.instanceData?.wid;
				if (
					incomingMessage &&
					!receivedMessagesRef.current.includes(incomingMessage)
				) {
					setReceivedMessages(prevMessages => [
						...prevMessages,
						{
							text: `${chatName}: ${incomingMessage}`,
							isMyMessage: idInstanceWid === senderId,
						},
					]);
					receivedMessagesRef.current = [
						...receivedMessagesRef.current,
						incomingMessage,
					];
				}
				await axios.delete(
					`${apiUrl}/waInstance${idInstance}/deleteNotification/${apiTokenInstance}/${receiptId}`
				);
			} catch (error) {
				console.error('Error fetching messages:', error);
			}
		};

		const intervalId = setInterval(fetchMessages, 5000);

		return () => clearInterval(intervalId);
	}, []);

	return (
		<div className='chat-window__loading-message'>
			{receivedMessages.map((msg, index) => (
				<p
					className={`chat-window__message ${
						msg.isMyMessage
							? 'chat-window__message-my'
							: 'chat-window__message-sender'
					}`}
					key={index}
				>
					{msg.text}
				</p>
			))}
		</div>
	);
};

export default MessageReceiver;
