import { FaArrowLeft } from 'react-icons/fa';
import './AddNewContact.css';
import { FC, useState } from 'react';
import { GoSearch } from 'react-icons/go';

interface AddNewContactProps {
	onAddContact: (phone: string) => void;
	onClose: () => void;
}

const AddNewContact: FC<AddNewContactProps> = ({ onAddContact, onClose }) => {
	const [phoneNumber, setPhoneNumber] = useState('');

	const handleAdd = () => {
		if (phoneNumber.trim()) {
			onAddContact(phoneNumber.trim());
		}
	};

	return (
		<div className='chat-add'>
			<div className='chat-add__header'>
				<button className='chat-add__header-btn' onClick={onClose}>
					<FaArrowLeft className='chat-add__header-svg' />
				</button>
				<h1 className='chat-add__header-title'>Новый чат</h1>
			</div>
			<label className='chat-add__search-label' htmlFor='addInput'>
				<GoSearch className='chat-add__search-svg' />
				<input
					className='chat-add__search-input'
					id='addInput'
					type='text'
					value={phoneNumber}
					onChange={e => setPhoneNumber(e.target.value)}
					placeholder='Введите номер телефона'
				/>
			</label>
			<button className='chat-add__btn' onClick={handleAdd}>
				Добавить
			</button>
		</div>
	);
};

export default AddNewContact;
