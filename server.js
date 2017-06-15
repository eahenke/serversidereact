//Express and Middleware
import express from 'express';
import compression from 'compression';
import bodyParser from 'body-parser';

//React
import React from 'react';
import { renderToString } from 'react-dom/server'

//App
import App from './src/app/index';
import template from './template';

const server = express();
server.use(compression());
server.use(bodyParser.json());
server.use('/dist', express.static('dist'));

server.get('/', (req, res) => {
	const initialState = {
		hello: 'Hello',
		world: 'World.'
	};
	const appString = renderToString(<App {...initialState}/>);
	res.send(template({
		body: appString,
		title: 'Server Side React',
		initialState: JSON.stringify(initialState)
	}));
});

server.listen(8080, () => {
	console.info('Server started on port 8080');
});