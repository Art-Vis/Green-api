import { useState } from 'react';
import './WhatsApp.css';
import iconProfile from '@assets/zagl.png';
import { GoSearch } from 'react-icons/go';
import { FaArrowLeft } from 'react-icons/fa';
import { HiOutlineDotsVertical } from 'react-icons/hi';
import { FaPlus } from 'react-icons/fa6';
import { IoSend } from 'react-icons/io5';
import { API_PARAMS } from '../utils/constants';
import axios from 'axios';
import { BiMessageSquareAdd } from 'react-icons/bi';
import AddNewContact from './AddNewContact/AddNewContact';
import MessageReceiver from '../MessageReceiver/MessageReceiver';
import useGetContacts from '../hooks/useGetContacts';

interface Chat {
	id?: number;
	name: string;
	phone: string;
	lastMessage: string;
	messages: { sender: string; text: string }[];
}

const WhatsApp: React.FC = () => {
	const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
	const [isInputState, setIsInputState] = useState<boolean>(false);
	const [message, setMessage] = useState('');
	const [chatMessages, setChatMessages] = useState<string[]>([]);
	const [phoneNumber, setPhoneNumber] = useState('');
	const [showAddNewContact, setShowAddNewContact] = useState(false);
	const [chats, setChats] = useState<Chat[]>([]);

	const { apiUrl, idInstance, apiTokenInstance } = API_PARAMS;
	// const contacts = useGetContacts(); // ПОЛУЧИТЬ СПИСОК КОНТАКТОВ

	const handleAddButtonClick = () => {
		setShowAddNewContact(!showAddNewContact);
	};

	const handleAddContact = (phone: string) => {
		// Добавляем новый контакт
		const newChat: Chat = {
			id: chats.length + 1,
			name: `${phone}`,
			phone: `${phone}`, // Можно добавить функционал для имени
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
			const response = await axios.post(
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
		<div className='container'>
			{showAddNewContact ? (
				<AddNewContact
					onAddContact={handleAddContact}
					onClose={() => setShowAddNewContact(false)}
				/>
			) : (
				<div className='chat-list'>
					<div className='chat-list__header'>
						<h1 className='chat-list__title'>Чаты</h1>
						<div className='chat-list__header-btns'>
							<button
								className='chat-list__header-btn add'
								onClick={handleAddButtonClick}
							>
								<BiMessageSquareAdd />
							</button>
							<button className='chat-list__header-btn'>
								<HiOutlineDotsVertical />
							</button>
						</div>
					</div>
					<label className='chat-list__search-label' htmlFor='searchInput'>
						{isInputState ? (
							<FaArrowLeft className='chat-list__search-svg green' />
						) : (
							<GoSearch className='chat-list__search-svg' />
						)}
						<input
							className='chat-list__search-input'
							id='searchInput'
							type='search'
							placeholder='Поиск'
							onFocus={handleFocus}
							onBlur={handleBlur}
						/>
					</label>
					<div className='chat-list__items'>
						{chats.map(chat => (
							<div
								key={chat.id}
								onClick={() => setSelectedChat(chat)}
								className='chat-list__item'
							>
								<img
									className='chat-list__item-avatar'
									src={iconProfile}
									alt=''
								/>
								<div className='chat-list__item-info'>
									<strong className='chat-list__item-name'>{chat.name}</strong>
									<p className='chat-list__item-message'>{chat.lastMessage}</p>
								</div>
								<span className='chat-list__item-time'>10:42</span>
							</div>
						))}
					</div>
				</div>
			)}

			{/* Окно чата */}
			<div className='chat-window'>
				{selectedChat ? (
					<>
						<div className='chat-window__header'>
							<div className='chat-window__header-wrap'>
								<img className='chat-window__avatar' src={iconProfile} alt='' />
								<h2 className='chat-window__name'>{selectedChat.name}</h2>
							</div>

							<div className='chat-window__header-btns'>
								<button className='chat-window__header-btn'>
									<GoSearch />
								</button>
								<button className='chat-window__header-btn'>
									<HiOutlineDotsVertical />
								</button>
							</div>
						</div>
						<div className='chat-window__messages'>
							<MessageReceiver />
							<p className='chat-window__message chat-window__message-my'>
								{selectedChat.lastMessage}
							</p>
						</div>
						<div className='chat-window__send'>
							<button className='chat-window__send-btn'>
								<FaPlus />
							</button>
							<textarea
								className='chat-window__input'
								value={message}
								onChange={e => setMessage(e.target.value)}
								placeholder='Введите сообщение'
							/>
							<button
								className='chat-window__send-btn'
								onClick={handleSendMessage}
							>
								<IoSend />
							</button>
						</div>
					</>
				) : (
					<p className='chat-window__default-message'>Выберите чат</p>
				)}
			</div>
		</div>
	);
};

export default WhatsApp;
