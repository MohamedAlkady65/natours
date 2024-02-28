class APIFeatures {
	constructor(query, queryObj) {
		this.query = query;
		this.queryObj = queryObj;
	}

	filter() {
		const queryObj = { ...this.queryObj };
		const excludedParams = ["limit", "sort", "page", "fields"];

		excludedParams.forEach((e) => delete queryObj[e]);

		let queryStr = JSON.stringify(queryObj);

		queryStr = queryStr.replace(
			/\b(gte|gt|lt|lte)\b/g,
			(match) => `$${match}`
		);

		const filter = JSON.parse(queryStr);


		this.query.find(filter);
		return this;
	}

	sort() {
		
		if (this.queryObj.sort) {
			const sortBy = this.queryObj.sort.replace(",", " ");
			this.query.sort(sortBy);
		} else {
			this.query.sort("-createdAt");
		}
		return this;
	}

	fields() {
		if (this.queryObj.fields) {
			const fields = this.queryObj.fields.replace(",", " ");

			this.query.select(fields);
			// query.select("-_id " + fields);
			// query.select("name duration price")
			// query.select("-__v")
		}
		return this;
	}
	pagination() {
		if (!this.queryObj.page) return this;

		let page = this.queryObj.page * 1 || 1;
		page = page < 1 ? 1 : page;
		const limit = this.queryObj.limit * 1 || 10;
		const skip = (page - 1) * limit;
		this.query.skip(skip).limit(limit);

		// if (this.queryObj.page) {
		// 	const count = await Tour.countDocuments();
		// 	// const maxPage = Math.ceil(count / limit);
		// 	if (skip >= count) {
		// 		throw new Error("This page is not exist");
		// 	}
		// }
		return this;
	}

	async excute() {
		return await this.query;
	}
}

module.exports = APIFeatures;
