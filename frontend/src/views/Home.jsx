// External dependencies
import { MdOutlinePerson, MdEditNote, MdSearch } from 'react-icons/md';
import styled from 'styled-components';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import calendar from 'dayjs/plugin/calendar';
dayjs.extend(calendar);

// Internal dependencies
import ChatCard from '../components/ChatCard';
import ChatBox from '../components/ChatBox';
import UpdateUser from '../components/UpdateUser';

const calendarOptions = {
	sameDay: 'hh:mm',
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
	return [];
};

const getMessages = async (chatId) => {
	const request = await fetch(`/api/message/?chatId=${chatId}`);
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

	const [chats, setChats] = useState([]);
	const [search, setSearch] = useState('');
	const [selectedChat, setSelectedChat] = useState(null);
	const [updateUserOpen, setUpdateUserOpen] = useState(true);

	useEffect(() => {
		(async () => {
			await setChats(await getChats());
		})();
	}, []);

	return (
		<div className="w-screen h-screen flex bg-gray-900">
			<main className="m-auto w-10/12 h-5/6 bg-white flex p-2 rounded-md">
				<section className="w-4/12 h-full pr-2 border-r-2 flex flex-col">
					<nav className="text-blue-500">
						<ul className="flex justify-between items-center">
							<li>
								<NavItem title="View profile" onClick={() => setUpdateUserOpen(true)}>
									<MdOutlinePerson size="1.5em" />
								</NavItem>
							</li>
							<li>
								<NavItem title="Create new chat">
									<MdEditNote size="1.5em" />
								</NavItem>
							</li>
						</ul>
					</nav>
					<h2 className="font-semibold text-3xl mb-2">Chats</h2>
					<div className="relative mb-2">
						<span className="absolute inset-y-0 left-0 flex items-center pl-2 text-neutral-500">
							<MdSearch size="1.25em" />
						</span>
						<input
							type="search"
							className="w-full bg-neutral-200 text-black rounded-md px-2 py-1 pl-10 focus:outline-none"
							placeholder="Search"
							autoComplete="off"
							onChange={(e) => setSearch(e.target.value)}
						/>
					</div>
					<ul className="flex flex-col overflow-y-scroll grow" tabIndex="-1">
						{chats.map((chat) => (
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
						{(chats.length === 0 ||
							chats.filter((chat) => chat.name.toLowerCase().includes(search.toLowerCase())).length ===
								0) && <li className="text-center text-neutral-500">No chats found</li>}
					</ul>
				</section>
				<section className="w-8/12 h-full pl-2 flex">
					{selectedChat ? (
						<ChatBox chat={selectedChat} />
					) : (
						<p className="m-auto text-neutral-500">No chat selected</p>
					)}
				</section>
			</main>
			<UpdateUser isOpen={updateUserOpen} onClose={() => setUpdateUserOpen(false)} />
		</div>
	);
}
