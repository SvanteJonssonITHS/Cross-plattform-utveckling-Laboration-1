// External dependencies
import { MdOutlinePerson, MdEditNote, MdSearch } from 'react-icons/md';
import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
const socket = io();
import dayjs from 'dayjs';
import calendar from 'dayjs/plugin/calendar';
dayjs.extend(calendar);

// Internal dependencies
import { ChatBox, ChatCard, ConfirmAction, CreateChat, UpdateChat, UpdateUser } from '../components';

const calendarOptions = {
	sameDay: 'HH:mm',
	lastDay: '[Yesterday]',
	lastWeek: 'dddd',
	sameElse: 'YYYY-MM-DD'
};

const getChats = async () => {
	const request = await fetch('/api/chat');
	const response = await request.json();

	if (response.success) {
		response.data.forEach((chat) => {
			if (chat.lastMessage) {
				chat.lastMessage.updatedAt = dayjs(chat.lastMessage.updatedAt).calendar(null, calendarOptions);
			} else {
				chat.updatedAt = dayjs(chat.updatedAt).calendar(null, calendarOptions);
			}
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

export default function () {
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

	const [chats, setChats] = useState(null);
	const [search, setSearch] = useState('');
	const [selectedChat, setSelectedChat] = useState(null);
	const [updateUserOpen, setUpdateUserOpen] = useState(false);
	const [createChatOpen, setCreateChatOpen] = useState(false);
	const [updateChatOpen, setUpdateChatOpen] = useState(false);
	const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
	const [confirmLeaveOpen, setConfirmLeaveOpen] = useState(false);

	useEffect(() => {
		(async () => {
			if (!chats) setChats(await getChats());
			else {
				chats.forEach((chat) => {
					socket.on(`chat-${chat.id}`, async (newMessage) => {
						if (!newMessage) return;
						chat.lastMessage = newMessage.dataValues;
						setChats([...chats]);
					});
				});
			}
		})();
	}, [chats]);

	return (
		<div className="flex h-screen w-screen bg-gray-900">
			<main className="m-auto flex h-5/6 w-10/12 rounded-md bg-white p-2">
				<section className="flex h-full w-4/12 flex-col border-r-2 pr-2">
					<nav className="text-blue-500">
						<ul className="flex items-center justify-between">
							<li>
								<NavItem title="View profile" onClick={() => setUpdateUserOpen(true)}>
									<MdOutlinePerson size="1.5em" />
								</NavItem>
							</li>
							<li>
								<NavItem title="Create new chat" onClick={() => setCreateChatOpen(true)}>
									<MdEditNote size="1.5em" />
								</NavItem>
							</li>
						</ul>
					</nav>
					<h2 className="mb-2 text-3xl font-semibold">Chats</h2>
					<div className="relative mb-2">
						<span className="absolute inset-y-0 left-0 flex items-center pl-2 text-neutral-500">
							<MdSearch size="1.25em" />
						</span>
						<input
							type="search"
							className="w-full rounded-md bg-neutral-200 px-2 py-1 pl-10 text-black focus:outline-none"
							placeholder="Search"
							autoComplete="off"
							onChange={(e) => setSearch(e.target.value)}
						/>
					</div>
					<ul className="flex grow flex-col overflow-y-scroll" tabIndex="-1">
						{chats &&
							chats.map((chat) => (
								<li className="mb-2" key={chat.id}>
									{chat.name && chat.name.toLowerCase().includes(search.toLowerCase()) && (
										<ChatCard
											name={chat.name}
											user={chat.lastMessage ? chat.lastMessage.user.name : null}
											message={chat.lastMessage ? chat.lastMessage.message : null}
											time={chat.lastMessage ? chat.lastMessage.updatedAt : chat.updatedAt}
											onClick={async () => {
												if (!chat.messages) {
													const messages = await getMessages(chat.id);
													setChats(
														chats.map((c) => {
															if (c.id === chat.id) c.messages = messages;
															return c;
														})
													);
												}
												setSelectedChat(chat);
											}}
										/>
									)}
								</li>
							))}
						{((chats && chats.length === 0) ||
							(chats &&
								chats.filter((chat) => chat.name.toLowerCase().includes(search.toLowerCase()))
									.length === 0)) && <li className="text-center text-neutral-500">No chats found</li>}
					</ul>
				</section>
				<section className="flex h-full w-8/12 pl-2">
					{selectedChat ? (
						<ChatBox
							chat={selectedChat}
							onDelete={() => setConfirmDeleteOpen(true)}
							onLeave={() => setConfirmLeaveOpen(true)}
							onEdit={() => setUpdateChatOpen(true)}
						/>
					) : (
						<p className="m-auto text-neutral-500">No chat selected</p>
					)}
				</section>
			</main>
			<UpdateUser isOpen={updateUserOpen} onClose={() => setUpdateUserOpen(false)} />
			<CreateChat
				isOpen={createChatOpen}
				onClose={(newChat) => {
					setCreateChatOpen(false);
					if (newChat) {
						newChat.updatedAt = dayjs(newChat.updatedAt).calendar(null, calendarOptions);
						setChats([...chats, newChat]);
					}
				}}
			/>
			<UpdateChat
				isOpen={updateChatOpen}
				onClose={(updatedChat) => {
					setUpdateChatOpen(false);
					if (updatedChat) {
						updatedChat.updatedAt = dayjs(updatedChat.updatedAt).calendar(null, calendarOptions);
						setChats(chats.map((chat) => (chat.id === updatedChat.id ? updatedChat : chat)));
					}
				}}
				chatId={selectedChat ? selectedChat.id : null}
			/>
			<ConfirmAction
				isOpen={confirmDeleteOpen}
				onDismiss={() => setConfirmDeleteOpen(false)}
				onConfirm={async () => {
					await deleteChat(selectedChat.id);
					setChats(chats.filter((chat) => chat.id !== selectedChat.id));
					setSelectedChat(null);
					setConfirmDeleteOpen(false);
				}}
			/>
			<ConfirmAction
				isOpen={confirmLeaveOpen}
				onDismiss={() => setConfirmLeaveOpen(false)}
				onConfirm={async () => {
					await leaveChat(selectedChat.id);
					setChats(chats.filter((chat) => chat.id !== selectedChat.id));
					setSelectedChat(null);
					setConfirmLeaveOpen(false);
				}}
			/>
		</div>
	);
}
