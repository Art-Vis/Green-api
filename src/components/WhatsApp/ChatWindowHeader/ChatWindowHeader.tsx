import { GoSearch } from 'react-icons/go';
import { HiOutlineDotsVertical } from 'react-icons/hi';
import { FC } from 'react';
import { Chat } from '../../type/interface';

interface ChatWindowHeaderProps {
	selectedChat: Chat;
	iconProfile: string;
}

const ChatWindowHeader: FC<ChatWindowHeaderProps> = ({
	selectedChat,
	iconProfile,
}) => {
	return (
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
	);
};

export default ChatWindowHeader;
