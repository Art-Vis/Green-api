import { FC } from 'react';
import { BiMessageSquareAdd } from 'react-icons/bi';
import { HiOutlineDotsVertical } from 'react-icons/hi';
import { RiLogoutBoxLine } from 'react-icons/ri';

interface HeaderProps {
	onAddButtonClick: () => void;
	onLogout: () => void;
}

const Header: FC<HeaderProps> = ({ onAddButtonClick, onLogout }) => {
	return (
		<div className='chat-list__header'>
			<h1 className='chat-list__title'>Чаты</h1>
			<div className='chat-list__header-btns'>
				<button
					className='chat-list__header-btn add'
					onClick={onAddButtonClick}
				>
					<BiMessageSquareAdd />
				</button>
				<button className='chat-list__header-btn'>
					<HiOutlineDotsVertical />
				</button>
				<button className='chat-list__header-btn' onClick={onLogout}>
					<RiLogoutBoxLine />
				</button>
			</div>
		</div>
	);
};

export default Header;
