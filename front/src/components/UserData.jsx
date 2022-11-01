import React, { useState } from "react";
import { Grid, GridItem, Heading, Box, Button } from "@chakra-ui/react";

import UserSessionData from "./UserSessionData";

export default function UserData({ username, userData, header }) {
	const [viewSessions, setViewSessions] = useState(false);
	return (
		<Box
			display="flex"
			flexDir="column"
			justifyContent="center"
			alignItems="center"
		>
			<Box display="flex" mt="5">
				<Heading size="lg" mr="5">
					{username}
				</Heading>
				<Button onClick={() => setViewSessions(!viewSessions)}>
					{viewSessions ? "Hide Sessions" : "View Sessions"}
				</Button>
			</Box>
			{viewSessions && (
				<>
					{Object.entries(userData).map(([session, tableData]) => {
						return (
							<UserSessionData
								key={session}
								session={session}
								tableData={tableData}
								header={header}
							/>
						);
					})}
				</>
			)}
		</Box>
	);
}
