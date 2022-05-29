// External dependencies
import { useEffect, useState, useContext, useRef } from 'react';
import { MdMoreVert, MdEdit, MdLogout, MdDelete } from 'react-icons/md';
import styled from 'styled-components';
import dayjs from 'dayjs';
import calendar from 'dayjs/plugin/calendar';
dayjs.extend(calendar);

// Internal dependencies
import { UserContext } from '../contexts';

const formatDate = (date) => {
	return dayjs(date).calendar(null, {
	sameDay: 'HH:mm',
	lastDay: '[Yesterday]',
	lastWeek: 'dddd',
	sameElse: 'YYYY-MM-DD'
});
};

const dateDiff = (date, otherDate) => dayjs(dayjs(date).format()).diff(dayjs(otherDate).format(), 'hour');

const NavItem = styled.button`
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		padding: 0.5rem;
		margin-bottom: 0.5rem;
		&:hover {
			background-color: #e5e5e5;
		}
		&:focus {
			outline: none;
			background-color: #e5e5e5;
		}
	`;

export default (prop) => {
	const { userId } = useContext(UserContext);
	const name = prop.chat.name || null;
	const [messages, setMessages] = useState(prop.chat.messages || []);
	const [showDropdown, setShowDropdown] = useState(false);
	const chatEndElement = useRef(null);
	const scrollToBottom = () => chatEndElement.current.scrollIntoView({ behavior: "smooth" });


	useEffect(() => {
		setMessages(prop.chat.messages);
		scrollToBottom();
	}, [prop, messages]);

	return (
		<section className='flex h-full w-full flex-col'>
			<nav className="w-full">
				<ul className="flex w-full items-center justify-between">
					<li className="w-1/2">
						<h2 className="truncate text-lg font-semibold">{name}</h2>
					</li>
					<li>
						<div className="relative">
							<NavItem onClick={() => setShowDropdown(!showDropdown)}>
								<MdMoreVert size="1.5em" className="text-blue-500" />
							</NavItem>

							{showDropdown && (
								<ul className="absolute right-0 z-50 w-40 rounded-md bg-neutral-200">
									{userId === prop.chat.ownerId && (
										<li>
											<button
												className="flex w-full items-center rounded-md py-1 px-2 font-medium text-black hover:bg-neutral-300"
												onClick={() => prop.onEdit()}
											>
												<MdEdit className="mr-2" />
												Edit
											</button>
										</li>
									)}
									{userId === prop.chat.ownerId ? (
										<li>
											<button
												className="flex w-full items-center rounded-md py-1 px-2 font-medium text-red-500 hover:bg-neutral-300"
												onClick={() => prop.onDelete()}
											>
												<MdDelete className="mr-2" />
												Delete
											</button>
										</li>
									) : (
										<li>
											<button
												className="flex w-full items-center rounded-md py-1 px-2 font-medium text-red-500 hover:bg-neutral-300"
												onClick={() => prop.onLeave()}
											>
												<MdLogout className="mr-2" />
												Leave
											</button>
										</li>
									)}
								</ul>
							)}
						</div>
					</li>
				</ul>
			</nav>
			<ul className='chat-box grow overflow-y-scroll pr-4'>
				{messages && messages.map((message, index) => (
					<li className={`w-full pb-1 flex flex-col ${message.user.id == userId ? 'items-end' : 'items-start'}`} key={message.id} ref={chatEndElement}>
					{
						index-1 >= 0 && message.user.id == messages[index-1].user.id && dateDiff(message.updatedAt, messages[index - 1].updatedAt) < 1 ? null : (
							<span className='pt-1 text-xs text-neutral-500'>{message.user.name + ' ' + formatDate(message.updatedAt)}</span>
						)}
						<p className={`w-fit max-w-lg break-words rounded-md px-2 py-1 ${message.user.id == userId ? 'bg-green-500 text-white' : 'bg-neutral-200 text-black'}`}>{message.message}</p>
					</li>
				))}
			</ul>
			<form>
				<input
					className="mt-2 w-full rounded-md bg-neutral-200 px-2 py-1 text-sm font-medium text-black"
					type="text"
					placeholder="Type a message..."
					onKeyPress={(e) => {
						if (e.key === 'Enter') {
							e.preventDefault();
							prop.onSend(e.target.value, userId);
							e.target.value = '';
						}
					}}
				/>
			</form>
		</section>
	);
};
