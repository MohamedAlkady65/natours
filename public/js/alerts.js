export const hideAlert = () => {
	document.querySelector(".alert").remove();
};
export const showAlert = (type, msg, time = 3) => {
	const popUp = `<div class="alert alert--${type}" >${msg}</div>`;
	document.body.insertAdjacentHTML("afterbegin", popUp);
	window.setTimeout(hideAlert, time * 1000);
};
