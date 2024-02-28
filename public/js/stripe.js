import { showAlert } from "./alerts";
import axios from "axios";

const stripe = Stripe(
	"pk_test_51Nkr1XGBhxNc8XddaBViqjZDpHbJpD4BR1GYpY0AsM5cNRrqAbBWZyL1NjsWHawL96nq0MaBQjNisDy6Wu2QQWYT00YVAsu6cZ"
);

export const bookTour = async (tourId) => {
	try {
		const res = await axios({
			method: "GET",
			url: `http://127.0.0.1:3000/api/v1/booking/checkOut/${tourId}`,
		});
		if (res.data.status === "success") {
			await stripe.redirectToCheckout({ sessionId: res.data.session.id });
		} else {
			showAlert("error", "Something Went Wrong");
		}
	} catch (error) {
		console.log(error);
		// showAlert("error", error.response.data.message);
	}
};
