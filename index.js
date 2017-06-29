/*!
 * express json server
 * xiewulong <xiewulong@vip.qq.com>
 * create: 2017/06/29
 * since: 0.0.1
 */
'use strict';

const fs = require('fs');
const path = require('path');
const express = require('express');
const jsonServer = require('json-server');
const pause = require('connect-pause');

const defaultOptions = {
	delay: 0,
	id: 'id',
	json: 'db.json',
	noCors: false,
	noGzip: false,
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
		this.routes();
		this.middlewares();
		this.delay();
		this.defaults();
		this.tables();
		this.router();

	}

	routes() {
		if(!this.options.routes) {
			return;
		}

		this.app.use(this.options.route, jsonServer.rewriter(this.options.routes));
	}

	middlewares() {
		if(!this.options.middlewares) {
			return;
		}

		this.app.use(this.options.route, this.options.middlewares);
	}

	delay() {
		if(!this.options.delay) {
			return;
		}

		this.app.use(this.options.route, pause(this.options.delay));
	}

	defaults() {

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
			this.options.json = defaultOptions.json;
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
