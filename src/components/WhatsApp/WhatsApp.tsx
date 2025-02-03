import { useState } from 'react';
import './WhatsApp.css';
import iconProfile from '@assets/zagl.png';
import axios from 'axios';
import AddNewContact from './AddNewContact/AddNewContact';
import MessageReceiver from '../MessageReceiver/MessageReceiver';
import Header from './Header/Header';
import Search from './Search/Search';
import ChatList from './ChatList/ChatList';
import ChatWindowHeader from './ChatWindowHeader/ChatWindowHeader';
import InputSendMessage from './InputSendMessage/InputSendMessage';
import { AuthData, Chat } from '../type/interface';

interface WhatsAppProps {
	authData: AuthData;
	onLogout: () => void;
}

const WhatsApp: React.FC<WhatsAppProps> = ({ authData, onLogout }) => {
	const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
	const [isInputState, setIsInputState] = useState<boolean>(false);
	const [message, setMessage] = useState('');
	const [chatMessages, setChatMessages] = useState<string[]>([]);
	const [phoneNumber, setPhoneNumber] = useState('');
	const [showAddNewContact, setShowAddNewContact] = useState(false);
	const [chats, setChats] = useState<Chat[]>([]);

	const { apiUrl, idInstance, apiTokenInstance } = authData;

	const handleAddButtonClick = () => {
		setShowAddNewContact(!showAddNewContact);
	};

	const handleAddContact = (phone: string) => {
		const newChat: Chat = {
			id: chats.length + 1,
			name: `${phone}`,
			phone: `${phone}`,
			lastMessage: '',
			messages: [],
		};
		setPhoneNumber(newChat.phone);
		setChats([...chats, newChat]);
		setShowAddNewContact(false);
	};

	const handleSendMessage = async () => {
		if (!message || !phoneNumber) return;

		try {
			await axios.post(
				`${apiUrl}/waInstance${idInstance}/sendMessage/${apiTokenInstance}`,
				{
					chatId: `${phoneNumber}@c.us`,
					message: message,
				},
				{
					headers: {
						'Content-Type': 'application/json',
					},
				}
			);

			const updatedChat: Chat = {
				...selectedChat,
				id: selectedChat?.id ?? Date.now(),
				name: selectedChat?.name ?? 'Неизвестный',
				phone: selectedChat?.phone ?? '',
				messages: [
					...(selectedChat?.messages || []),
					{ sender: 'Me', text: message },
				],
				lastMessage: message,
			};

			const updatedChats = chats.map(chat =>
				chat.id === selectedChat?.id ? updatedChat : chat
			);

			setChatMessages([...chatMessages, `You: ${message}`]);
			setChats(updatedChats);
			setSelectedChat(updatedChat);
			setMessage('');
		} catch (error) {
			console.error(`${error}`);
		}
	};

	const handleFocus = () => {
		setIsInputState(true);
	};

	const handleBlur = () => {
		setIsInputState(false);
	};

	return (
		<div className='chat'>
			{showAddNewContact ? (
				<AddNewContact
					onAddContact={handleAddContact}
					onClose={() => setShowAddNewContact(false)}
				/>
			) : (
				<div className='chat-list'>
					<Header onAddButtonClick={handleAddButtonClick} onLogout={onLogout} />
					<Search
						isInputState={isInputState}
						handleBlur={handleBlur}
						handleFocus={handleFocus}
					/>
					<ChatList
						chats={chats}
						setSelectedChat={setSelectedChat}
						iconProfile={iconProfile}
					/>
				</div>
			)}

			<div className='chat-window'>
				{selectedChat ? (
					<>
						<ChatWindowHeader
							iconProfile={iconProfile}
							selectedChat={selectedChat}
						/>
						<div className='chat-window__messages'>
							<MessageReceiver authData={authData} />
							<p className='chat-window__message chat-window__message-my'>
								{selectedChat.lastMessage}
							</p>
						</div>
						<InputSendMessage
							handleSendMessage={handleSendMessage}
							message={message}
							setMessage={setMessage}
						/>
					</>
				) : (
					<p className='chat-window__default-message'>Выберите чат</p>
				)}
			</div>
		</div>
	);
};

export default WhatsApp;
