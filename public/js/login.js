import axios from "axios";
import { showAlert } from "./alerts";

export const login = async (email, password) => {
	try {
		const res = await axios({
			method: "POST",
			url: "/api/v1/users/signIn",
			data: {
				email,
				password,
			},
		});
		if (res.data.status === "success") {
			showAlert("success", "Logged In Successfully");
			window.setTimeout(() => {
				location.assign("/");
			}, 500);
		}
	} catch (error) {
		showAlert("error", error.response.data.message);
	}
};
export const logout = async () => {
	try {
		const res = await axios({
			method: "POST",
			url: "/api/v1/users/signOut",
		});
		if (res.data.status === "success") {
			showAlert("success", "Logged Out Successfully");
			window.setTimeout(() => {
				location.reload(true);
			}, 500);
		}
	} catch (error) {
		showAlert("error", error.response.data.message);
	}
};
