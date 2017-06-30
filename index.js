/*!
 * express json server
 * xiewulong <xiewulong@vip.qq.com>
 * create: 2017/06/29
 * since: 0.0.1
 */
'use strict';

const fs = require('fs');
const path = require('path');
const compression = require('compression');
const cors = require('cors');
const express = require('express');
const jsonServer = require('json-server');
const pause = require('connect-pause');

const defaultOptions = {
	id: 'id',
	jsonSpaces: 2,
	route: '/api',
	tables: {},
};

class JsonServer {

	constructor(app, dbPath) {
		if(!app || !dbPath) {
			console.error('app and dbPath are required');
			return;
		}

		let options = require(dbPath);

		this.app = app;
		this.dbPath = dbPath;
		this.options = Object.assign({}, defaultOptions, options);

		this.init();

		return this.app;
	}

	init() {
		this.settings();
		this.routes();
		this.middlewares();
		this.delay();
		this.tables();
		this.router();
	}

	settings() {
		this.app.set('json spaces', this.options.jsonSpaces);
	}

	routes() {
		if(!this.options.routes) {
			return;
		}

		this.app.use(this.options.route, jsonServer.rewriter(this.options.routes));
	}

	middlewares() {
		let middlewares = [];
		if(this.options.noGzip) {
			middlewares.push(compression());
		}
		if(!this.options.noCors) {
			middlewares.push(cors({origin: true, credntials: true}));
		}
		if(this.options.readOnly) {
			middlewares.push((req, res, next) => {
				if(req.method == 'GET') {
					next();
				} else {
					res.sendStatus(403);
				}
			});
		}

		// No cache for IE
		// https://support.microsoft.com/en-us/kb/234067
		middlewares.push((req, res, next) => {
			res.header('Cache-Control', 'no-cache');
			res.header('Pragma', 'no-cache');
			res.header('Expires', '-1');

			next();
		});


		if(this.options.middlewares) {
			middlewares = middlewares.concat(this.options.middlewares);
		}

		this.app.use(this.options.route, middlewares);
	}

	delay() {
		if(!this.options.delay) {
			return;
		}

		this.app.use(this.options.route, pause(this.options.delay));
	}

	tables() {
		if(!this.options.json) {
			return;
		}

		let dbPath = this.dbPath;
		let dbStat = fs.statSync(dbPath);
		if(!dbStat.isDirectory()) {
			dbPath = path.dirname(dbPath);
		}

		if(this.options.json === true) {
			this.options.json = 'db.json';
		}

		let jsonPath = `${dbPath}/${this.options.json}`;
		if(!fs.existsSync(jsonPath)) {
			fs.writeFileSync(jsonPath, JSON.stringify(this.options.tables));
		}

		this.options.tables = jsonPath;
	}

	router() {
		let router = jsonServer.router(
			this.options.tables
			, this.options.foreignKeySuffix ? {foreignKeySuffix: this.options.foreignKeySuffix} : undefined
		);

		router.db._.id = this.options.id;

		this.app.use(this.options.route, router);
	}

}

express.application.jsonServer = function(dbPath) {
	return new JsonServer(this, dbPath);
};

module.exports = (app, dbPath) => {
	return new JsonServer(app, dbPath);
};
