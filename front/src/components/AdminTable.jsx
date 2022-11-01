import React from "react";
import { Heading } from "@chakra-ui/react";

import UserData from "./UserData";

export default function AdminTable({ adminData, header }) {
	return (
		<div>
			<Heading mt="5">Admin Data</Heading>
			{Object.entries(adminData).map(([username, userData]) => {
				return (
					<UserData
						key={username}
						header={header}
						username={username}
						userData={userData}
					/>
				);
			})}
		</div>
	);
}
