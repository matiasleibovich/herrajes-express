module.exports = {
	apps: [{
		name: "herrajes-express",
		cwd: "/var/www/herrajes-express-app",
		script: "server.js",
		instances: 1,
		exec_mode: "fork",
		env: {
			NODE_ENV: "production",
			PORT: "3000",
			HOSTNAME: "127.0.0.1",
			HE_CATALOGO_API_BASE: "https://api-gs.sostenmutuo.com",
			HE_SITE_URL: "https://www.herrajes-express.com",
			HE_LEGACY_DIR: "/var/www/herrajes-express.com/web/herrajes",
		},
	}],
};
