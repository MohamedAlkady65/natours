import { login, logout } from "./login";

const loginForm = document.querySelector(".form");
const logoutBtn = document.querySelector(".nav__el--logout");
const map = document.getElementById("map");

if (map) {
	const locations = JSON.parse(map.dataset.locations);
}

if (loginForm) {
	loginForm.addEventListener("submit", async (e) => {
		e.preventDefault();
		const email = document.getElementById("email").value;
		const password = document.getElementById("password").value;
		await login(email, password);
	});
}

if (logoutBtn) {
	logoutBtn.addEventListener("click", logout);
}
