// External dependencies
import { useEffect, useState } from 'react';
import { MdOutlinePerson, MdEditNote, MdSearch } from 'react-icons/md';

// Internal dependencies
import { ChatBox, ChatCard, ConfirmAction, CreateChat, UpdateChat, UpdateUser } from '../components';
import {
	getChats,
	getMessages,
	deleteChat,
	leaveChat,
	connectToSocket,
	formatDate,
	emitMessage,
	NavItem
} from '../misc/';

export default function () {
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
			setChats(await getChats(setChats));
		})();
	}, []);

	return (
		<div className="flex h-screen w-screen bg-gray-900">
			<main className="m-auto flex h-screen w-full rounded-none bg-white p-2 lg:h-5/6 lg:w-10/12 lg:rounded-md">
				<section
					className={`flex h-full w-full flex-col border-r-2 pr-2 sm:w-1/2 md:w-5/12 lg:w-4/12 ${
						selectedChat ? 'hidden sm:flex' : 'flex'
					}`}
				>
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
											time={chat.lastMessage ? chat.lastMessage.displayDate : chat.displayDate}
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
				<section
					className={`h-full w-full pl-2 sm:w-1/2 md:w-7/12 lg:w-8/12 ${
						selectedChat ? 'flex' : 'hidden sm:flex'
					}`}
				>
					{selectedChat ? (
						<ChatBox
							chat={selectedChat}
							onDelete={() => setConfirmDeleteOpen(true)}
							onLeave={() => setConfirmLeaveOpen(true)}
							onEdit={() => setUpdateChatOpen(true)}
							onBack={() => setSelectedChat(null)}
							onSend={(message, userId) => emitMessage(selectedChat.id, userId, message)}
						/>
					) : (
						<p className="m-auto text-neutral-500">No chat selected</p>
					)}
				</section>
			</main>
			<UpdateUser isOpen={updateUserOpen} onClose={() => setUpdateUserOpen(false)} />
			<CreateChat
				isOpen={createChatOpen}
				onClose={async (newChat) => {
					setCreateChatOpen(false);
					if (newChat) {
						newChat.displayDate = formatDate(newChat.updatedAt);
						connectToSocket(newChat, setChats, chats, true);
						setChats([newChat, ...chats]);
					}
				}}
			/>
			<UpdateChat
				isOpen={updateChatOpen}
				onClose={(updatedChat) => {
					setUpdateChatOpen(false);
					if (updatedChat) {
						updatedChat.displayDate = formatDate(updatedChat.updatedAt);
						setChats(chats.map((chat) => (chat.id === updatedChat.id ? updatedChat : chat)));
						if (selectedChat.id === updatedChat.id) {
							updatedChat.lastMessage = selectedChat.lastMessage;
							if (selectedChat.messages) updatedChat.messages = [...selectedChat.messages];
							setSelectedChat(updatedChat);
						}
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
