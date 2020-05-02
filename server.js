const express = require('express');
const FormData = require('form-data');
const axios = require('axios');
const cors = require('cors');
const queryString = require('query-string');

const app = express();
const PORT = process.env.SERVER_PORT;
const client_id = process.env.GITHUB_CLIENT_ID;

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Enabled Access-Control-Allow-Origin"
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	next();
});

app.get('/gh-client', async (req, res) => {
	const githubAuthCodeUrl = process.env.GITHUB_AUTHO_ACCESS_CODE;

	const codeAuthParams = {
		scope: 'user',
		client_id,
		url: githubAuthCodeUrl,
	};

	res.send(JSON.stringify(codeAuthParams));
	/*
	// const { client_id, redirect_uri, client_secret, code } = req.body;
	const accessTokenUrl = process.env.GITHUB_AUTHO_ACCESS_TOKEN;
	const userUrl = process.env.GITHUB_AUTHO_USER;

	const dataForm = FormData();
	dataForm.append('client_id', client_id);
	dataForm.append('client_secret', client_secret);
	dataForm.append('code', code);
	dataForm.append('redirect_uri', redirect_uri);

	// Request to exchange code for an access token
	axios({
		url: accessTokenUrl,
		method: 'post',
		withCredentials: true,
		data: dataForm,
	})
		.then((response) => {
			let params = new URLSearchParams(response.data);
			const access_token = params.get('access_token');
			const scope = params.get('scope');
			const token_type = params.get('token_type');

			// Request to return data of a user that has been authenticated
			return axios.get(
				`${userUrl}?access_token=${access_token}&scope=${scope}&token_type=${token_type}`
			);
		})
		.then((response) => response.data)
		.catch((error) => {
			if (error.response) {
				// The request was made and the server responded with a status code
				// that falls out of the range of 2xx
				console.log(error.response.data);
				console.log(error.response.status);
				console.log(error.response.headers);
			} else if (error.request) {
				// The request was made but no response was received
				// `error.request` is an instance of XMLHttpRequest in the browser and an instance of
				// http.ClientRequest in node.js
				console.log(error.request);
			} else {
				// Something happened in setting up the request that triggered an Error
				console.log('Error', error.message);
			}
			console.log(error.config);
		});*/
});

app.post('/gh-token', async (req, res) => {
	const code = req.body.params.code;
	res.append('Content-type', 'application/json');
	try {
		const githubTokenAuhtUrl = process.env.GITHUB_AUTHO_ACCESS_TOKEN;
		const client_secret = process.env.GITHUB_CLIENT_SECRET;
		const redirect_uri = process.env.APP_REDIRECT_URI;
		const params = queryString.stringify({
			client_id,
			client_secret,
			code,
			redirect_uri,
		});
		const authUrl = `${githubTokenAuhtUrl}?${params}`;
		const response = await axios.post(authUrl);

		res.send(response.data);
	} catch (error) {
		if (error.response) {
			// The request was made and the server responded with a status code
			// that falls out of the range of 2xx
			console.log(error.response.data);
			console.log(error.response.status);
			console.log(error.response.headers);
		} else if (error.request) {
			// The request was made but no response was received
			// `error.request` is an instance of XMLHttpRequest in the browser and an instance of
			// http.ClientRequest in node.js
			console.log(error.request);
		} else {
			// Something happened in setting up the request that triggered an Error
			console.log('Error', error.message);
		}
		console.log(error.config);
	}
});

app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
