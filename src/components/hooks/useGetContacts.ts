import axios from 'axios';
import { API_PARAMS } from '../utils/constants';
import { useState, useEffect } from 'react';
import axiosRateLimit from 'axios-rate-limit';

const useGetContacts = () => {
	const { apiUrl, idInstance, apiTokenInstance } = API_PARAMS;
	const [contacts, setContacts] = useState<any[]>([]); // Стейт для хранения контактов

	const axiosInstance = axiosRateLimit(axios.create(), {
		maxRequests: 1,
		perMilliseconds: 1000,
	});
	useEffect(() => {
		const fetchContacts = async () => {
			try {
				const response = await axiosInstance.post(
					`${apiUrl}/waInstance${idInstance}/getContacts/${apiTokenInstance}`
				);

				const data = response.data;
				setContacts(data); // Сохраняем данные в стейт
			} catch (error) {
				console.error('Error fetching contacts:', error);
			}
		};

		fetchContacts();
	}, [apiUrl, idInstance, apiTokenInstance]);

	return contacts; // Возвращаем список контактов
};

export default useGetContacts;
