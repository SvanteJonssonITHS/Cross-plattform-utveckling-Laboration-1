// Dependencies
import dayjs from 'dayjs';
import calendar from 'dayjs/plugin/calendar';
import { io } from 'socket.io-client';
import styled from 'styled-components';

// Middleware
dayjs.extend(calendar);

// Variable declaration
const socket = io();
const calendarOptions = {
	sameDay: 'HH:mm',
	lastDay: '[Yesterday]',
	lastWeek: 'dddd',
	sameElse: 'YYYY-MM-DD'
};

const getChats = async (setChats) => {
	const request = await fetch('/api/chat');
	const response = await request.json();

	if (response.success) {
		response.data.sort((first, second) => sortChats(second, first));
		response.data.forEach((chat) => {
			if (chat.lastMessage) {
				chat.lastMessage.displayDate = formatDate(chat.lastMessage.updatedAt);
			} else {
				chat.displayDate = formatDate(chat.updatedAt);
			}
			// Connect to socket
			connectToSocket(chat, setChats);
		});
		return response.data;
	}
	return null;
};

const getMessages = async (chatId) => {
	const request = await fetch(`/api/message/?chatId=${chatId}`);
	const response = await request.json();
	if (response.success) {
		return response.data;
	}
	return [];
};

const deleteChat = async (id) => {
	const request = await fetch('/api/chat/', {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			id
		})
	});
	const response = await request.json();
	if (response.success) {
		return response.data;
	}
	return [];
};

const leaveChat = async (chatId) => {
	const request = await fetch('/api/chat/leave', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			chatId
		})
	});
	const response = await request.json();
	if (response.success) {
		return response.data;
	}
	return [];
};

const getChat = async (id) => {
	const request = await fetch(`/api/chat/?ids=${id}`);
	const response = await request.json();
	if (response.success) {
		return response.data[0];
	} else {
		return null;
	}
};

const getUsers = async () => {
	const request = await fetch(`/api/user/`);
	const response = await request.json();
	if (response.success) {
		return response.data;
	} else {
		return [];
	}
};

const formatDate = (date, altOption) => {
	if (altOption && typeof altOption === 'object') {
		for (const key in altOption) {
			if (Object.hasOwnProperty.call(altOption, key)) {
				if (key in calendarOptions) {
					calendarOptions[key] = altOption[key];
				}
			}
		}
	}

	return dayjs(date).calendar(null, calendarOptions);
};

const dateDiff = (date, otherDate) => dayjs(dayjs(date).format()).diff(dayjs(otherDate).format(), 'hour');

const sortChats = (chat, otherChat) => {
	const chatDate = chat.lastMessage ? new Date(chat.lastMessage.updatedAt) : new Date(chat.updatedAt);
	const otherChatDate = otherChat.lastMessage
		? new Date(otherChat.lastMessage.updatedAt)
		: new Date(otherChat.updatedAt);
	return chatDate - otherChatDate;
};

const connectToSocket = (chat, setChats, chats = [], initial = false) => {
	socket.on(`chat-${chat.id}`, (newMessage) => {
		if (!newMessage) return;
		chat.lastMessage = JSON.parse(JSON.stringify(newMessage));
		chat.lastMessage.displayDate = formatDate(chat.lastMessage.updatedAt);
		if (chat.messages && !chat.messages.includes(newMessage)) chat.messages.push(newMessage);

		if (initial) {
			setChats([chat, ...chats]);
		} else {
			setChats((chats) => [...chats.sort((first, second) => sortChats(second, first))]);
		}
	});
};

const emitMessage = (chatId, userId, message) => {
	socket.emit(`message`, chatId, { message: message, userId: userId });
};

const NavItem = styled.button`
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 50%;
	padding: 0.5rem;
	&:hover {
		background-color: #e5e5e5;
	}
	&:focus {
		outline: none;
		background-color: #e5e5e5;
	}
`;

export {
	getChats,
	getMessages,
	deleteChat,
	leaveChat,
	getChat,
	getUsers,
	formatDate,
	dateDiff,
	sortChats,
	connectToSocket,
	emitMessage,
	NavItem
};
