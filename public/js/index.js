import { updatePassword, updateUser } from "./account";
import { showAlert } from "./alerts";
import { login, logout } from "./login";
import { bookTour } from "./stripe";
const loginForm = document.querySelector(".form--login");
const logoutBtn = document.querySelector(".nav__el--logout");
const userDataForm = document.querySelector(".form-user-data");
const userSettingsForm = document.querySelector(".form-user-settings");
const map = document.getElementById("map");
const bookTourBtn = document.getElementById("book-tour-btn");

if (map) {
	const locations = JSON.parse(map.dataset.locations);
}

if (loginForm) {
	loginForm.addEventListener("submit", async (e) => {
		console.log(123);
		e.preventDefault();
		const email = document.getElementById("email").value;
		const password = document.getElementById("password").value;
		await login(email, password);
	});
}

if (logoutBtn) {
	logoutBtn.addEventListener("click", logout);
}

if (userDataForm) {
	userDataForm.addEventListener("submit", async (e) => {
		e.preventDefault();
		const email = document.getElementById("email").value;
		const name = document.getElementById("name").value;
		await updateUser(email, name);
	});
}

if (userSettingsForm) {
	userSettingsForm.addEventListener("submit", async (e) => {
		e.preventDefault();
		const oldPassword = document.getElementById("password-current").value;
		const newPassword = document.getElementById("password").value;
		const confirmNewPassword =
			document.getElementById("password-confirm").value;

		await updatePassword(oldPassword, newPassword, confirmNewPassword);
	});
}

if (bookTourBtn) {
	bookTourBtn.addEventListener("click", async (e) => {
		const oldContent = e.target.textContent;
		e.target.textContent = "Processing...";
		await bookTour(e.target.dataset.tourid);
		e.target.textContent = oldContent;
	});
}

const alertMessage = document.querySelector("body").dataset.alert;
if (alertMessage) showAlert("success", alertMessage, 15);
