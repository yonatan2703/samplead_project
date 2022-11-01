import React, { useState } from "react";
import { Spinner, Heading, Box, Button } from "@chakra-ui/react";

import DataTable from "./DataTable";

export default function UserSeesionData({ session, tableData, header }) {
	const [viewSession, setViewSession] = useState(false);
	return (
		<Box>
			<Box
				display="flex"
				flexDir="column"
				justifyContent="center"
				alignItems="center"
			>
				<Box display="flex" mt="5">
					<Heading size="md" mr="5">
						{session}
					</Heading>
					<Button onClick={() => setViewSession(!viewSession)}>
						{viewSession ? "Hide Session" : "View Session"}
					</Button>
				</Box>

				{viewSession && <DataTable header={header} data={tableData} />}
			</Box>
		</Box>
	);
}
