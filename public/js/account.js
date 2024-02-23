import axios from "axios";
import { showAlert } from "./alerts";

export const updateUser = async (email, name) => {
	try {
		const res = await axios({
			method: "PATCH",
			url: "http://127.0.0.1:3000/api/v1/users/updateMe",
			data: {
				email,
				name,
			},
		});
		if (res.data.status === "success") {
			showAlert("success", "Updated Successfully");
		}
	} catch (error) {
		showAlert("error", error.response.data.message);
	}
};
export const updatePassword = async (
	oldPassword,
	newPassword,
	confirmNewPassword
) => {
	try {
		const res = await axios({
			method: "PATCH",
			url: "http://127.0.0.1:3000/api/v1/users/updatePassword",
			data: {
				oldPassword,
				newPassword,
				confirmNewPassword,
			},
		});
		if (res.data.status === "success") {
			showAlert("success", "Updated Successfully");
		}
	} catch (error) {
		showAlert("error", error.response.data.message);
	}
};
