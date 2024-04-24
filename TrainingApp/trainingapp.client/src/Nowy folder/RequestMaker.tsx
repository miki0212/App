


//400 - Error
//409 - Conflict
//200 - OK

export default class RequestMaker{
	private baseUrl: string;

	constructor(baseUrl: string) {
		this.baseUrl = baseUrl;
	}

	async get<T>(endpoint: string) {
		const url = `${this.baseUrl}${endpoint}`
		fetch(url, {
			method: "GET",
			headers: {
				'Content-type': 'application/json',
				'Access-Control-Allow-Origin': "*"
			},
		}).then(response => {

			if (response.status === 400) {
				throw new Error('Wyst¹pi³ b³¹d serwera !!!');
			}

			if (response.status === 409) {
				throw new Error(`${response.text()}`);
			}

			if (response.status === 200) {
				return response.json();
			}
		}).then(data => {
			return data as T;
		}).catch(error => {
			console.error(error);
			return error;
		});
	}

	async post<T>(endpoint: string,data? : any) {
		const url = `${this.baseUrl}${endpoint}`
		fetch(url, {
			method: "POST",
			headers: {
				'Content-type': 'application/json',
				'Access-Control-Allow-Origin': "*"
			},
			body: JSON.stringify(data)
		}).then(response => {

			if (response.status === 400) {
				throw new Error('Wyst¹pi³ b³¹d serwera !!!');
			}

			if (response.status === 409) {
				throw new Error(`${response.text()}`);
			}

			if (response.status === 200) {
				return response.json();
			}
		}).then(data => {
			return data as T;
		}).catch(error => {
			console.error(error);
			return error;
		});
	}
}

//export default async function RequestMaker<T>(url: string, requestType: string, data : any) {

//	return await fetch(url, {
//		method: requestType,
//		headers: {
//			'Content-type': 'application/json',
//			'Access-Control-Allow-Origin': "*"
//		},
//		body: JSON.stringify(data)
//	}).then(response => {
//		if (response.status === 400) {
//			return "Wyst¹pi³ b³¹d serwera !!!"
//		}

//		if (response.status === 409) {
//			return response.text();
//		}

//		if (response.status === 200) {
//			return response.json();
//		}
//	}).then(data => {
//		return data as T;
//	})

//}