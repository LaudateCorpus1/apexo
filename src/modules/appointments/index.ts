import * as appointmentsComponents from "./components";
import * as appointmentsData from "./data";

import { API } from "../../core";

export const register = {
	async register() {
		API.router.register(
			appointmentsData.namespace,
			/^appointments/,
			appointmentsComponents.Calendar,
			() => API.user.currentUser.canViewAppointments
		);
		API.menu.items.push({
			icon: "Calendar",
			name: appointmentsData.namespace,
			key: appointmentsData.namespace,
			onClick: () => {
				API.router.go([appointmentsData.namespace]);
			},
			order: 3,
			url: "",
			condition: () => API.user.currentUser.canViewAppointments
		});
		await (API.connectToDB(
			appointmentsData.namespace,
			appointmentsData.namespace,
			true
		) as any)(appointmentsData.Appointment, appointmentsData.appointments);
		return true;
	},
	order: 9
};

// export data
export { appointmentsData };
export { appointmentsComponents };
