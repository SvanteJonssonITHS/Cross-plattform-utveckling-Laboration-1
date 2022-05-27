// External dependencies
import { useEffect, useState, useContext } from 'react';
import { MdMoreVert, MdEdit, MdLogout, MdDelete } from 'react-icons/md';
import styled from 'styled-components';

// Internal dependencies
import { UserContext } from '../contexts';

export default (prop) => {
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

	const { userId } = useContext(UserContext);
	const name = prop.chat.name || null;
	const [messages, setMessages] = useState(prop.chat.messages || []);
	const [showDropdown, setShowDropdown] = useState(false);

	return (
		<>
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
									<li>
										<button className="flex w-full items-center rounded-md py-1 px-2 font-medium text-black hover:bg-neutral-300">
											<MdEdit className="mr-2" />
											Edit
										</button>
									</li>
									{userId === prop.chat.ownerId ? (
										<li>
											<button className="flex w-full items-center rounded-md py-1 px-2 font-medium text-red-500 hover:bg-neutral-300" 
											onClick={() => prop.onDelete()}>
												<MdDelete className="mr-2" />
												Delete
											</button>
										</li>
									) : (
										<li>
											<button className="flex w-full items-center rounded-md py-1 px-2 font-medium text-red-500 hover:bg-neutral-300"
											onClick={() => prop.onLeave()}>
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
		</>
	);
};
