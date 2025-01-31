import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { API_PARAMS } from '../utils/constants';

const MessageReceiver = () => {
	const [receivedMessages, setReceivedMessages] = useState<string[]>([]);
	const receivedMessagesRef = useRef<string[]>([]);
	const { apiUrl, idInstance, apiTokenInstance, seconds } = API_PARAMS;

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

				if (
					incomingMessage &&
					!receivedMessagesRef.current.includes(incomingMessage)
				) {
					setReceivedMessages(prevMessages => [
						...prevMessages,
						`${chatName}: ${incomingMessage}`,
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
		<div>
			{receivedMessages.map((msg, index) => (
				<p
					className='chat-window__message chat-window__message-sender'
					key={index}
				>
					{msg}
				</p>
			))}
		</div>
	);
};

export default MessageReceiver;
