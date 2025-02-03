import { FC } from 'react';
import { FaPlus } from 'react-icons/fa';
import { IoSend } from 'react-icons/io5';

interface InputSendMessageProps {
	message: string;
	setMessage: (value: string) => void;
	handleSendMessage: () => void;
}

const InputSendMessage: FC<InputSendMessageProps> = ({
	message,
	setMessage,
	handleSendMessage,
}) => {
	return (
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
			<button className='chat-window__send-btn' onClick={handleSendMessage}>
				<IoSend />
			</button>
		</div>
	);
};
export default InputSendMessage;
