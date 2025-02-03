import { useState } from 'react';
import { Link } from 'react-router-dom';
import './AuthForm.css';

type AuthFormProps = {
	onAuthSuccess: (authData: {
		apiUrl: string;
		idInstance: string;
		apiTokenInstance: string;
		seconds: number;
	}) => void;
};

const AuthForm: React.FC<AuthFormProps> = ({ onAuthSuccess }) => {
	const [authData, setAuthData] = useState({
		apiUrl: '',
		idInstance: '',
		apiTokenInstance: '',
		seconds: 15,
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setAuthData({ ...authData, [name]: value });
	};

	const handleLogin = () => {
		if (authData.apiUrl && authData.idInstance && authData.apiTokenInstance) {
			onAuthSuccess(authData);
			localStorage.setItem('key', JSON.stringify(authData));
		} else {
			return;
		}
	};

	return (
		<fieldset className='auth-container'>
			<label>
				API URL
				<input
					type='text'
					name='apiUrl'
					value={authData.apiUrl}
					onChange={handleChange}
				/>
			</label>
			<label>
				ID Instance
				<input
					type='text'
					name='idInstance'
					value={authData.idInstance}
					onChange={handleChange}
				/>
			</label>
			<label>
				API Token Instance
				<input
					type='text'
					name='apiTokenInstance'
					value={authData.apiTokenInstance}
					onChange={handleChange}
				/>
			</label>
			<button onClick={handleLogin}>
				<Link to={'/'}>Войти</Link>
			</button>
		</fieldset>
	);
};

export default AuthForm;
